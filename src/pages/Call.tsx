import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import CallNavbar from "../components/callComponents/CallNavbar";
import CallVideo from "../components/callComponents/CallVideo";
import CallSidebar from "../components/callComponents/CallSidebar";
import { useEffect } from "react";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.13,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Call = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id);

  const heygenToken = import.meta.env.VITE_HEYGEN_TOKEN;
  const heygenAvatarId = "Dexter_Doctor_Standing2_public";
  const heygenVoiceId = "";

  useEffect(() => {
    // Resume AudioContext on first user gesture to allow HeyGen audio playback
    const resumeAudio = () => {
      try {
        if (window.AudioContext) {
          const ctx = new window.AudioContext();
          ctx.resume();
        }
      } catch {}
      window.removeEventListener("click", resumeAudio);
      window.removeEventListener("touchstart", resumeAudio);
    };
    window.addEventListener("click", resumeAudio);
    window.addEventListener("touchstart", resumeAudio);
    return () => {
      window.removeEventListener("click", resumeAudio);
      window.removeEventListener("touchstart", resumeAudio);
    };
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="flex flex-col min-h-[80vh] w-full mx-auto gap-6"
    >
      <motion.div variants={childVariants}>
        <CallNavbar />
      </motion.div>
      <div className="flex-1 flex gap-6 rounded-3xl">
        <motion.div
          variants={childVariants}
          className="flex-1 flex items-center justify-center w-full h-full rounded-3xl"
        >
          <CallVideo
            heygenToken={heygenToken}
            heygenAvatarId={heygenAvatarId}
            heygenVoiceId={heygenVoiceId}
            // exposeSpeakFn={(fn) => {
            //   (window as any).speakWithHeyGen = fn;
            //   fn("Hello from Call.tsx!");
            // }}
          />
        </motion.div>
        <motion.div variants={childVariants}>
          <CallSidebar />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Call;
