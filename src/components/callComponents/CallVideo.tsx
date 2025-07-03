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
import { TaskType } from "@heygen/streaming-avatar";
import AvatarStream, { type AvatarStreamHandle } from "./AvatarStream";
import { useAvatarStore } from "./avatarStore";

interface CallVideoProps {
  heygenToken: string;
  heygenAvatarId: string;
  heygenVoiceId: string;
  /**
   * Optional: callback to expose a function for programmatic speaking (e.g., from backend or parent)
   * Usage: (fn) => { window.speakWithHeyGen = fn; }
   */
  exposeSpeakFn?: (fn: (text: string) => void) => void;
}

const CallVideo = ({
  heygenToken,
  heygenAvatarId,
  heygenVoiceId,
  exposeSpeakFn,
}: CallVideoProps) => {
  // Timer state for elapsed time
  const [elapsed, setElapsed] = useState(0);
  const avatarReady = useAvatarStore((s) => s.avatarReady);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (avatarReady) {
      interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [avatarReady]);

  // Emergency modal state
  const [showModal, setShowModal] = useState(false);

  // Mute state
  const [isMuted, setIsMuted] = useState(false);

  // Report dialog state
  const [showReport, setShowReport] = useState(false);

  // HeyGen Avatar state
  const heygenRef = useRef<AvatarStreamHandle>(null);
  const [status, setStatus] = useState<string>("NULL");

  useEffect(() => {
    console.log("Avatar ready:", avatarReady);
    console.log("Status:", status);
  }, [avatarReady, status]);

  // Expose a function to speak via HeyGen using TaskType.REPEAT (for custom LLM flow)
  useEffect(() => {
    if (exposeSpeakFn) {
      exposeSpeakFn((text: string) => {
        console.log("Speaking with HeyGen:", text);
        heygenRef.current?.speak(text, TaskType.REPEAT);
      });
    }
    // Optionally, attach to window for debugging
    // (window as any).speakWithHeyGen = (text: string) => heygenRef.current?.speak(text, TaskType.REPEAT);
  }, [exposeSpeakFn]);

  // Handle MoreDropdown selection
  const handleDropdownSelect = (option: string) => {
    if (option === "Disconnect") setShowModal(true);
    // Add logic for other options if needed
  };

  return (
    <div className="relative rounded-3xl shadow-2xl overflow-visible w-full aspect-video flex flex-col items-center justify-center">
      <div className="absolute top-6 right-6 z-10">
        <CallTimer elapsed={elapsed} />
      </div>

      <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
        <CallStatusTag />
      </div>

      <div className="absolute bottom-6 left-6 z-10">
        <PrivacyDisclaimer />
      </div>

      <div className="absolute top-0 left-0 w-full h-full z-1 flex flex-col items-center justify-center bg-white/80 rounded-l-3xl p-4">
        <AvatarStream
          ref={heygenRef}
          token={heygenToken}
          avatarName={heygenAvatarId}
          voiceId={heygenVoiceId}
          onStatus={setStatus}
        />
        {!avatarReady && (
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
      </div>
      <div className="text-xs text-gray-500 mt-1">{status}</div>
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
