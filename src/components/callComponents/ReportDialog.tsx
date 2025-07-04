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
            <MdOutlineReportProblem className="text-red-500 text-3xl mb-3 animate-pulse" />
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Report an Issue
            </h2>
            <p className="text-sm text-gray-700 mb-4 text-center leading-relaxed">
              Please describe the issue you encountered.
            </p>
            {submitted ? (
              <div className="text-green-600 font-semibold py-4 text-sm">
                Thank you for your report!
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-center"
              >
                <textarea
                  className="w-full min-h-[70px] border border-gray-300 rounded-lg p-2 mb-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Describe the problem..."
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-sm shadow hover:bg-primary transition-colors cursor-pointer"
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
