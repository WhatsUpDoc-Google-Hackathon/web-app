import { motion } from "framer-motion";
import CallNavbar from "../components/callComponents/CallNavbar";
import CallVideo from "../components/callComponents/CallVideo";
import CallSidebar from "../components/callComponents/CallSidebar";
import { useStreamingAvatar } from "../heygen/StreamingAvatarContext";
import { childVariants, containerVariants } from "../animations/callAnimations";
import { useCallback, useState } from "react";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { IoSend } from "react-icons/io5";
import { useWebSocket, type AIResponse } from "../api/websocket/";

const Call = () => {
  const { speakText, isReady } = useStreamingAvatar();
  const [centerMessage, setCenterMessage] = useState("");

  // Handle AI responses from the backend
  const handleAIResponse = useCallback(
    (message: AIResponse) => {
      console.log("Received AI response:", message);

      // Speak the AI response through the avatar
      if (isReady && message.content) {
        speakText(message.content);
      }
    },
    [speakText, isReady]
  );

  // Initialize WebSocket connection
  const { sendMessage, isConnected, connectionState, lastAIResponse } =
    useWebSocket({
      url: import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8080/ws",
      autoConnect: true,
      onAIResponse: handleAIResponse,
      onConnectionOpen: () => {
        console.log("Connected to backend WebSocket");
      },
      onConnectionClose: () => {
        console.log("Disconnected from backend WebSocket");
      },
      onConnectionError: (error) => {
        console.error("WebSocket connection error:", error);
      },
      onReconnectAttempt: (attempt) => {
        console.log(`Reconnection attempt ${attempt}`);
      },
    });

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
        />
      </motion.div>

      {/* Main content area - flex column on mobile, row on larger screens */}
      <div className="flex flex-col lg:flex-row gap-3 md:gap-6">
        {/* Left column - Video and Input */}
        <div className="flex flex-col gap-3 md:gap-4 lg:flex-1">
          <motion.div
            variants={childVariants}
            className="flex items-center justify-center w-full rounded-3xl"
          >
            <CallVideo />
          </motion.div>

          {/* Text input right below video */}
          <motion.div
            variants={childVariants}
            className="flex justify-center items-center w-full"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-4xl">
              <div className="relative flex-1">
                <input
                  ref={(input) => {
                    if (input) input.focus();
                  }}
                  type="text"
                  placeholder="Send a message to the AI assistant..."
                  className="w-full px-4 md:px-6 py-3 md:py-4 pr-10 md:pr-12 rounded-xl md:rounded-2xl border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm md:text-base bg-white/95 backdrop-blur-sm placeholder-gray-500 transition-all duration-200 hover:shadow-xl"
                  value={centerMessage}
                  onChange={(e) => setCenterMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (
                      e.key === "Enter" &&
                      centerMessage.trim() &&
                      isConnected
                    ) {
                      const success = sendMessage(centerMessage.trim());
                      if (success) {
                        setCenterMessage("");
                      }
                    }
                  }}
                />
                <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2">
                  <HiChatBubbleLeftRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                </div>
              </div>

              <button
                className="px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-accent to-accent/80 text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] flex items-center justify-center gap-2"
                type="button"
                disabled={!centerMessage.trim() || !isConnected}
                onClick={() => {
                  const success = sendMessage(centerMessage.trim());
                  if (success) {
                    setCenterMessage("");
                  }
                }}
              >
                <IoSend className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Sidebar - full width on mobile, fixed width on larger screens */}
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
