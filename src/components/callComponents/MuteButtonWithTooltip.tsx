import { MdOutlineMicOff, MdOutlineMic } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

interface MuteButtonWithTooltipProps {
  isMuted: boolean;
  setIsMuted: (v: boolean) => void;
  isReady?: boolean;
}

const MuteButtonWithTooltip = ({
  isMuted,
  setIsMuted,
  isReady = true,
}: MuteButtonWithTooltipProps) => (
  <div className="relative flex items-center">
    <button
      className={`w-10 h-10 md:w-12 md:h-12 rounded-full shadow-md flex items-center justify-center transition-colors focus:outline-none ${
        !isReady
          ? "bg-gray-200 cursor-not-allowed"
          : isMuted
          ? "bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-accent"
          : "bg-white hover:bg-gray-200 focus:ring-2 focus:ring-accent"
      }`}
      title={!isReady ? "Mic not ready" : isMuted ? "Unmute" : "Mute"}
      onClick={() => {
        if (isReady) {
          setIsMuted(!isMuted);
        }
      }}
      disabled={!isReady}
    >
      {isMuted ? (
        <MdOutlineMicOff
          className={`text-lg md:text-2xl ${
            !isReady ? "text-gray-400" : "text-white"
          }`}
        />
      ) : (
        <MdOutlineMic
          className={`text-lg md:text-2xl ${
            !isReady ? "text-gray-400" : "text-gray-700"
          }`}
        />
      )}
    </button>
    <AnimatePresence>
      {isMuted && (
        <motion.div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-2 md:ml-3 flex items-center bg-gray-900 text-white text-xs font-semibold px-2 md:px-4 py-1 md:py-2 rounded-lg shadow-lg whitespace-nowrap z-30"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 18,
            mass: 0.7,
          }}
          style={{ pointerEvents: "none" }}
        >
          <span className="hidden sm:inline">You are muted</span>
          <span className="sm:hidden">Muted</span>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default MuteButtonWithTooltip;
