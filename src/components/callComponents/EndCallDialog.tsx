import { AnimatePresence, motion } from "framer-motion";
import { MdCallEnd } from "react-icons/md";

interface EndCallDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const EndCallDialog = ({ open, onClose, onConfirm }: EndCallDialogProps) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full flex flex-col items-center relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          <MdCallEnd className="text-red-600 text-3xl mb-3 animate-pulse" />
          <h2 className="text-xl font-bold text-red-600 mb-2">End Call?</h2>
          <p className="text-sm text-gray-700 mb-4 text-center leading-relaxed">
            Are you sure you want to end the call?
          </p>
          <div className="flex gap-3 mt-2">
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold text-sm shadow hover:bg-gray-300 transition-colors cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-sm shadow hover:bg-red-700 transition-colors cursor-pointer"
              onClick={onConfirm}
            >
              End Call
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default EndCallDialog;
