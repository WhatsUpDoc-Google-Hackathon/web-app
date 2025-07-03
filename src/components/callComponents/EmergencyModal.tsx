import { AnimatePresence, motion } from "framer-motion";
import { MdEmergency } from "react-icons/md";

type EmergencyModalProps = {
  open: boolean;
  onClose: () => void;
};

const EmergencyModal = ({ open, onClose }: EmergencyModalProps) => (
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
          <MdEmergency className="text-red-600 text-5xl mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Emergency</h2>
          <p className="text-lg text-gray-700 mb-4 text-center">
            If you are experiencing a medical emergency, please call{" "}
            <span className="font-bold">112</span> immediately.
          </p>
          <button
            className="mt-2 px-6 py-2 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-base shadow hover:bg-primary transition-colors cursor-pointer"
            onClick={onClose}
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default EmergencyModal;
