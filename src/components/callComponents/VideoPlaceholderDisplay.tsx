import { motion } from "framer-motion";

type Props = {
  isImageLoaded: boolean;
  setIsImageLoaded: (loaded: boolean) => void;
  VideoPlaceholder: string;
};

const VideoPlaceholderDisplay = ({
  isImageLoaded,
  setIsImageLoaded,
  VideoPlaceholder,
}: Props) => (
  <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-secondary)] rounded-2xl relative overflow-hidden">
    {/* Skeleton shimmer animation */}
    {!isImageLoaded && (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 w-full h-full flex items-center justify-center z-1"
      >
        <div className="w-full h-full rounded-2xl bg-gray-200 relative overflow-hidden">
          <div
            className="absolute inset-0 animate-shimmer bg-gradient-to-r from-blue-100 via-gray-100 to-blue-100 opacity-80"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>
      </motion.div>
    )}
    {/* Video image */}
    <motion.img
      src={VideoPlaceholder}
      alt="Video Stream"
      className="w-full h-full object-cover rounded-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: isImageLoaded ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      onLoad={() => setIsImageLoaded(true)}
      style={{ position: "absolute", inset: 0 }}
    />
  </div>
);

export default VideoPlaceholderDisplay;
