import { motion } from "framer-motion";
import CallNavbar from "../components/callComponents/CallNavbar";
import CallVideo from "../components/callComponents/CallVideo";
import CallSidebar from "../components/callComponents/CallSidebar";
import { useStreamingAvatar } from "../heygen/StreamingAvatarContext";
import { childVariants, containerVariants } from "../animations/callAnimations";
import { useState, useRef, useEffect } from "react";
import { HiChatBubbleLeftRight, HiMicrophone, HiStop } from "react-icons/hi2";
import { IoSend } from "react-icons/io5";
import { AudioTranscription } from "../sst_streamer/audioTranscription";

const Call = () => {
  const { speakText, isReady } = useStreamingAvatar();
  const [centerMessage, setCenterMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState("");
  const audioTranscriptionRef = useRef<AudioTranscription | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioTranscriptionRef.current) {
        audioTranscriptionRef.current.stopTranscription();
      }
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      setTranscriptionText("");

      // Get environment variables with fallbacks
      const sttUrl = import.meta.env.VITE_SST_URL || 'ws://127.0.0.1:8080';
      const sttApiKey = import.meta.env.VITE_STT_API_KEY || 'public_token';

      console.log('Starting transcription with URL:', sttUrl);

      audioTranscriptionRef.current = new AudioTranscription(
        sttUrl,
        sttApiKey,
        false,
        (text: string) => {
          setTranscriptionText(prev => prev + text + " ");
          setCenterMessage(prev => prev + text + " ");
        },
        () => {
          console.log("Speech pause detected");
        },
        (error: string) => {
          console.error("Transcription error:", error);
          setIsRecording(false);
        }
      );

      await audioTranscriptionRef.current.startTranscription();
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to start recording: ${errorMessage}`);
    }
  };

  const handleStopRecording = () => {
    if (audioTranscriptionRef.current) {
      audioTranscriptionRef.current.stopTranscription();
      audioTranscriptionRef.current = null;
    }
    setIsRecording(false);
  };

  const handleSendMessage = () => {
    if (centerMessage.trim() && isReady) {
      speakText(centerMessage);
      setCenterMessage("");
      setTranscriptionText("");
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="flex flex-col w-full mx-auto gap-3 md:gap-4 px-2 md:px-4 py-2 md:py-4"
    >
      <motion.div variants={childVariants}>
        <CallNavbar />
      </motion.div>

      {/* Main content area - flex column on mobile, row on larger screens */}
      <div className="flex flex-col lg:flex-row gap-3 md:gap-6">
        {/* Left column - Video and Input */}
        <div className="flex flex-col gap-3 md:gap-4 lg:flex-1">
          <motion.div
            variants={childVariants}
            className="flex items-center justify-center w-full rounded-3xl"
          >
            <CallVideo />
          </motion.div>

          {/* Text input right below video */}
          <motion.div
            variants={childVariants}
            className="flex justify-center items-center w-full"
          >
            <div className="flex flex-col gap-3 w-full max-w-4xl">
              {/* Voice recording indicator */}
              {isRecording && (
                <div className="flex items-center justify-center gap-2 text-red-500 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Recording... Speak now
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <input
                    ref={(input) => {
                      if (input && !isRecording) input.focus();
                    }}
                    type="text"
                    placeholder={isRecording ? "Listening..." : "Send a message to your virtual assistant..."}
                    className="w-full px-4 md:px-6 py-3 md:py-4 pr-10 md:pr-12 rounded-xl md:rounded-2xl border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm md:text-base bg-white/95 backdrop-blur-sm placeholder-gray-500 transition-all duration-200 hover:shadow-xl"
                    value={centerMessage}
                    onChange={(e) => setCenterMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && centerMessage.trim() && isReady) {
                        handleSendMessage();
                      }
                    }}
                    disabled={isRecording}
                  />
                  <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2">
                    <HiChatBubbleLeftRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* Voice recording button */}
                  <button
                    className={`px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 min-w-[60px] flex items-center justify-center gap-2 ${isRecording
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    type="button"
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                  >
                    {isRecording ? (
                      <HiStop className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <HiMicrophone className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </button>

                  {/* Send button */}
                  <button
                    className="px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-accent to-accent/80 text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] flex items-center justify-center gap-2"
                    type="button"
                    disabled={!centerMessage.trim() || !isReady || isRecording}
                    onClick={handleSendMessage}
                  >
                    <IoSend className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar - full width on mobile, fixed width on larger screens */}
        <motion.div
          variants={childVariants}
          className="w-full lg:w-[340px] xl:w-[380px] lg:flex-shrink-0"
        >
          <CallSidebar />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Call;