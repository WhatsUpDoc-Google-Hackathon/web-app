import { motion } from "framer-motion";
import CallNavbar from "../components/callComponents/CallNavbar";
import CallVideo from "../components/callComponents/CallVideo";
import CallSidebar from "../components/callComponents/CallSidebar";
import { useStreamingAvatar } from "../heygen/StreamingAvatarContext";
import { childVariants, containerVariants } from "../animations/callAnimations";

import { useCallback, useEffect, useRef, useState } from "react";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { IoSend } from "react-icons/io5";
import { StreamingAudioTranscription } from "../sst_streamer/audioTranscription";
import { useWebSocket, type AIResponse } from "../api/websocket/";
import { useParams } from "react-router-dom";

const Call = () => {
  const { user_id } = useParams();
  const { speakText, isReady } = useStreamingAvatar();
  const [centerMessage, setCenterMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);

  useEffect(() => {
    isMutedRef.current = isMuted; // Keep ref in sync with state
  }, [isMuted]);

  // Debug wrapper for setIsMuted
  const handleSetIsMuted = (newValue: boolean) => {
    setIsMuted(newValue);
    audioTranscriptionRef.current?.mute();
  };
  const [_, setTranscriptionText] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [connectionInfo, setConnectionInfo] = useState({
    type: "",
    status: "",
  });
  const audioTranscriptionRef = useRef<StreamingAudioTranscription | null>(
    null
  );

  // Auto-start transcription on mount
  useEffect(() => {
    const start = async () => {
      // Get Google Cloud configuration from environment variables
      const projectId = import.meta.env.VITE_GOOGLE_PROJECT_ID;
      const location = import.meta.env.VITE_GOOGLE_LOCATION || "global";
      const modelId = import.meta.env.VITE_GOOGLE_MODEL_ID || "latest_long";
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

      if (!projectId || !apiKey) {
        console.warn(
          "Google Cloud credentials not found, using Web Speech API fallback"
        );
      }

      const at = new StreamingAudioTranscription(
        projectId || "fallback",
        location,
        modelId,
        (text: string, isFinal: boolean) => {
          if (isMutedRef.current) return;
          if (isFinal) {
            // Final result - add to permanent transcript
            if (!centerMessage.includes(text)) {
              setTranscriptionText((prev) => {
                if (!prev.includes(text)) {
                  return prev + text + " ";
                }
                return prev;
              });
              setCenterMessage((prev) => {
                if (!prev.includes(text)) {
                  return prev + text + " ";
                }
                return prev;
              });
            }
            setInterimTranscript(""); // Clear interim
          } else {
            // Interim result - show in real-time
            setInterimTranscript(text);
          }
        },
        () => console.log("Speech pause detected"),
        (error: string) => console.error("Transcription error:", error),
        apiKey || "fallback"
      );

      audioTranscriptionRef.current = at;

      try {
        await at.startTranscription();
        const info = at.getConnectionInfo();
        setConnectionInfo(info);
        console.log(`🚀 Started ${info.type} transcription`);
      } catch (error) {
        console.error("Failed to start transcription:", error);
        setConnectionInfo({ type: "Error", status: "Failed to start" });
      }
    };
    start();

    // Cleanup on unmount
    return () => {
      if (audioTranscriptionRef.current) {
        audioTranscriptionRef.current.stopTranscription();
      }
    };
  }, []);

  // Update connection info periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioTranscriptionRef.current) {
        const info = audioTranscriptionRef.current.getConnectionInfo();
        setConnectionInfo(info);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update mute state on API
  useEffect(() => {
    if (audioTranscriptionRef.current) {
      if (isMuted) {
        audioTranscriptionRef.current.mute();
        setInterimTranscript(""); // Clear interim transcript when muting
      } else {
        audioTranscriptionRef.current.unmute();
      }
    } else {
    }
  }, [isMuted]);

  const handleSendMessage = () => {
    if (centerMessage.trim() && isReady) {
      speakText(centerMessage);
      setCenterMessage("");
      setTranscriptionText("");
      setInterimTranscript("");
    }
  };

  const handleAIResponse = useCallback(
    (message: AIResponse) => {
      if (isReady && message.content) {
        speakText(message.content);
      }
    },
    [speakText, isReady]
  );

  const { sendMessage, isConnected, connectionState, lastAIResponse } =
    useWebSocket({
      url: `${
        import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8080/ws"
      }?user-id=${user_id}`,
      autoConnect: true,
      onAIResponse: handleAIResponse,
      onConnectionOpen: () => console.log("Connected to backend WebSocket"),
      onConnectionClose: () =>
        console.log("Disconnected from backend WebSocket"),
      onConnectionError: (error) =>
        console.error("WebSocket connection error:", error),
      onReconnectAttempt: (attempt) =>
        console.log(`Reconnection attempt ${attempt}`),
    });

  // Check if STT is connected
  const isSTTConnected = audioTranscriptionRef.current?.isConnected() ?? false;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="flex flex-col w-full mx-auto gap-3 md:gap-4 px-2 md:px-4 py-2 md:py-4"
    >
      <motion.div variants={childVariants}>
        <CallNavbar
          isConnected={isConnected}
          connectionState={connectionState}
          isSTTConnected={isSTTConnected}
          sttConnectionInfo={connectionInfo}
          isMuted={isMuted}
        />
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-3 md:gap-6">
        <div className="flex flex-col gap-3 md:gap-4 lg:flex-1">
          <motion.div
            variants={childVariants}
            className="flex items-center justify-center w-full rounded-3xl"
          >
            <CallVideo isMuted={isMuted} setIsMuted={handleSetIsMuted} />
          </motion.div>

          <motion.div
            variants={childVariants}
            className="flex justify-center items-center w-full"
          >
            <div className="flex flex-col gap-3 w-full max-w-4xl">
              {/* Show interim transcript if available */}
              {interimTranscript && (
                <div className="text-center text-sm text-gray-500 italic">
                  {interimTranscript}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Send a message to the AI assistant..."
                    className="w-full px-4 md:px-6 py-3 md:py-4 pr-12 sm:pr-10 md:pr-12 rounded-xl md:rounded-2xl border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm md:text-base bg-white/95 backdrop-blur-sm placeholder-gray-500 transition-all duration-200 hover:shadow-xl"
                    value={centerMessage}
                    onChange={(e) => {
                      setCenterMessage(e.target.value);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && centerMessage.trim()) {
                        const success = sendMessage(centerMessage.trim());
                        if (success) {
                          setCenterMessage("");
                        }
                        handleSendMessage(); // also send to TTS
                      }
                    }}
                  />
                  <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 sm:hidden">
                    <HiChatBubbleLeftRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="flex gap-2 items-center justify-end sm:justify-start">
                  <button
                    className="px-4 sm:px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-accent to-accent/80 text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto sm:min-w-[120px] flex items-center justify-center gap-2"
                    type="button"
                    disabled={!centerMessage.trim() || !isConnected}
                    onClick={() => {
                      const success = sendMessage(centerMessage.trim());
                      if (success) {
                        setCenterMessage("");
                      }
                      handleSendMessage();
                    }}
                  >
                    <IoSend className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="sm:hidden">Send Message</span>
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={childVariants}
          className="w-full lg:w-[340px] xl:w-[380px] lg:flex-shrink-0"
        >
          <CallSidebar lastAIResponse={lastAIResponse || undefined} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Call;
