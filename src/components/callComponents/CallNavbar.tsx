import { MdCallEnd } from "react-icons/md";
import { useState } from "react";
import EndCallDialog from "./EndCallDialog";
import { useStreamingAvatar } from "../../heygen/StreamingAvatarContext";
import { useNavigate } from "react-router-dom";

const doctorAvatar =
  "https://ui-avatars.com/api/?name=Dr+John+Doe&background=0D8ABC&color=fff&rounded=true";

const CallNavbar = () => {
  const { stopSession } = useStreamingAvatar();
  const navigate = useNavigate();
  const [showEndDialog, setShowEndDialog] = useState(false);

  const handleEndCall = () => {
    setShowEndDialog(true);
  };

  const handleConfirmEnd = () => {
    setShowEndDialog(false);
    stopSession();
    navigate("/");
  };

  return (
    <div className="rounded-xl md:rounded-2xl bg-[var(--color-bg-secondary)] px-3 md:px-8 py-3 md:py-4 pr-3 md:pr-4 flex items-center justify-between shadow-lg mb-2 border border-gray-200">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <img
          src={doctorAvatar}
          alt="Doctor Avatar"
          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-accent bg-gray-200 flex-shrink-0"
        />
        <span className="font-semibold text-sm md:text-lg text-[var(--color-text)] truncate">
          <span className="hidden sm:inline">Dr. John Doe Assistant</span>
          <span className="sm:hidden">Dr. Doe Assistant</span>
        </span>
      </div>
      <div className="flex items-center flex-shrink-0">
        <button
          className="flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 transition-colors shadow-lg border border-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-red-300 px-3 md:px-4 py-2 cursor-pointer"
          title="End Call"
          onClick={handleEndCall}
        >
          <span className="flex items-center gap-1 md:gap-2">
            <MdCallEnd className="text-white text-lg md:text-2xl" />
            <span className="text-white font-semibold text-xs md:text-sm hidden sm:inline">
              End Call
            </span>
          </span>
        </button>
      </div>
      <EndCallDialog
        open={showEndDialog}
        onClose={() => setShowEndDialog(false)}
        onConfirm={handleConfirmEnd}
      />
    </div>
  );
};

export default CallNavbar;
