import { motion } from "framer-motion";
import CallNavbar from "../components/callComponents/CallNavbar";
import CallVideo from "../components/callComponents/CallVideo";
import CallSidebar from "../components/callComponents/CallSidebar";
import { useStreamingAvatar } from "../heygen/StreamingAvatarContext";
import { childVariants, containerVariants } from "../animations/callAnimations";
import { useState } from "react";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { IoSend } from "react-icons/io5";

const Call = () => {
  const { speakText, isReady } = useStreamingAvatar();
  const [centerMessage, setCenterMessage] = useState("");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="flex flex-col min-h-[80vh] w-full mx-auto gap-6"
    >
      <motion.div variants={childVariants}>
        <CallNavbar />
      </motion.div>
      <div className="flex-1 flex gap-6 rounded-3xl">
        <motion.div
          variants={childVariants}
          className="flex-1 flex items-center justify-center w-full h-full rounded-3xl"
        >
          <CallVideo />
        </motion.div>
        <motion.div variants={childVariants}>
          <CallSidebar />
        </motion.div>
      </div>

      {/* New centered input field below the video call */}
      <motion.div
        variants={childVariants}
        className="flex justify-center items-center w-full px-6"
      >
        <div className="flex items-center gap-3 w-full max-w-2xl">
          <div className="relative flex-1">
            <input
              ref={(input) => {
                if (input) input.focus();
              }}
              type="text"
              placeholder="Send a message to your virtual assistant..."
              className="w-full px-6 py-4 pr-12 rounded-2xl border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-base bg-white/95 backdrop-blur-sm placeholder-gray-500 transition-all duration-200 hover:shadow-xl"
              value={centerMessage}
              onChange={(e) => setCenterMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && centerMessage.trim() && isReady) {
                  speakText(centerMessage);
                  setCenterMessage("");
                }
              }}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <HiChatBubbleLeftRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <button
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-accent to-accent/80 text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            disabled={!centerMessage.trim() || !isReady}
            onClick={() => {
              speakText(centerMessage);
              setCenterMessage("");
            }}
          >
            <IoSend className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Call;
