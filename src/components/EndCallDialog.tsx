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
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          <MdCallEnd className="text-red-600 text-5xl mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">End Call?</h2>
          <p className="text-lg text-gray-700 mb-4 text-center">
            Are you sure you want to end the call?
          </p>
          <div className="flex gap-4 mt-2">
            <button
              className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold text-base shadow hover:bg-gray-300 transition-colors cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold text-base shadow hover:bg-red-700 transition-colors cursor-pointer"
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
