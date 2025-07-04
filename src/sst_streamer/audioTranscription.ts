import { encode, decode } from "@msgpack/msgpack";

interface AudioChunk { type: 'Audio'; pcm: number[]; }
interface WordMessage { type: 'Word'; text: string; }
interface StepMessage { type: 'Step'; prs: number[]; }
type WebSocketMessage = WordMessage | StepMessage;

export class AudioTranscription {
  private websocket: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private isRecording = false;
  private isMuted = false;
  private stream: MediaStream | null = null;
  private keepAliveInterval?: number;
  private speechStarted = false;

  private readonly SAMPLE_RATE = 24000;
  private readonly PAUSE_PREDICTION_HEAD_INDEX = 2;

  constructor(
    private url = 'ws://34.71.41.72:80',
    private apiKey = 'public_token',
    private showVad = false,
    private onTranscription: (t: string) => void = console.log,
    private onVadPause: () => void = () => console.log('| '),
    private onError: (e: string) => void = console.error
  ) {
    if (!this.url || this.url === 'undefined') this.url = 'ws://34.71.41.72:80';
    if (!this.apiKey || this.apiKey === 'undefined') this.apiKey = 'public_token';
    if (this.url.includes('34.71.41.72') && !this.url.includes(':80') && !this.url.includes('/api')) {
      this.url = 'ws://34.71.41.72:80';
    }
  }

  private handleMessage = (data: WebSocketMessage) => {
    if (data.type === 'Step' && this.showVad) {
      const p = data.prs[this.PAUSE_PREDICTION_HEAD_INDEX];
      if (p > 0.5 && this.speechStarted) {
        this.onVadPause();
        this.speechStarted = false;
      }
    } else if (data.type === 'Word') {
      this.onTranscription(data.text);
      console.log('Transcription:', data.text);
      this.speechStarted = true;
    }
  };

  async startTranscription(): Promise<void> {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('getUserMedia is not supported');
      }
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });

      const wsUrl = this.url.endsWith('/api/asr-streaming') ? this.url : `${this.url.replace(/\/$/, '')}/api/asr-streaming`;
      this.websocket = new WebSocket(`${wsUrl}?auth_id=${encodeURIComponent(this.apiKey)}`);
      this.websocket.binaryType = 'arraybuffer';

      this.websocket.onerror = () => this.onError('WebSocket connection error');
      this.websocket.onclose = e => {
        if (e.code !== 1000) this.onError(`WebSocket closed unexpectedly: ${e.reason}`);
      };

      await new Promise<void>((res, rej) => {
        const timeout = setTimeout(() => rej(new Error('WebSocket timeout')), 10000);
        this.websocket!.onopen = () => (clearTimeout(timeout), res());
        this.websocket!.onerror = () => (clearTimeout(timeout), rej(new Error('WS open failed')));
      });

      let lastSend = Date.now();
      this.keepAliveInterval = window.setInterval(() => {
        if (!this.isMuted && this.websocket?.readyState === WebSocket.OPEN) {
          this.websocket.send(JSON.stringify({ type: 'Audio', pcm: [0] }));
          lastSend = Date.now();
        }
      }, 1000);

      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (this.audioContext.state === 'suspended') await this.audioContext.resume();

      const workletCode = `
        class StreamProcessor extends AudioWorkletProcessor {
          process(inputs) {
            const input = inputs[0][0];
            if (input) this.port.postMessage(input);
            return true;
          }
        }
        registerProcessor('stream-processor', StreamProcessor);
      `;
      const blobUrl = URL.createObjectURL(new Blob([workletCode], { type: 'application/javascript' }));
      await this.audioContext.audioWorklet.addModule(blobUrl);

      const workletNode = new AudioWorkletNode(this.audioContext, 'stream-processor');
      workletNode.port.onmessage = (e) => {
        if (this.isMuted) return;
        const data = e.data as Float32Array;
        const pcm = this.audioContext!.sampleRate !== this.SAMPLE_RATE
          ? Array.from({ length: Math.floor(data.length * this.SAMPLE_RATE / this.audioContext!.sampleRate) },
              (_, i) => data[Math.floor(i * this.audioContext!.sampleRate / this.SAMPLE_RATE)] || 0)
          : Array.from(data);
        try {
          const packed = encode({ type: 'Audio', pcm });
          this.websocket!.send(packed.buffer);
          lastSend = Date.now();
        } catch (err) {
          console.error('Error sending chunk', err);
        }
      };
      

      this.source = this.audioContext.createMediaStreamSource(this.stream);
      const muteGain = this.audioContext.createGain();
      muteGain.gain.value = 0;
      this.source.connect(workletNode).connect(muteGain).connect(this.audioContext.destination);

      this.websocket.onmessage = async (ev) => {
        try {
          const buf = ev.data instanceof ArrayBuffer ? new Uint8Array(ev.data) :
                      new Uint8Array(await (ev.data as Blob).arrayBuffer());
          this.handleMessage(decode(buf) as WebSocketMessage);
        } catch {
          this.onError('Error parsing WS message');
        }
      };

      this.isRecording = true;
    } catch (err: any) {
      this.onError(`Failed to start transcription: ${err.message || err}`);
      this.cleanup();
      throw err;
    }
  }

  private cleanup(): void {
    this.source?.disconnect(); this.source = null;
    if (this.audioContext?.state !== 'closed') this.audioContext?.close();
    this.audioContext = null;
    if (this.keepAliveInterval) clearInterval(this.keepAliveInterval);
    this.keepAliveInterval = undefined;
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
    this.websocket?.close();
    this.websocket = null;
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
    return this.websocket?.readyState === WebSocket.OPEN && this.isRecording;
  }
}
