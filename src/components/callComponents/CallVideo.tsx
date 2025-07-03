import { MdOutlineReportProblem, MdEmergency } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ReportDialog from "./ReportDialog";
import MuteButtonWithTooltip from "./MuteButtonWithTooltip";
import MoreDropdown from "./MoreDropdown";
import VideoPlaceholder from "../../assets/video_placeholder.jpg";
import CallTimer from "./CallTimer";
import CallStatusTag from "./CallStatusTag";
import PrivacyDisclaimer from "./PrivacyDisclaimer";
import VideoPlaceholderDisplay from "./VideoPlaceholderDisplay";
import EmergencyModal from "./EmergencyModal";

const CallVideo = () => {
  // Timer state for elapsed time
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

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
        <CallTimer elapsed={elapsed} />
      </div>
      {/* Top left: Call in progress tag */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
        <CallStatusTag />
      </div>
      {/* Privacy disclaimer bottom left */}
      <div className="absolute bottom-6 left-6 z-10">
        <PrivacyDisclaimer />
      </div>
      {/* Main video placeholder */}
      <VideoPlaceholderDisplay
        isImageLoaded={isImageLoaded}
        setIsImageLoaded={setIsImageLoaded}
        VideoPlaceholder={VideoPlaceholder}
      />
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
      {/* Emergency Modal */}
      <EmergencyModal open={showModal} onClose={() => setShowModal(false)} />
      {/* Report Dialog */}
      <ReportDialog open={showReport} onClose={() => setShowReport(false)} />
    </div>
  );
};

export default CallVideo;
