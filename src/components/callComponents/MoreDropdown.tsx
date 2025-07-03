import { useState, useEffect } from "react";
import { MdMoreHoriz } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

interface MoreDropdownProps {
  onSelect: (option: string) => void;
  isReady?: boolean;
}

const MoreDropdown = ({ onSelect, isReady = true }: MoreDropdownProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!showDropdown) return;
    const handle = (e: MouseEvent) => {
      const dropdown = document.getElementById("more-dropdown");
      const btn = document.getElementById("more-btn");
      if (
        dropdown &&
        !dropdown.contains(e.target as Node) &&
        btn &&
        !btn.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [showDropdown]);

  const handleSelect = (option: string) => {
    if (!isReady) return;
    setShowDropdown(false);
    onSelect(option);
  };

  return (
    <div className="relative">
      <button
        id="more-btn"
        className={`w-12 h-12 rounded-full shadow-md flex items-center justify-center transition-colors focus:outline-none ${
          isReady
            ? "bg-white hover:bg-gray-200 focus:ring-2 focus:ring-accent cursor-pointer"
            : "bg-gray-200 cursor-not-allowed"
        }`}
        title={isReady ? "More" : "Please wait..."}
        onClick={() => isReady && setShowDropdown((v) => !v)}
        disabled={!isReady}
      >
        <MdMoreHoriz
          className={`text-2xl ${isReady ? "text-gray-700" : "text-gray-400"}`}
        />
      </button>
      <AnimatePresence>
        {showDropdown && isReady && (
          <motion.div
            id="more-dropdown"
            className="absolute bottom-16 left-1/2 -translate-x-1/2 mb-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <button
              className="px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700 rounded-t-xl"
              onClick={() => handleSelect("Settings")}
            >
              Settings
            </button>
            <button
              className="px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700"
              onClick={() => handleSelect("Help")}
            >
              Help
            </button>
            <button
              className="px-4 py-3 text-left hover:bg-red-50 transition-colors text-red-600 rounded-b-xl"
              onClick={() => handleSelect("Disconnect")}
            >
              Disconnect
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoreDropdown;
