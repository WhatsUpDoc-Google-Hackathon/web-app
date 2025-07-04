export class AudioTranscription {
  private audioContext: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private isRecording = false;
  private isMuted = false;
  private stream: MediaStream | null = null;
  private audioBuffer: Float32Array[] = [];
  private readonly CHUNK_DURATION_MS = 3000; // 3 seconds chunks
  private readonly SAMPLE_RATE = 16000; // Google Speech-to-Text prefers 16kHz

  constructor(
    private projectId: string,
    private location: string = 'global',
    private modelId: string = 'latest_long',
    private onTranscription: (t: string) => void,
    private onVadPause: () => void,
    private onError: (e: string) => void,
    private apiKey: string // Add API key for REST API
  ) {}

  private float32ArrayToWav(audioData: Float32Array): Uint8Array {
    const length = audioData.length;
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, this.SAMPLE_RATE, true);
    view.setUint32(28, this.SAMPLE_RATE * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // Convert float32 to int16
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    return new Uint8Array(buffer);
  }


  private async transcribeAudioChunk(audioData: Float32Array): Promise<void> {
    if (audioData.length === 0) return;

    try {
      const wavData = this.float32ArrayToWav(audioData);
      const base64Audio = btoa(String.fromCharCode(...wavData));
      
      const requestBody = {
        config: {
          encoding: "LINEAR16", // Match the WAV format we're creating
          sampleRateHertz: this.SAMPLE_RATE,
          languageCode: "en-US",
          model: this.modelId,
          useEnhanced: true,
          enableAutomaticPunctuation: true,
        },
        audio: {
          content: base64Audio,
        },
      };

      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Google Speech API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.results && result.results.length > 0) {
        for (const speechResult of result.results) {
          if (speechResult.alternatives && speechResult.alternatives[0]) {
            const transcript = speechResult.alternatives[0].transcript;
            if (transcript && transcript.trim()) {
              this.onTranscription(transcript);
              console.log('Google STT Transcription:', transcript);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error transcribing audio chunk:', error);
      this.onError(`Transcription error: ${error}`);
    }
  }

  private resampleAudio(inputData: Float32Array, inputSampleRate: number): Float32Array {
    if (inputSampleRate === this.SAMPLE_RATE) {
      return inputData;
    }
    
    const ratio = inputSampleRate / this.SAMPLE_RATE;
    const outputLength = Math.floor(inputData.length / ratio);
    const output = new Float32Array(outputLength);
    
    for (let i = 0; i < outputLength; i++) {
      const sourceIndex = Math.floor(i * ratio);
      output[i] = inputData[sourceIndex] || 0;
    }
    
    return output;
  }

  async startTranscription(): Promise<void> {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("getUserMedia is not supported");
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100, // Let browser handle this, we'll resample
        },
      });

      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      const workletCode = `
        class StreamProcessor extends AudioWorkletProcessor {
          constructor() {
            super();
            this.bufferSize = 0;
            this.buffer = new Float32Array(${this.audioContext.sampleRate * (this.CHUNK_DURATION_MS / 1000)});
          }
          
          process(inputs) {
            const input = inputs[0][0];
            if (input) {
              // Add samples to buffer
              const remainingSpace = this.buffer.length - this.bufferSize;
              const samplesToAdd = Math.min(input.length, remainingSpace);
              
              this.buffer.set(input.subarray(0, samplesToAdd), this.bufferSize);
              this.bufferSize += samplesToAdd;
              
              // If buffer is full, send it and reset
              if (this.bufferSize >= this.buffer.length) {
                this.port.postMessage(this.buffer.slice(0, this.bufferSize));
                this.bufferSize = 0;
              }
            }
            return true;
          }
        }
        registerProcessor('stream-processor', StreamProcessor);
      `;

      const blobUrl = URL.createObjectURL(
        new Blob([workletCode], { type: "application/javascript" })
      );
      await this.audioContext.audioWorklet.addModule(blobUrl);

      const workletNode = new AudioWorkletNode(this.audioContext, "stream-processor");
      
      workletNode.port.onmessage = async (e) => {
        if (this.isMuted || !this.isRecording) return;
        
        const audioData = e.data as Float32Array;
        const resampledData = this.resampleAudio(audioData, this.audioContext!.sampleRate);
        
        // Transcribe this chunk
        await this.transcribeAudioChunk(resampledData);
      };

      this.source = this.audioContext.createMediaStreamSource(this.stream);
      const muteGain = this.audioContext.createGain();
      muteGain.gain.value = 0;
      
      this.source
        .connect(workletNode)
        .connect(muteGain)
        .connect(this.audioContext.destination);

      this.isRecording = true;
      console.log(`Started Google Speech-to-Text transcription with model: ${this.modelId}`);

    } catch (err: any) {
      this.onError(`Failed to start transcription: ${err.message || err}`);
      this.cleanup();
      throw err;
    }
  }

  private cleanup(): void {
    this.source?.disconnect();
    this.source = null;
    if (this.audioContext?.state !== "closed") {
      this.audioContext?.close();
    }
    this.audioContext = null;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.audioBuffer = [];
  }

  stopTranscription(): void {
    this.isRecording = false;
    this.cleanup();
  }

  mute(): void {
    this.isMuted = true;
  }

  unmute(): void {
    this.isMuted = false;
  }

  isConnected(): boolean {
    return this.isRecording;
  }
}