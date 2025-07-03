import { motion } from "framer-motion";
import CallNavbar from "../components/callComponents/CallNavbar";
import CallVideo from "../components/callComponents/CallVideo";
import CallSidebar from "../components/callComponents/CallSidebar";
import { useStreamingAvatar } from "../heygen/StreamingAvatarContext";
import { childVariants, containerVariants } from "../animations/callAnimations";
import { useState } from "react";

const Call = () => {
  const { speakText } = useStreamingAvatar();
  const [message, setMessage] = useState("");
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
          <div className="flex flex-col items-center justify-center">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full max-w-xl px-4 py-2 rounded-full border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-accent text-base bg-white"
              style={{ minWidth: 200 }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            className="ml-3 px-5 py-2 rounded-full bg-accent text-black font-semibold shadow hover:bg-accent/90 transition-colors"
            type="button"
            onClick={() => {
              speakText(message);
              setMessage("");
            }}
          >
            Send
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Call;
