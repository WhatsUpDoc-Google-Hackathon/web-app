import { motion } from "framer-motion";
import { FiHome, FiSearch, FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/mainComponents/AnimatedBackground";

const NotFound = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* 404 Content */}
      <motion.div
        className="container mx-auto px-6 py-16 relative z-10 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* 404 Icon and Number */}
        <motion.div className="mb-12" variants={itemVariants}>
          <motion.div
            className="relative inline-block mb-8"
            variants={pulseVariants}
            animate="animate"
          >
            <div className="w-32 h-32 mx-auto bg-blue-100/80 backdrop-blur-lg rounded-full flex items-center justify-center border border-blue-200/50">
              <FiAlertCircle className="w-16 h-16 text-blue-600" />
            </div>
          </motion.div>

          <motion.h1
            className="text-8xl md:text-9xl font-bold text-blue-600 mb-4 leading-none"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              type: "spring",
              stiffness: 200,
            }}
          >
            404
          </motion.h1>
        </motion.div>

        {/* Error Message */}
        <motion.div className="mb-12" variants={itemVariants}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Page
            <span className="block text-blue-600">Not Found</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The page you're looking for seems to have disappeared from our
            medical system. It may have been moved, deleted, or the URL is
            incorrect.
          </p>
        </motion.div>

        {/* Action Cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12"
          variants={itemVariants}
        >
          {/* Home Card */}
          <motion.button
            onClick={() => navigate("/")}
            className="group block w-full"
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 hover:shadow-2xl hover:bg-white/95 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <FiHome className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Back to Home
              </h3>
              <p className="text-gray-600 text-sm">
                Return to the main page to access consultations
              </p>
            </div>
          </motion.button>

          {/* Reports Card */}
          <motion.button
            onClick={() => navigate("/report/1")}
            className="group block w-full"
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 hover:shadow-2xl hover:bg-white/95 transition-all duration-300">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <FiSearch className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Browse Reports
              </h3>
              <p className="text-gray-600 text-sm">
                Explore available pre-diagnostic reports
              </p>
            </div>
          </motion.button>
        </motion.div>

        {/* Help Text */}
        <motion.div className="text-center" variants={itemVariants}>
          <p className="text-gray-500 text-sm mb-4">
            If you think this is an error, please contact our support team.
          </p>

          {/* Floating Elements */}
          <div className="relative">
            <motion.div
              className="absolute -top-10 left-1/4 w-3 h-3 bg-blue-400 rounded-full opacity-60"
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute -top-6 right-1/3 w-2 h-2 bg-green-400 rounded-full opacity-50"
              animate={{
                y: [10, -10, 10],
                x: [-5, 5, -5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 1,
              }}
            />
            <motion.div
              className="absolute -bottom-4 left-1/3 w-4 h-4 bg-purple-400 rounded-full opacity-40"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: 0.5,
              }}
            />
          </div>

          <motion.p
            className="text-gray-400 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Powered by{" "}
            <a
              href="https://deepmind.google/models/gemma/medgemma/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              MedGemma
            </a>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
