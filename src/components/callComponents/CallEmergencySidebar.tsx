import { useState, useEffect } from "react";

const CallEmergencySidebar = () => {
  const [emergencyCode, setEmergencyCode] = useState<string>("");

  // Generate a random 4-digit code on component mount
  useEffect(() => {
    const generateCode = () => {
      return Math.floor(1000 + Math.random() * 9000).toString();
    };
    setEmergencyCode(generateCode());
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(emergencyCode);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <aside className="w-full flex flex-col gap-3 md:gap-4">
      {/* Emergency Code Card */}
      <div className="rounded-xl md:rounded-2xl bg-red-600/70 p-6 md:p-8 shadow-xl border border-red-700/60 animate-pulse">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white">
              Emergency Diagnostic
            </h2>
          </div>

          <p className="text-sm md:text-base text-red-100 mb-6">
            Based on your symptoms, please call{" "}
            <strong className="text-white">112</strong> and give them this code:
          </p>

          <div className="bg-white rounded-lg p-6 mb-4">
            <div className="text-3xl md:text-4xl font-mono font-bold text-gray-900 tracking-wider mb-3">
              {emergencyCode}
            </div>
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Code
            </button>
          </div>

          <a
            href="tel:112"
            className="inline-flex items-center gap-2 bg-white text-red-600 font-bold text-xl px-6 py-3 rounded-lg hover:bg-red-50 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            Call 112
          </a>
        </div>
      </div>
    </aside>
  );
};

export default CallEmergencySidebar;
