// Type definitions for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onspeechstart: ((event: Event) => void) | null;
  onspeechend: ((event: Event) => void) | null;
  onsoundstart: ((event: Event) => void) | null;
  onsoundend: ((event: Event) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare const SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

export class StreamingAudioTranscription {
  private audioContext: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private recognition: SpeechRecognition | null = null;
  private isRecording = false;
  private isMuted = false;
  private isUsingGoogleSTT = false;
  private isUsingWebSpeech = false;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private readonly SAMPLE_RATE = 16000;
  // Voice activity detection & buffering ------------------------------
  private audioBuffers: Float32Array[] = [];
  private lastSpeechTime = 0;
  private isSpeechOngoing = false;
  private readonly SILENCE_THRESHOLD = 0.02; // Avg amplitude below this is considered silence
  private readonly SILENCE_DURATION_MS = 800; // ms of silence that marks end of speech
  private workletNode: AudioWorkletNode | null = null; // <--- Track the worklet node

  constructor(
    private projectId: string,
    _location: string = "global",
    private modelId: string = "latest_long",
    private onTranscription: (text: string, isFinal: boolean) => void,
    private onVadPause: () => void,
    private onError: (error: string) => void,
    private apiKey: string
  ) {}

  private async initializeGoogleSTT(): Promise<boolean> {
    if (!this.projectId || !this.apiKey || this.projectId === "fallback") {
      console.warn("Google Cloud credentials not available");
      return false;
    }

    try {
      console.log("🔧 Initializing Google Cloud Speech-to-Text streaming...");

      // Get user media first
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
        },
      });

      // Create audio context
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      // --- Worklet code with mute support ---
      const workletCode = `
        class GoogleSTTProcessor extends AudioWorkletProcessor {
          constructor() {
            super();
            this.bufferSize = 0;
            this.buffer = new Float32Array(16000);
            this.muted = false;
            this.port.onmessage = (event) => {
              if (event.data && typeof event.data.muted === 'boolean') {
                this.muted = event.data.muted;
              }
            };
          }
          process(inputs) {
            if (this.muted) return true;
            const input = inputs[0][0];
            if (input) {
              const remainingSpace = this.buffer.length - this.bufferSize;
              const samplesToAdd = Math.min(input.length, remainingSpace);
              this.buffer.set(input.subarray(0, samplesToAdd), this.bufferSize);
              this.bufferSize += samplesToAdd;
              if (this.bufferSize >= this.buffer.length) {
                this.port.postMessage(this.buffer.slice(0, this.bufferSize));
                this.bufferSize = 0;
              }
            }
            return true;
          }
        }
        registerProcessor('google-stt-processor', GoogleSTTProcessor);
      `;

      const blobUrl = URL.createObjectURL(
        new Blob([workletCode], { type: "application/javascript" })
      );
      await this.audioContext.audioWorklet.addModule(blobUrl);

      this.workletNode = new AudioWorkletNode(
        this.audioContext,
        "google-stt-processor"
      );

      // Set initial mute state
      this.workletNode.port.postMessage({ muted: this.isMuted });

      this.workletNode.port.onmessage = (e) => {
        if (this.isMuted || !this.isRecording) return;
        const audioData = e.data as Float32Array;
        const resampledData = this.resampleAudio(
          audioData,
          this.audioContext!.sampleRate
        );
        this.handleAudioChunk(resampledData);
      };

      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.source.connect(this.workletNode);

      this.isUsingGoogleSTT = true;
      console.log("✅ Google Cloud Speech-to-Text streaming initialized");
      return true;
    } catch (error) {
      console.error("Failed to initialize Google STT:", error);
      this.cleanupGoogleSTT();
      return false;
    }
  }

  private resampleAudio(
    inputData: Float32Array,
    inputSampleRate: number
  ): Float32Array {
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

  private float32ToInt16Array(float32Array: Float32Array): Int16Array {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const sample = float32Array[i];
      const clampedSample = Math.max(-1, Math.min(1, sample || 0));
      int16Array[i] = clampedSample * 0x7fff;
    }
    return int16Array;
  }

  private async sendAudioToGoogleSTT(audioData: Float32Array): Promise<void> {
    if (audioData.length === 0 || this.isMuted) return;
    try {
      const int16Data = this.float32ToInt16Array(audioData);
      const audioBytes = new Uint8Array(int16Data.buffer);
      const base64Audio = btoa(String.fromCharCode(...audioBytes));
      const requestBody = {
        config: {
          encoding: "LINEAR16",
          sampleRateHertz: this.SAMPLE_RATE,
          languageCode: "en-US",
          model: this.modelId,
          useEnhanced: true,
          enableAutomaticPunctuation: true,
          maxAlternatives: 1,
          profanityFilter: false,
          speechContexts: [],
        },
        audio: {
          content: base64Audio,
        },
      };
      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Google STT API Error:", errorText);
        throw new Error(
          `Google Speech API error: ${response.status} ${response.statusText}`
        );
      }
      const result = await response.json();
      if (result.results && result.results.length > 0) {
        for (const speechResult of result.results) {
          if (speechResult.alternatives && speechResult.alternatives[0]) {
            const transcript = speechResult.alternatives[0].transcript;
            if (transcript && transcript.trim()) {
              this.onTranscription(transcript, true); // Google STT results are always final
              console.log("🎯 Google STT Transcription:", transcript);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending audio to Google STT:", error);
      // Don't call onError here to avoid constant error messages
      // The main error handling is in the retry logic
    }
  }

  private cleanupGoogleSTT(): void {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = null;
    }
    if (this.audioContext?.state !== "closed") {
      this.audioContext?.close();
    }
    this.audioContext = null;
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.isUsingGoogleSTT = false;
  }

  private initializeWebSpeechAPI(): boolean {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.warn("Web Speech API not supported in this browser");
        return false;
      }
      this.recognition = new SpeechRecognition();
      // Configure recognition settings
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";
      this.recognition.maxAlternatives = 1;
      // Event handlers
      this.recognition.onstart = () => {
        console.log("🎙️ Web Speech API started (fallback)");
        this.isRecording = true;
        this.reconnectAttempts = 0;
      };
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        if (this.isMuted) return;
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result && result[0]) {
            const transcript = result[0].transcript;
            const isFinal = result.isFinal;
            if (transcript && transcript.trim()) {
              this.onTranscription(transcript, isFinal);
            }
          }
        }
      };
      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Web Speech API error:", event.error);
        if (event.error === "no-speech") {
          this.handleReconnect();
        } else if (event.error === "audio-capture") {
          this.onError("Microphone access denied or not available");
        } else if (event.error === "not-allowed") {
          this.onError("Microphone permission denied");
        } else {
          this.onError(`Speech recognition error: ${event.error}`);
        }
      };
      this.recognition.onend = () => {
        console.log("🔴 Web Speech API ended");
        if (
          this.isRecording &&
          this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS
        ) {
          this.handleReconnect();
        }
      };
      this.recognition.onspeechstart = () => {
        console.log("🗣️ Speech detected");
      };
      this.recognition.onspeechend = () => {
        console.log("🔇 Speech ended");
        this.onVadPause();
      };
      this.recognition.onsoundstart = () => {
        console.log("🔊 Sound detected");
      };
      this.recognition.onsoundend = () => {
        console.log("🔇 Sound ended");
      };
      this.isUsingWebSpeech = true;
      return true;
    } catch (error) {
      console.error("Failed to initialize Web Speech API:", error);
      return false;
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      console.error("Max reconnection attempts reached");
      this.onError("Speech recognition failed after multiple attempts");
      return;
    }
    this.reconnectAttempts++;
    console.log(
      `🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})`
    );
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts - 1),
      10000
    );
    this.reconnectTimer = setTimeout(() => {
      try {
        if (this.isUsingWebSpeech && this.recognition && this.isRecording) {
          this.recognition.start();
        } else if (this.isUsingGoogleSTT) {
          // For Google STT, we don't need to restart as it's continuous
          console.log("Google STT continues running...");
        }
      } catch (error) {
        console.error("Error during reconnect:", error);
        this.handleReconnect();
      }
    }, delay);
  }

  async startTranscription(): Promise<void> {
    try {
      this.reconnectAttempts = 0;
      // Try Google Cloud Speech-to-Text first
      if (await this.initializeGoogleSTT()) {
        this.isRecording = true;
        console.log(
          "🚀 Started streaming transcription with Google Cloud Speech-to-Text"
        );
        return;
      }
      // Fallback to Web Speech API
      console.warn(
        "Google Cloud STT not available, falling back to Web Speech API"
      );
      if (this.initializeWebSpeechAPI()) {
        this.recognition!.start();
        console.log(
          "🚀 Started streaming transcription with Web Speech API (fallback)"
        );
        return;
      }
      throw new Error("No speech recognition method available");
    } catch (error: any) {
      console.error("Failed to start transcription:", error);
      this.onError(`Failed to start transcription: ${error.message || error}`);
      this.cleanup();
      throw error;
    }
  }

  private cleanup(): void {
    this.isRecording = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    // Cleanup Google STT
    this.cleanupGoogleSTT();
    // Cleanup Web Speech API
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.warn("Error stopping recognition:", error);
      }
      this.recognition = null;
    }
    this.isUsingWebSpeech = false;
    this.reconnectAttempts = 0;
  }

  stopTranscription(): void {
    console.log("🛑 Stopping streaming transcription");
    this.cleanup();
  }

  mute(): void {
    if (this.isMuted) {
      console.log("🔇 Already muted");
      return;
    }
    this.isMuted = true;
    // Reset VAD buffers when muting
    this.audioBuffers = [];
    this.isSpeechOngoing = false;
    console.log("🔇 Muted streaming transcription");
    // Actually stop audio capture by disabling microphone tracks
    if (this.stream) {
      this.stream.getAudioTracks().forEach((track) => {
        track.enabled = false;
        console.log("🔇 Disabled microphone track");
      });
    }
    // Tell the worklet to mute
    if (this.workletNode) {
      this.workletNode.port.postMessage({ muted: true });
      console.log("🔇 Notified worklet to mute");
    }
    // For Web Speech API, stop recognition completely
    if (this.isUsingWebSpeech && this.recognition) {
      try {
        this.recognition.stop();
        console.log("🔇 Stopped Web Speech API recognition");
      } catch (error) {
        console.warn("Error stopping Web Speech API:", error);
      }
    }
    // For Google STT, audio processing will be disabled due to track.enabled = false and worklet mute
    if (this.isUsingGoogleSTT) {
      console.log("🔇 Google STT audio capture disabled");
    }
  }

  unmute(): void {
    if (!this.isMuted) {
      console.log("🔊 Already unmuted");
      return;
    }
    this.isMuted = false;
    console.log("🔊 Unmuted streaming transcription");
    // Re-enable audio capture by enabling microphone tracks
    if (this.stream) {
      this.stream.getAudioTracks().forEach((track) => {
        track.enabled = true;
        console.log("🔊 Enabled microphone track");
      });
    }
    // Tell the worklet to unmute
    if (this.workletNode) {
      this.workletNode.port.postMessage({ muted: false });
      console.log("🔊 Notified worklet to unmute");
    }
    // For Web Speech API, restart recognition if it was running
    if (this.isUsingWebSpeech && this.recognition && this.isRecording) {
      try {
        this.recognition.start();
        console.log("🔊 Restarted Web Speech API recognition");
      } catch (error) {
        console.warn("Error restarting Web Speech API:", error);
        // If starting fails, try to handle reconnect
        this.handleReconnect();
      }
    }
    // For Google STT, audio processing will resume automatically
    if (this.isUsingGoogleSTT) {
      console.log("🔊 Google STT audio capture re-enabled");
    }
  }

  isConnected(): boolean {
    if (this.isUsingGoogleSTT) {
      return this.isRecording && this.audioContext !== null;
    }
    if (this.isUsingWebSpeech) {
      return this.isRecording && this.recognition !== null;
    }
    return false;
  }

  getConnectionInfo(): { type: string; status: string } {
    if (this.isUsingGoogleSTT) {
      return {
        type: "Google Cloud STT",
        status: this.isConnected() ? "Connected" : "Disconnected",
      };
    }
    if (this.isUsingWebSpeech) {
      return {
        type: "Web Speech API",
        status: this.isConnected() ? "Connected (Fallback)" : "Disconnected",
      };
    }
    return {
      type: "Speech Recognition",
      status: "Disconnected",
    };
  }

  // === Voice Activity Detection helpers ==============================
  private handleAudioChunk(audioData: Float32Array): void {
    const amplitude = this.calculateAverageAmplitude(audioData);
    const now = Date.now();

    if (amplitude > this.SILENCE_THRESHOLD) {
      // Speech detected – keep accumulating
      this.audioBuffers.push(audioData);
      this.lastSpeechTime = now;
      this.isSpeechOngoing = true;
    } else if (this.isSpeechOngoing) {
      // Potential end of speech – check if silence threshold reached
      if (now - this.lastSpeechTime < this.SILENCE_DURATION_MS) {
        this.audioBuffers.push(audioData);
      } else {
        // Confirmed end of utterance – send to STT
        this.isSpeechOngoing = false;
        if (this.audioBuffers.length) {
          const merged = this.mergeAudioBuffers(this.audioBuffers);
          this.audioBuffers = [];
          this.sendAudioToGoogleSTT(merged);
          this.onVadPause();
        }
      }
    }
  }

  private calculateAverageAmplitude(data: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      // data[i] can be undefined with noUncheckedIndexedAccess enabled
      const sample = data[i] ?? 0;
      sum += Math.abs(sample);
    }
    return sum / data.length;
  }

  private mergeAudioBuffers(buffers: Float32Array[]): Float32Array {
    let length = 0;
    buffers.forEach((b) => (length += b.length));
    const result = new Float32Array(length);
    let offset = 0;
    for (const b of buffers) {
      result.set(b, offset);
      offset += b.length;
    }
    return result;
  }
}
