import { MdCallEnd } from "react-icons/md";
import { HiSignal, HiSignalSlash } from "react-icons/hi2";
import { BsMicMute } from "react-icons/bs";
import { AiOutlineWifi } from "react-icons/ai";
import { useState } from "react";
import EndCallDialog from "./EndCallDialog";
import { useStreamingAvatar } from "../../heygen/StreamingAvatarContext";
import { useNavigate } from "react-router-dom";

const doctorAvatar =
  "https://ui-avatars.com/api/?name=Emma&background=0D8ABC&color=fff&rounded=true";

interface CallNavbarProps {
  // WebSocket connection
  isConnected: boolean;
  connectionState: string;
  // STT connection
  isSTTConnected?: boolean;
  sttConnectionInfo?: {
    type: string;
    status: string;
  };
  isMuted?: boolean;
}

const CallNavbar = ({
  isConnected,
  connectionState,
  isSTTConnected = false,
  sttConnectionInfo,
  isMuted = false,
}: CallNavbarProps) => {
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

  // Determine overall connection status
  const getConnectionStatus = () => {
    if (!isConnected && !isSTTConnected) {
      return { color: "bg-red-500", text: "Disconnected", icon: HiSignalSlash };
    }
    if (isConnected && isSTTConnected && !isMuted) {
      return { color: "bg-green-500", text: "Connected", icon: HiSignal };
    }
    if (isConnected && isSTTConnected && isMuted) {
      return { color: "bg-yellow-500", text: "Muted", icon: BsMicMute };
    }
    if (
      connectionState === "CONNECTING" ||
      connectionState === "RECONNECTING"
    ) {
      return {
        color: "bg-yellow-500 animate-pulse",
        text: "Connecting",
        icon: AiOutlineWifi,
      };
    }
    return { color: "bg-orange-500", text: "Partial", icon: HiSignal };
  };

  const status = getConnectionStatus();
  const StatusIcon = status.icon;

  return (
    <div className="relative rounded-xl md:rounded-2xl bg-[var(--color-bg-secondary)] px-3 md:px-8 py-3 md:py-4 pr-3 md:pr-4 sm:py-[10px] flex items-center justify-between shadow-lg mb-2 border border-gray-200 z-30">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <img
          src={doctorAvatar}
          alt="Doctor Avatar"
          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-accent bg-gray-200 flex-shrink-0"
        />
        <span className="font-semibold text-sm md:text-lg text-[var(--color-text)] truncate">
          <span className="hidden sm:inline">Emma - Dr. Smith Assistant</span>
          <span className="sm:hidden">Emma - Dr. Smith Assistant</span>
        </span>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Merged Connection Status */}
        <div className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <StatusIcon className="w-4 h-4 text-gray-600" />
            <div className={`w-2 h-2 rounded-full ${status.color}`} />
            <span className="text-xs font-medium text-gray-700 hidden sm:inline">
              {status.text}
            </span>
          </div>

          {/* Detailed status on hover/mobile */}
          <div className="group relative">
            <div className="w-4 h-4 rounded-full bg-gray-200 cursor-help flex items-center justify-center">
              <span className="text-xs text-gray-500">i</span>
            </div>

            {/* Tooltip */}
            <div className="absolute right-0 top-8 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[9999] pointer-events-none">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    WebSocket
                  </span>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isConnected
                          ? "bg-green-500"
                          : connectionState === "CONNECTING"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-xs text-gray-700">
                      {isConnected ? "Connected" : connectionState}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    {sttConnectionInfo?.type || "Speech"}
                  </span>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isSTTConnected && !isMuted
                          ? "bg-green-500"
                          : isSTTConnected && isMuted
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-xs text-gray-700">
                      {isMuted
                        ? "Muted"
                        : sttConnectionInfo?.status || "Disconnected"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* End Call Button */}
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
