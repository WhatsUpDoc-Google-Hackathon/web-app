import { motion } from "framer-motion";
import CallNavbar from "../components/callComponents/CallNavbar";
import CallVideo from "../components/callComponents/CallVideo";
import CallSidebar from "../components/callComponents/CallSidebar";
import { useStreamingAvatar } from "../heygen/StreamingAvatarContext";
import { childVariants, containerVariants } from "../animations/callAnimations";
import { useState, useRef, useEffect } from "react";
import { HiChatBubbleLeftRight, HiStop } from "react-icons/hi2";
import { IoSend } from "react-icons/io5";
import { AudioTranscription } from "../sst_streamer/audioTranscription";
import MuteButtonWithTooltip from "../components/callComponents/MuteButtonWithTooltip";

const Call = () => {
  const { speakText, isReady } = useStreamingAvatar();
  const [centerMessage, setCenterMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState("");
  const audioTranscriptionRef = useRef<AudioTranscription | null>(null);

  // Auto-start transcription on mount
  useEffect(() => {
    const start = async () => {
      const sttUrl = import.meta.env.VITE_SST_URL || 'ws://127.0.0.1:8080';
      const sttApiKey = import.meta.env.VITE_STT_API_KEY || 'public_token';
      const at = new AudioTranscription(
        sttUrl,
        sttApiKey,
        false,
        (text: string) => {
          setTranscriptionText(prev => prev + text + " ");
          setCenterMessage(prev => prev + text + " ");
        },
        () => console.log("Speech pause detected"),
        (error: string) => console.error("Transcription error:", error)
      );
      audioTranscriptionRef.current = at;
      try {
        await at.startTranscription();
      } catch {
        // handle error if needed
      }
    };
    start();
  }, []);

  // Update mute state on API
  useEffect(() => {
    if (audioTranscriptionRef.current) {
      isMuted ? audioTranscriptionRef.current.mute() : audioTranscriptionRef.current.unmute();
    }
  }, [isMuted]);

  const handleSendMessage = () => {
    if (centerMessage.trim() && isReady) {
      speakText(centerMessage);
      setCenterMessage("");
      setTranscriptionText("");
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="flex flex-col w-full mx-auto gap-3 md:gap-4 px-2 md:px-4 py-2 md:py-4"
    >
      <motion.div variants={childVariants}>
        <CallNavbar />
      </motion.div>
      <div className="flex flex-col lg:flex-row gap-3 md:gap-6">
        <div className="flex flex-col gap-3 md:gap-4 lg:flex-1">
          <motion.div variants={childVariants} className="flex items-center justify-center w-full rounded-3xl">
            <CallVideo />
          </motion.div>
          <motion.div variants={childVariants} className="flex justify-center items-center w-full">
            <div className="flex flex-col gap-3 w-full max-w-4xl">
              {/* Recording indicator always on when mounted */}
              <div className="flex items-center justify-center gap-2 text-red-500 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Live transcription active
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Send a message..."
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm bg-white/95"
                    value={centerMessage}
                    onChange={(e) => setCenterMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <HiChatBubbleLeftRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <MuteButtonWithTooltip isMuted={isMuted} setIsMuted={setIsMuted} isReady={true} />
                  <button
                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-accent to-accent/80 text-black font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                    onClick={handleSendMessage}
                    disabled={!centerMessage.trim() || !isReady}
                  >
                    <IoSend className="w-5 h-5" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div variants={childVariants} className="w-full lg:w-[340px] xl:w-[380px] lg:flex-shrink-0">
          <CallSidebar />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Call;
