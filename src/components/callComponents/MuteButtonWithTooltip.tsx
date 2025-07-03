import { MdOutlineMicOff } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

interface MuteButtonWithTooltipProps {
  isMuted: boolean;
  setIsMuted: (v: boolean) => void;
}

const MuteButtonWithTooltip = ({
  isMuted,
  setIsMuted,
}: MuteButtonWithTooltipProps) => (
  <div className="relative flex items-center">
    <button
      className={`w-12 h-12 rounded-full ${
        isMuted ? "bg-gray-900" : "bg-white"
      } shadow-md flex items-center justify-center hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-accent`}
      title="Mute"
      onClick={() => setIsMuted(!isMuted)}
    >
      <MdOutlineMicOff
        className={`text-2xl ${isMuted ? "text-white" : "text-gray-700"}`}
      />
    </button>
    <AnimatePresence>
      {isMuted && (
        <motion.div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 flex items-center bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg whitespace-nowrap"
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
          <span>You are muted</span>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default MuteButtonWithTooltip;
