import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import CallNavbar from "../components/CallNavbar";
import CallVideo from "../components/CallVideo";
import CallSidebar from "../components/CallSidebar";

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
      <div className="flex-1 flex gap-6">
        <motion.div
          variants={childVariants}
          className="flex-1 flex items-center justify-center w-full h-full"
        >
          <CallVideo />
        </motion.div>
        <motion.div variants={childVariants}>
          <CallSidebar />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Call;
