// Base URL for the backend API - can be configured via environment variable
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export interface UploadPayload {
  session_id: string;
  user_id: string;
  filename: string;
  content_base64: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResponse {
  success: boolean;
  message?: string;
  file_id?: string;
  url?: string;
}

export class UploadService {
  /**
   * Convert File to base64 string
   */
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:mime/type;base64, prefix
        const base64Parts = result.split(",");
        if (base64Parts.length !== 2 || !base64Parts[1]) {
          reject(new Error("Invalid file format"));
          return;
        }
        resolve(base64Parts[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload a single file with progress tracking
   */
  static async uploadFile(
    file: File,
    sessionId: string,
    userId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    try {
      // Convert file to base64
      const content_base64 = await this.fileToBase64(file);

      const payload: UploadPayload = {
        session_id: sessionId,
        user_id: userId,
        filename: file.name,
        content_base64,
      };

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable && onProgress) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            };
            onProgress(progress);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response: UploadResponse = JSON.parse(xhr.responseText);
              resolve(response);
            } catch {
              resolve({
                success: true,
                message: "File uploaded successfully",
              });
            }
          } else {
            reject(
              new Error(
                `Upload failed with status ${xhr.status}: ${xhr.statusText}`
              )
            );
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Network error during upload"));
        });

        xhr.addEventListener("timeout", () => {
          reject(new Error("Upload timeout"));
        });

        xhr.open("POST", `${API_BASE_URL}/upload`);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.timeout = 60000; // 60 second timeout

        xhr.send(JSON.stringify(payload));
      });
    } catch (error) {
      throw new Error(
        `Failed to process file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Upload multiple files with individual progress tracking
   */
  static async uploadMultipleFiles(
    files: File[],
    sessionId: string,
    userId: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void,
    onFileComplete?: (fileIndex: number, response: UploadResponse) => void,
    onFileError?: (fileIndex: number, error: Error) => void
  ): Promise<(UploadResponse | Error)[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadFile(file, sessionId, userId, (progress) =>
        onProgress?.(index, progress)
      )
        .then((response) => {
          onFileComplete?.(index, response);
          return response;
        })
        .catch((error) => {
          onFileError?.(index, error);
          return error;
        })
    );

    return Promise.all(uploadPromises);
  }
}
