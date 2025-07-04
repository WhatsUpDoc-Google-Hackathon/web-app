import { MdOutlineReportProblem, MdEmergency } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ReportDialog from "./ReportDialog";
import MuteButtonWithTooltip from "./MuteButtonWithTooltip";
import MoreDropdown from "./MoreDropdown";
import CallTimer from "./CallTimer";
import CallStatusTag from "./CallStatusTag";
import PrivacyDisclaimer from "./PrivacyDisclaimer";
import EmergencyModal from "./EmergencyModal";
import {
  AvatarStatus,
  useStreamingAvatar,
} from "../../heygen/StreamingAvatarContext";

const CallVideo = ({
  isMuted,
  setIsMuted,
}: {
  isMuted: boolean;
  setIsMuted: (newValue: boolean) => void;
}) => {
  const { mediaStream, isReady, status } = useStreamingAvatar();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!videoRef.current) return;
    const videoEl = videoRef.current;

    if (mediaStream) {
      console.log("🔴 attaching stream to video element", mediaStream);
      videoEl.srcObject = mediaStream;
      // allow autoplay by muting
      videoEl.muted = true;
      // necessary on some mobile browsers
      videoEl.playsInline = true;
      videoEl.autoplay = true;

      videoEl
        .play()
        .then(() => console.log("▶️ video is playing"))
        .catch((err) =>
          console.warn("❌ video.play() failed (autoplay blocked?):", err)
        );
    } else {
      // detach if no stream
      videoEl.srcObject = null;
    }
  }, [mediaStream]);

  useEffect(() => {
    if (status === AvatarStatus.SPEAKING) {
      if (videoRef.current) {
        videoRef.current!.muted = false;
        videoRef.current!.volume = 1;
      }
    }
  }, [status]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isReady) {
      interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isReady]);

  // Emergency modal state
  const [showModal, setShowModal] = useState(false);

  // Mute state
  // const [isMuted, setIsMuted] = useState(false);

  const handleSetIsMuted = (newValue: boolean) => {
    setIsMuted(newValue);
  };

  // Report dialog state
  const [showReport, setShowReport] = useState(false);

  // Handle MoreDropdown selection
  const handleDropdownSelect = (option: string) => {
    if (option === "Disconnect") setShowModal(true);
    // Add logic for other options if needed
  };

  return (
    <div className="relative rounded-2xl md:rounded-3xl shadow-2xl overflow-visible w-full aspect-video flex flex-col items-center justify-center">
      {/* Top right timer */}
      <div className="absolute top-3 md:top-6 right-3 md:right-6 z-10">
        <CallTimer elapsed={elapsed} />
      </div>

      {/* Top left status */}
      <div className="absolute top-3 md:top-6 left-3 md:left-6 z-10 flex items-center gap-3">
        <CallStatusTag status={status} />
      </div>

      {/* Bottom left privacy disclaimer - hidden on small screens */}
      <div className="absolute bottom-3 md:bottom-6 left-3 md:left-6 z-10 hidden md:block">
        <PrivacyDisclaimer />
      </div>

      {/* Video container */}
      <div className="absolute top-0 left-0 w-full h-full z-1 flex flex-col items-center justify-center bg-white/80 rounded-l-2xl md:rounded-l-3xl">
        {!isReady && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 w-full h-full flex items-center justify-center z-1"
          >
            <div className="w-full h-full rounded-xl md:rounded-2xl bg-gray-200 relative overflow-hidden">
              <div
                className="absolute inset-0 animate-shimmer bg-gradient-to-r from-blue-100 via-gray-100 to-blue-100 opacity-80"
                style={{ backgroundSize: "200% 100%" }}
              />
            </div>
          </motion.div>
        )}
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-2xl md:rounded-3xl"
          muted // allow autoplay
          playsInline // iOS safari inline playback
          autoPlay // hint to start playing immediately
          controls={false}
        />
      </div>

      {/* Bottom controls - left on mobile, center on larger screens */}
      <div className="absolute bottom-3 md:bottom-6 left-3 md:left-1/2 md:-translate-x-1/2 flex gap-2 md:gap-6 z-10 items-center">
        <button
          className={`w-10 h-10 md:w-12 md:h-12 rounded-full shadow-md flex items-center justify-center transition-colors focus:outline-none ${
            isReady
              ? "bg-white hover:bg-red-100 focus:ring-2 focus:ring-red-500 cursor-pointer"
              : "bg-gray-200 cursor-not-allowed"
          }`}
          title={isReady ? "Report an issue" : "Please wait..."}
          onClick={() => isReady && setShowReport(true)}
          disabled={!isReady}
        >
          <MdOutlineReportProblem
            className={`text-lg md:text-2xl ${
              isReady ? "text-red-500" : "text-gray-400"
            }`}
          />
        </button>
        <MuteButtonWithTooltip
          isMuted={isMuted}
          setIsMuted={handleSetIsMuted}
          isReady={isReady}
        />
        <motion.div
          animate={{ marginLeft: isMuted ? 60 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="md:ml-0"
        >
          <MoreDropdown onSelect={handleDropdownSelect} isReady={isReady} />
        </motion.div>
      </div>

      {/* SOS/Emergency button - stays on right */}
      <button
        className={`absolute bottom-3 md:bottom-6 right-3 md:right-6 z-20 flex items-center justify-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-sm md:text-lg font-bold shadow-xl focus:outline-none transition-all ${
          isReady
            ? "bg-red-600 hover:bg-red-700 text-white focus:ring-4 focus:ring-red-300 cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        style={{ minWidth: "100px" }}
        title={isReady ? "Emergency" : "Please wait..."}
        onClick={() => isReady && setShowModal(true)}
        disabled={!isReady}
      >
        <MdEmergency className="text-lg md:text-2xl" />
        <span className="hidden sm:inline">Emergency</span>
        <span className="sm:hidden">SOS</span>
      </button>

      {/* Emergency Modal */}
      <EmergencyModal open={showModal} onClose={() => setShowModal(false)} />
      {/* Report Dialog */}
      <ReportDialog open={showReport} onClose={() => setShowReport(false)} />
    </div>
  );
};

export default CallVideo;
