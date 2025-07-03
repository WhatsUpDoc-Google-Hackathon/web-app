import { MdCallEnd } from "react-icons/md";
import { useState } from "react";
import EndCallDialog from "./EndCallDialog";

const doctorAvatar =
  "https://ui-avatars.com/api/?name=Dr+John+Doe&background=0D8ABC&color=fff&rounded=true";

const CallNavbar = () => {
  const [showEndDialog, setShowEndDialog] = useState(false);

  const handleEndCall = () => {
    setShowEndDialog(true);
  };

  const handleConfirmEnd = () => {
    setShowEndDialog(false);
    // TODO: Add actual end call logic here (redirect, etc)
  };

  return (
    <div className="rounded-2xl bg-[var(--color-bg-secondary)] px-8 py-4 pr-4 flex items-center justify-between shadow-lg mb-2 border border-gray-200">
      <div className="flex items-center gap-2">
        <img
          src={doctorAvatar}
          alt="Doctor Avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-accent bg-gray-200"
        />
        <span className="font-semibold text-lg text-[var(--color-text)]">
          Dr. John Doe Assistant
        </span>
      </div>
      <div className="flex items-center">
        <button
          className="flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 transition-colors shadow-lg border border-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-red-300 px-4 py-2 cursor-pointer"
          title="End Call"
          onClick={handleEndCall}
        >
          <span className="flex items-center gap-2">
            <MdCallEnd className="text-white text-2xl" />
            <span className="text-white font-semibold text-sm">End Call</span>
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
