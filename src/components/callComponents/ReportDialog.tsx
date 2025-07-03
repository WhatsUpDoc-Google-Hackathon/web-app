import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineReportProblem } from "react-icons/md";
import { useState } from "react";

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
}

const ReportDialog = ({ open, onClose }: ReportDialogProps) => {
  const [report, setReport] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setReport("");
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
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
            <MdOutlineReportProblem className="text-red-500 text-5xl mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Report an Issue
            </h2>
            <p className="text-lg text-gray-700 mb-4 text-center">
              Please describe the issue you encountered.
            </p>
            {submitted ? (
              <div className="text-green-600 font-semibold py-6">
                Thank you for your report!
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-center"
              >
                <textarea
                  className="w-full min-h-[80px] border border-gray-300 rounded-lg p-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Describe the problem..."
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-base shadow hover:bg-primary transition-colors cursor-pointer"
                >
                  Submit
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportDialog;
