import { useEffect, useRef, useState, useCallback } from "react";
import WebSocketService, {
  ConnectionState,
  type AIResponse,
  type WebSocketEventHandlers,
} from "./WebSocketService";

interface UseWebSocketOptions {
  url: string;
  autoConnect?: boolean;
  onAIResponse?: (message: AIResponse) => void;
  onConnectionOpen?: () => void;
  onConnectionClose?: () => void;
  onConnectionError?: (error: Event) => void;
  onReconnectAttempt?: (attempt: number) => void;
}

interface UseWebSocketReturn {
  sendMessage: (content: string) => boolean;
  connect: () => void;
  disconnect: () => void;
  isConnected: boolean;
  connectionState: ConnectionState;
  lastAIResponse: AIResponse | null;
}

export const useWebSocket = ({
  url,
  autoConnect = true,
  onAIResponse,
  onConnectionOpen,
  onConnectionClose,
  onConnectionError,
  onReconnectAttempt,
}: UseWebSocketOptions): UseWebSocketReturn => {
  const wsServiceRef = useRef<WebSocketService | null>(null);
  const currentUrlRef = useRef<string>("");
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.DISCONNECTED
  );
  const [isConnected, setIsConnected] = useState(false);
  const [lastAIResponse, setLastAIResponse] = useState<AIResponse | null>(null);

  // Use refs to store callback functions to avoid dependency issues
  const callbacksRef = useRef({
    onAIResponse,
    onConnectionOpen,
    onConnectionClose,
    onConnectionError,
    onReconnectAttempt,
  });

  // Update callback refs when they change
  useEffect(() => {
    callbacksRef.current = {
      onAIResponse,
      onConnectionOpen,
      onConnectionClose,
      onConnectionError,
      onReconnectAttempt,
    };
  }, [
    onAIResponse,
    onConnectionOpen,
    onConnectionClose,
    onConnectionError,
    onReconnectAttempt,
  ]);

  // Initialize WebSocket service only when url or autoConnect changes
  useEffect(() => {
    console.log("Initializing WebSocket service with URL:", url);

    // Don't recreate if the service already exists with the same URL
    if (wsServiceRef.current && currentUrlRef.current === url) {
      console.log("WebSocket service already exists for this URL");
      return;
    }

    // Disconnect existing connection if URL changed
    if (wsServiceRef.current) {
      console.log("Disconnecting existing WebSocket due to URL change");
      wsServiceRef.current.disconnect();
    }

    wsServiceRef.current = new WebSocketService(url);
    currentUrlRef.current = url;

    const eventHandlers: WebSocketEventHandlers = {
      onAIResponse: (message: AIResponse) => {
        console.log("Hook received AI response:", message);
        setLastAIResponse(message);
        callbacksRef.current.onAIResponse?.(message);
      },
      onConnectionOpen: () => {
        console.log("Hook: Connection opened");
        setConnectionState(ConnectionState.CONNECTED);
        setIsConnected(true);
        callbacksRef.current.onConnectionOpen?.();
      },
      onConnectionClose: () => {
        console.log("Hook: Connection closed");
        setConnectionState(ConnectionState.DISCONNECTED);
        setIsConnected(false);
        callbacksRef.current.onConnectionClose?.();
      },
      onConnectionError: (error: Event) => {
        console.error("Hook: Connection error:", error);
        setConnectionState(ConnectionState.ERROR);
        setIsConnected(false);
        callbacksRef.current.onConnectionError?.(error);
      },
      onReconnectAttempt: (attempt: number) => {
        console.log("Hook: Reconnection attempt:", attempt);
        setConnectionState(ConnectionState.RECONNECTING);
        setIsConnected(false);
        callbacksRef.current.onReconnectAttempt?.(attempt);
      },
    };

    wsServiceRef.current.setEventHandlers(eventHandlers);

    // Auto-connect if enabled
    if (autoConnect) {
      console.log("Auto-connecting WebSocket");
      wsServiceRef.current.connect();
    }

    // Cleanup on unmount or URL change only
    return () => {
      console.log("Cleaning up WebSocket service due to URL change or unmount");
      if (wsServiceRef.current) {
        wsServiceRef.current.disconnect();
        wsServiceRef.current = null;
        currentUrlRef.current = "";
      }
    };
  }, [url, autoConnect]); // Only depend on stable values

  const sendMessage = useCallback((content: string): boolean => {
    if (!wsServiceRef.current) {
      console.warn("WebSocket service not initialized");
      return false;
    }
    return wsServiceRef.current.sendTextMessage(content);
  }, []);

  const connect = useCallback(() => {
    console.log("Manual connect called");
    if (wsServiceRef.current) {
      wsServiceRef.current.enableReconnect();
      wsServiceRef.current.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    console.log("Manual disconnect called");
    if (wsServiceRef.current) {
      wsServiceRef.current.disconnect();
    }
  }, []);

  return {
    sendMessage,
    connect,
    disconnect,
    isConnected,
    connectionState,
    lastAIResponse,
  };
};
