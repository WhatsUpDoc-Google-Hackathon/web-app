import { useState, useCallback } from "react";
import {
  UploadService,
  type UploadProgress,
  type UploadResponse,
} from "./uploadService";

export interface FileUploadState {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  response?: UploadResponse;
  error?: string;
}

export interface UseFileUploadOptions {
  sessionId?: string;
  userId?: string;
  onFileComplete?: (fileIndex: number, response: UploadResponse) => void;
  onFileError?: (fileIndex: number, error: Error) => void;
  onAllFilesComplete?: (results: (UploadResponse | Error)[]) => void;
}

export interface UseFileUploadReturn {
  fileStates: FileUploadState[];
  isUploading: boolean;
  allCompleted: boolean;
  hasErrors: boolean;
  uploadFiles: (files: File[]) => Promise<void>;
  removeFile: (index: number) => void;
  retryFile: (index: number) => Promise<void>;
  clearAll: () => void;
  getCompletedCount: () => number;
  getErrorCount: () => number;
}

export const useFileUpload = (
  options: UseFileUploadOptions = {}
): UseFileUploadReturn => {
  const { sessionId, userId, onFileComplete, onFileError, onAllFilesComplete } =
    options;

  const [fileStates, setFileStates] = useState<FileUploadState[]>([]);

  // Helper to get session and user IDs
  const getSessionId = useCallback(() => {
    if (sessionId) return sessionId;
    // Fallback to generating a temporary session ID
    return `temp_session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }, [sessionId]);

  const getUserId = useCallback(() => {
    if (userId) return userId;
    // Fallback to extracting from URL or generating a temporary user ID
    const urlPath = window.location.pathname;
    const pathParts = urlPath.split("/");
    const callIndex = pathParts.indexOf("call");
    if (callIndex !== -1 && pathParts.length > callIndex + 1) {
      return pathParts[callIndex + 1] || `temp_user_${Date.now()}`;
    }
    return `temp_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, [userId]);

  // Initialize files for upload
  const initializeFiles = useCallback((files: File[]) => {
    const newFileStates: FileUploadState[] = files.map((file) => ({
      file,
      progress: 0,
      status: "pending" as const,
    }));
    setFileStates(newFileStates);
  }, []);

  // Update progress for a specific file
  const updateFileProgress = useCallback(
    (index: number, progress: UploadProgress) => {
      setFileStates((prev) =>
        prev.map((fileState, i) =>
          i === index
            ? {
                ...fileState,
                progress: progress.percentage,
                status: "uploading" as const,
              }
            : fileState
        )
      );
    },
    []
  );

  // Mark file as completed
  const markFileCompleted = useCallback(
    (index: number, response: UploadResponse) => {
      setFileStates((prev) =>
        prev.map((fileState, i) =>
          i === index
            ? {
                ...fileState,
                status: "completed" as const,
                response,
                progress: 100,
              }
            : fileState
        )
      );
      onFileComplete?.(index, response);
    },
    [onFileComplete]
  );

  // Mark file as error
  const markFileError = useCallback(
    (index: number, error: Error) => {
      setFileStates((prev) =>
        prev.map((fileState, i) =>
          i === index
            ? {
                ...fileState,
                status: "error" as const,
                error: error.message,
                progress: 0,
              }
            : fileState
        )
      );
      onFileError?.(index, error);
    },
    [onFileError]
  );

  // Upload all files
  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      initializeFiles(files);

      try {
        const results = await UploadService.uploadMultipleFiles(
          files,
          getSessionId(),
          getUserId(),
          updateFileProgress,
          markFileCompleted,
          markFileError
        );

        onAllFilesComplete?.(results);
      } catch (error) {
        console.error("Upload error:", error);
      }
    },
    [
      initializeFiles,
      getSessionId,
      getUserId,
      updateFileProgress,
      markFileCompleted,
      markFileError,
      onAllFilesComplete,
    ]
  );

  // Remove a file from the list
  const removeFile = useCallback((index: number) => {
    setFileStates((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Retry uploading a specific file
  const retryFile = useCallback(
    async (index: number) => {
      const fileState = fileStates[index];
      if (!fileState || fileState.status === "uploading") return;

      // Reset file state
      setFileStates((prev) =>
        prev.map((state, i) =>
          i === index
            ? {
                ...state,
                progress: 0,
                status: "pending" as const,
                error: undefined,
              }
            : state
        )
      );

      try {
        const response = await UploadService.uploadFile(
          fileState.file,
          getSessionId(),
          getUserId(),
          (progress) => updateFileProgress(index, progress)
        );
        markFileCompleted(index, response);
      } catch (error) {
        markFileError(index, error as Error);
      }
    },
    [
      fileStates,
      getSessionId,
      getUserId,
      updateFileProgress,
      markFileCompleted,
      markFileError,
    ]
  );

  // Clear all files
  const clearAll = useCallback(() => {
    setFileStates([]);
  }, []);

  // Computed values
  const isUploading = fileStates.some((state) => state.status === "uploading");
  const allCompleted =
    fileStates.length > 0 &&
    fileStates.every((state) => state.status === "completed");
  const hasErrors = fileStates.some((state) => state.status === "error");

  const getCompletedCount = useCallback(
    () => fileStates.filter((state) => state.status === "completed").length,
    [fileStates]
  );

  const getErrorCount = useCallback(
    () => fileStates.filter((state) => state.status === "error").length,
    [fileStates]
  );

  return {
    fileStates,
    isUploading,
    allCompleted,
    hasErrors,
    uploadFiles,
    removeFile,
    retryFile,
    clearAll,
    getCompletedCount,
    getErrorCount,
  };
};
