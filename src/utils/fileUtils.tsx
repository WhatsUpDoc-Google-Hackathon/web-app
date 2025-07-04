import {
  AiOutlineFile,
  AiOutlineFilePdf,
  AiOutlineFileImage,
  AiOutlineFileWord,
  AiOutlineFileExcel,
  AiOutlineFileZip,
} from "react-icons/ai";

export const getFileIcon = (
  file: File,
  className = "text-accent text-lg md:text-xl"
) => {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext) return <AiOutlineFile className={className} />;

  if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(ext))
    return <AiOutlineFileImage className="text-blue-400 text-lg md:text-xl" />;
  if (["pdf"].includes(ext))
    return <AiOutlineFilePdf className="text-red-400 text-lg md:text-xl" />;
  if (["doc", "docx"].includes(ext))
    return <AiOutlineFileWord className="text-blue-600 text-lg md:text-xl" />;
  if (["xls", "xlsx", "csv"].includes(ext))
    return <AiOutlineFileExcel className="text-green-600 text-lg md:text-xl" />;
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
    return <AiOutlineFileZip className="text-yellow-500 text-lg md:text-xl" />;

  return <AiOutlineFile className={className} />;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileType = (file: File): string => {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext) return "Unknown";

  if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(ext))
    return "Image";
  if (["pdf"].includes(ext)) return "PDF";
  if (["doc", "docx"].includes(ext)) return "Word Document";
  if (["xls", "xlsx", "csv"].includes(ext)) return "Spreadsheet";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "Archive";
  if (["txt"].includes(ext)) return "Text";
  if (["mp4", "avi", "mov", "wmv", "flv"].includes(ext)) return "Video";
  if (["mp3", "wav", "ogg", "m4a"].includes(ext)) return "Audio";

  return ext.toUpperCase();
};

export const isValidFileType = (
  file: File,
  allowedTypes?: string[]
): boolean => {
  if (!allowedTypes || allowedTypes.length === 0) return true;

  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext ? allowedTypes.includes(ext) : false;
};

export const getMaxFileSize = (sizeInMB: number): number => {
  return sizeInMB * 1024 * 1024; // Convert MB to bytes
};

export const validateFileSize = (
  file: File,
  maxSizeMB: number = 5
): { isValid: boolean; error?: string } => {
  const maxSizeBytes = getMaxFileSize(maxSizeMB);

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size (${formatFileSize(
        file.size
      )}) exceeds the maximum limit of ${maxSizeMB}MB`,
    };
  }

  return { isValid: true };
};
