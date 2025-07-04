export interface TextMessage {
  type: "text";
  content: string;
}

export interface AIResponse {
  type: "ai" | "text";
  content: string;
  meta: {
    source: string;
    timestamp: string;
    success?: boolean;
    sessionId?: string;
    userId?: string;
    conversationId?: string;
    model?: string;
    tokens?: number;
    latency?: number;
    confidence?: number;
  };
}

export type WebSocketMessage = TextMessage | AIResponse;

export interface WebSocketEventHandlers {
  onAIResponse?: (message: AIResponse) => void;
  onConnectionOpen?: () => void;
  onConnectionClose?: () => void;
  onConnectionError?: (error: Event) => void;
  onReconnectAttempt?: (attempt: number) => void;
}

export enum ConnectionState {
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
  RECONNECTING = "RECONNECTING",
  ERROR = "ERROR",
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private eventHandlers: WebSocketEventHandlers = {};
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private maxReconnectDelay = 30000; // Max 30 seconds
  private reconnectTimeoutId: NodeJS.Timeout | null = null;
  private shouldReconnect = true;

  constructor(url: string) {
    this.url = url;
  }

  public connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    console.log("Attempting to connect to WebSocket:", this.url);
    this.connectionState = ConnectionState.CONNECTING;

    try {
      this.ws = new WebSocket(this.url);
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      this.connectionState = ConnectionState.ERROR;
      this.eventHandlers.onConnectionError?.(new Event("connection_failed"));
      return;
    }

    this.ws.onopen = () => {
      console.log("WebSocket connected successfully");
      this.connectionState = ConnectionState.CONNECTED;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000; // Reset delay
      this.eventHandlers.onConnectionOpen?.();
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        console.log("Received WebSocket message:", message);
        this.handleMessage(message);
      } catch (error) {
        console.error(
          "Failed to parse WebSocket message:",
          error,
          "Raw data:",
          event.data
        );
      }
    };

    this.ws.onclose = (event) => {
      console.log(
        "WebSocket disconnected. Code:",
        event.code,
        "Reason:",
        event.reason,
        "Clean:",
        event.wasClean
      );
      this.connectionState = ConnectionState.DISCONNECTED;
      this.eventHandlers.onConnectionClose?.();

      // Only attempt to reconnect if it wasn't a manual disconnect and we should reconnect
      if (event.code !== 1000 && this.shouldReconnect) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.connectionState = ConnectionState.ERROR;
      this.eventHandlers.onConnectionError?.(error);
    };
  }

  public disconnect(): void {
    console.log("Manually disconnecting WebSocket");
    this.shouldReconnect = false;

    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }

    if (this.ws) {
      this.ws.close(1000, "Manual disconnect");
      this.ws = null;
    }

    this.connectionState = ConnectionState.DISCONNECTED;
  }

  public sendTextMessage(content: string): boolean {
    if (!this.isConnected()) {
      console.warn(
        "Cannot send message: WebSocket not connected. State:",
        this.connectionState
      );
      return false;
    }

    const message: TextMessage = {
      type: "text",
      content,
    };

    try {
      console.log("Sending message:", message);
      this.ws!.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error("Failed to send message:", error);
      return false;
    }
  }

  public isConnected(): boolean {
    const connected = this.ws?.readyState === WebSocket.OPEN;
    console.log(
      "isConnected check - WebSocket state:",
      this.ws?.readyState,
      "Connected:",
      connected
    );
    return connected;
  }

  public getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  public setEventHandlers(handlers: WebSocketEventHandlers): void {
    this.eventHandlers = { ...this.eventHandlers, ...handlers };
  }

  public enableReconnect(): void {
    this.shouldReconnect = true;
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case "ai":
        this.eventHandlers.onAIResponse?.(message);
        break;
      default:
        console.warn("Unknown message type:", message);
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      this.connectionState = ConnectionState.ERROR;
      return;
    }

    if (!this.shouldReconnect) {
      console.log("Reconnection disabled, not attempting to reconnect");
      return;
    }

    this.connectionState = ConnectionState.RECONNECTING;
    this.reconnectAttempts++;

    this.eventHandlers.onReconnectAttempt?.(this.reconnectAttempts);

    console.log(
      `Attempting to reconnect in ${this.reconnectDelay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    this.reconnectTimeoutId = setTimeout(() => {
      this.connect();
      // Exponential backoff with jitter
      this.reconnectDelay = Math.min(
        this.reconnectDelay * 2 + Math.random() * 1000,
        this.maxReconnectDelay
      );
    }, this.reconnectDelay);
  }
}

export default WebSocketService;
