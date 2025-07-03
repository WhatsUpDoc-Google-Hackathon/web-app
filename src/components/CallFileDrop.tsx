import { useRef, useState } from "react";
import {
  AiOutlineCloudUpload,
  AiOutlineFile,
  AiOutlineFilePdf,
  AiOutlineFileImage,
  AiOutlineFileWord,
  AiOutlineFileExcel,
  AiOutlineFileZip,
  AiOutlineClose,
} from "react-icons/ai";

const getFileIcon = (file: File) => {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext) return <AiOutlineFile className="text-accent text-xl" />;
  if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(ext))
    return <AiOutlineFileImage className="text-blue-400 text-xl" />;
  if (["pdf"].includes(ext))
    return <AiOutlineFilePdf className="text-red-400 text-xl" />;
  if (["doc", "docx"].includes(ext))
    return <AiOutlineFileWord className="text-blue-600 text-xl" />;
  if (["xls", "xlsx", "csv"].includes(ext))
    return <AiOutlineFileExcel className="text-green-600 text-xl" />;
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
    return <AiOutlineFileZip className="text-yellow-500 text-xl" />;
  return <AiOutlineFile className="text-accent text-xl" />;
};

const CallFileDrop = () => {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = e.dataTransfer.files
        ? Array.from(e.dataTransfer.files)
        : [];
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div
      className="rounded-2xl bg-white p-6 shadow-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer mb-2 min-h-[120px] w-full"
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
      {files.length === 0 ? (
        <>
          <AiOutlineCloudUpload className="text-accent text-4xl mb-2" />
          <span className="text-[var(--color-text)] text-base font-medium mb-1">
            Drop files here or click to upload
          </span>
        </>
      ) : (
        <div className="w-full">
          <span className="text-xs text-accent font-semibold">
            Selected file{files.length > 1 ? "s" : ""}:
          </span>
          <ul className="mt-2 space-y-2">
            {files.map((file, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 bg-[var(--color-bg-secondary)] rounded-lg px-3 py-2"
              >
                {getFileIcon(file)}
                <span className="flex-1 text-xs text-[var(--color-text)] truncate">
                  {file.name}
                </span>
                <button
                  className="ml-2 p-1 rounded-full hover:bg-red-500/30 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  title="Remove file"
                  type="button"
                >
                  <AiOutlineClose className="text-red-400 text-lg" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CallFileDrop;
