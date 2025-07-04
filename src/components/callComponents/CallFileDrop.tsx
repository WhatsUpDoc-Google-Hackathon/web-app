import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AiOutlineCloudUpload, AiOutlineClose } from "react-icons/ai";
import { useFileUpload } from "../../api/upload";
import {
  getFileIcon,
  formatFileSize,
  validateFileSize,
} from "../../utils/fileUtils";
import FileUploadProgress from "./FileUploadProgress";

const CallFileDrop = () => {
  const { id: callId } = useParams<{ id: string }>();
  const [validationErrors, setValidationErrors] = useState<{
    [fileName: string]: string;
  }>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    fileStates,
    allCompleted,
    uploadFiles,
    removeFile,
    retryFile,
    clearAll,
    getCompletedCount,
    getErrorCount,
  } = useFileUpload({
    userId: callId,
    onFileComplete: (index, response) => {
      console.log(`File ${index} uploaded successfully:`, response);
    },
    onFileError: (index, error) => {
      console.error(`File ${index} upload failed:`, error);
    },
    onAllFilesComplete: (results) => {
      console.log("All uploads completed:", results);
    },
  });

  const validateAndUploadFiles = async (files: File[]) => {
    const errors: { [fileName: string]: string } = {};
    const validFiles: File[] = [];

    // Validate each file
    files.forEach((file) => {
      const validation = validateFileSize(file, 5); // 5MB limit
      if (!validation.isValid) {
        errors[file.name] = validation.error!;
      } else {
        validFiles.push(file);
      }
    });

    // Update validation errors
    setValidationErrors((prev) => ({ ...prev, ...errors }));

    // Upload valid files immediately
    if (validFiles.length > 0) {
      await uploadFiles(validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      validateAndUploadFiles(droppedFiles);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      validateAndUploadFiles(newFiles);
    }
  };

  const clearValidationError = (fileName: string) => {
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fileName];
      return newErrors;
    });
  };

  const handleRemoveUploadedFile = (idx: number) => {
    removeFile(idx);
  };

  const handleRetryFile = (idx: number) => {
    retryFile(idx);
  };

  const completedCount = getCompletedCount();
  const errorCount = getErrorCount();
  const validationErrorCount = Object.keys(validationErrors).length;

  return (
    <div className="w-full space-y-3">
      {/* File Drop Zone */}
      <div
        className="rounded-xl md:rounded-2xl bg-white p-4 md:p-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer min-h-[100px] md:min-h-[120px] w-full"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          onChange={handleChange}
        />
        <AiOutlineCloudUpload className="text-accent text-3xl md:text-4xl mb-2" />
        <span className="text-[var(--color-text)] text-sm md:text-base font-medium mb-1 text-center">
          <span className="hidden sm:inline">
            Drop files here or click to upload automatically
          </span>
          <span className="sm:hidden">Tap to upload files automatically</span>
        </span>
        <span className="text-xs text-gray-500 text-center">
          Maximum file size: 5MB
        </span>

        {/* Upload Summary */}
        {(fileStates.length > 0 || validationErrorCount > 0) && (
          <div className="text-xs text-gray-500 mt-2 text-center">
            {fileStates.length > 0 &&
              `${fileStates.length} file${
                fileStates.length > 1 ? "s" : ""
              } processing`}
            {completedCount > 0 && ` • ${completedCount} uploaded`}
            {errorCount > 0 && ` • ${errorCount} failed`}
            {validationErrorCount > 0 && ` • ${validationErrorCount} rejected`}
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {validationErrorCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-red-700">
              Files Rejected ({validationErrorCount})
            </span>
            <button
              onClick={() => setValidationErrors({})}
              className="text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              Clear All
            </button>
          </div>

          <ul className="space-y-2">
            {Object.entries(validationErrors).map(([fileName, error]) => (
              <li
                key={fileName}
                className="flex items-start gap-2 md:gap-3 bg-white rounded-lg px-2 md:px-3 py-2 border border-red-200"
              >
                <AiOutlineClose className="text-red-500 text-lg mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-900 truncate font-medium">
                    {fileName}
                  </div>
                  <div className="text-xs text-red-600 mt-1">{error}</div>
                </div>
                <button
                  className="ml-1 md:ml-2 p-1 rounded-full hover:bg-red-500/30 transition-colors cursor-pointer"
                  onClick={() => clearValidationError(fileName)}
                  title="Dismiss error"
                  type="button"
                >
                  <AiOutlineClose className="text-red-400 text-base md:text-lg" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Uploading/Uploaded Files */}
      {fileStates.length > 0 && (
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-accent">
              Upload Progress ({fileStates.length})
            </span>
            {allCompleted && (
              <button
                onClick={clearAll}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <ul className="space-y-3">
            {fileStates.map((fileState, idx) => (
              <li
                key={idx}
                className="bg-[var(--color-bg-secondary)] rounded-lg px-2 md:px-3 py-2"
              >
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  {getFileIcon(fileState.file)}
                  <span className="flex-1 text-xs text-[var(--color-text)] truncate">
                    {fileState.file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(fileState.file.size)}
                  </span>
                  <button
                    className="ml-1 md:ml-2 p-1 rounded-full hover:bg-red-500/30 transition-colors cursor-pointer"
                    onClick={() => handleRemoveUploadedFile(idx)}
                    title="Remove file"
                    type="button"
                  >
                    <AiOutlineClose className="text-red-400 text-base md:text-lg" />
                  </button>
                </div>

                <FileUploadProgress
                  progress={fileState.progress}
                  status={fileState.status}
                  error={fileState.error}
                  onRetry={() => handleRetryFile(idx)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CallFileDrop;
