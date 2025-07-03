import { MdOutlineReportProblem, MdEmergency } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { LuTimer } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock } from "react-icons/fa6";
import ReportDialog from "./ReportDialog";
import MuteButtonWithTooltip from "./MuteButtonWithTooltip";
import MoreDropdown from "./MoreDropdown";
import VideoPlaceholder from "../assets/video_placeholder.jpg";

const CallVideo = () => {
  // Timer state for elapsed time
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // Voice-to-text input (placeholder, not functional)
  const inputRef = useRef<HTMLInputElement>(null);
  const [voiceText, setVoiceText] = useState("");

  // Emergency modal state
  const [showModal, setShowModal] = useState(false);

  // Mute state
  const [isMuted, setIsMuted] = useState(false);

  // Report dialog state
  const [showReport, setShowReport] = useState(false);

  // Video image loading state
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Handle MoreDropdown selection
  const handleDropdownSelect = (option: string) => {
    if (option === "Disconnect") setShowModal(true);
    // Add logic for other options if needed
  };

  return (
    <div className="relative rounded-3xl shadow-2xl overflow-visible w-full aspect-video flex flex-col items-center justify-center">
      {/* Top right: Timer */}
      <div className="absolute top-6 right-6 z-10">
        <span className="bg-accent/80 backdrop-blur-sm text-primary font-mono px-3 py-1 rounded-full shadow flex items-center gap-1 text-sm text-center">
          <LuTimer className="text-primary text-lg" /> {formatTime(elapsed)}
        </span>
      </div>
      {/* Top left: Call in progress tag */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
        <span className="bg-accent/80 backdrop-blur-sm text-primary text-xs font-semibold px-4 py-1 rounded-full shadow">
          Call in Progress with an AI Assistant
        </span>
      </div>
      {/* Privacy disclaimer bottom left */}
      <div className="absolute bottom-6 left-6 z-10">
        <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded shadow flex items-center gap-1">
          <FaLock className="text-gray-500 text-md" /> Your data is private and
          securely processed.
        </span>
      </div>
      {/* Main video placeholder */}
      <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-secondary)] rounded-2xl relative overflow-hidden">
        {/* Skeleton shimmer animation */}
        {!isImageLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 w-full h-full flex items-center justify-center z-1"
          >
            <div className="w-full h-full rounded-2xl bg-gray-200 relative overflow-hidden">
              <div
                className="absolute inset-0 animate-shimmer bg-gradient-to-r from-blue-100 via-gray-100 to-blue-100 opacity-80"
                style={{ backgroundSize: "200% 100%" }}
              />
            </div>
          </motion.div>
        )}
        {/* Video image */}
        <motion.img
          src={VideoPlaceholder}
          alt="Video Stream"
          className="w-full h-full object-cover rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isImageLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          onLoad={() => setIsImageLoaded(true)}
          style={{ position: "absolute", inset: 0 }}
        />
      </div>
      {/* Bottom center controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-6 z-10 items-center">
        <button
          className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
          title="Report an issue"
          onClick={() => setShowReport(true)}
        >
          <MdOutlineReportProblem className="text-red-500 text-2xl" />
        </button>
        <MuteButtonWithTooltip isMuted={isMuted} setIsMuted={setIsMuted} />
        <motion.div
          animate={{ marginLeft: isMuted ? 120 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <MoreDropdown onSelect={handleDropdownSelect} />
        </motion.div>
      </div>
      {/* Emergency button bottom right */}
      <button
        className="absolute bottom-6 right-6 z-20 flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-lg font-bold shadow-xl focus:outline-none focus:ring-4 focus:ring-red-300 transition-all cursor-pointer"
        style={{ minWidth: 160 }}
        title="Emergency"
        onClick={() => setShowModal(true)}
      >
        <MdEmergency className="text-2xl" /> Emergency
      </button>
      {/* Voice-to-text input below video */}
      {/* <div className="absolute left-1/2 bottom-[-60px] -translate-x-1/2 w-[80%] max-w-xl z-10">
        <div className="flex items-center bg-white border border-gray-200 rounded-full shadow px-4 py-2">
          <span className="text-xl text-accent mr-2">🗣️</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent outline-none text-[var(--color-text)] placeholder-gray-400 px-2 py-1"
            placeholder="Speak or type your message..."
            value={voiceText}
            onChange={(e) => setVoiceText(e.target.value)}
          />
        </div>
      </div> */}
      {/* Emergency Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl focus:outline-none"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                ×
              </button>
              <MdEmergency className="text-red-600 text-5xl mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold text-red-600 mb-2">
                Emergency
              </h2>
              <p className="text-lg text-gray-700 mb-4 text-center">
                If you are experiencing a medical emergency, please call{" "}
                <span className="font-bold">112</span> immediately.
              </p>
              <button
                className="mt-2 px-6 py-2 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-base shadow hover:bg-primary transition-colors cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Report Dialog */}
      <ReportDialog open={showReport} onClose={() => setShowReport(false)} />
    </div>
  );
};

export default CallVideo;
