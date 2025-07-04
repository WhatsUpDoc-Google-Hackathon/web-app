import React from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineReload,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";

interface FileUploadProgressProps {
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
  onRetry?: () => void;
  className?: string;
}

const FileUploadProgress: React.FC<FileUploadProgressProps> = ({
  progress,
  status,
  error,
  onRetry,
  className = "",
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case "uploading":
        return (
          <AiOutlineLoading3Quarters className="text-blue-500 text-sm animate-spin" />
        );
      case "completed":
        return <AiOutlineCheckCircle className="text-green-500 text-sm" />;
      case "error":
        return <AiOutlineCloseCircle className="text-red-500 text-sm" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "Ready to upload";
      case "uploading":
        return `Uploading... ${progress}%`;
      case "completed":
        return "Upload complete";
      case "error":
        return error || "Upload failed";
      default:
        return "";
    }
  };

  const getProgressBarColor = () => {
    switch (status) {
      case "uploading":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Status line */}
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="flex items-center gap-1">
          {getStatusIcon()}
          <span className="text-gray-600">{getStatusText()}</span>
        </div>
        {status === "error" && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition-colors"
            title="Retry upload"
          >
            <AiOutlineReload className="text-xs" />
            Retry
          </button>
        )}
      </div>

      {/* Progress bar */}
      {(status === "uploading" || status === "completed") && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full ${getProgressBarColor()} transition-all duration-300 ease-out`}
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      )}

      {/* Error message */}
      {status === "error" && error && (
        <div className="text-xs text-red-600 mt-1 break-words">{error}</div>
      )}
    </div>
  );
};

export default FileUploadProgress;
