import { motion } from "framer-motion";
import {
  FiPhone,
  FiFileText,
  FiArrowRight,
  FiActivity,
  FiUsers,
  FiClock,
} from "react-icons/fi";
import { MdMedicalServices, MdPriorityHigh } from "react-icons/md";
import QRCode from "react-qr-code";
import AnimatedBackground from "../components/mainComponents/AnimatedBackground";

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* QR Code - Top Left */}
      <motion.div
        className="absolute top-6 left-6 z-20 hidden md:block"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          className="group block bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 shadow-lg hover:shadow-xl hover:bg-white/95 transition-all duration-300"
          whileHover={{
            scale: 2.5,
            x: 50,
            y: 50,
            zIndex: 50,
          }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.2,
          }}
          style={{ transformOrigin: "top left" }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-20 h-20 bg-white/80 rounded-lg p-1 shadow-inner">
              <QRCode
                value={window.location.origin}
                size={72}
                title="Website QR Code"
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox="0 0 256 256"
              />
            </div>
            <span className="text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
              Try me!
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Google Healthcare Hackathon Badge */}
      <motion.div
        className="absolute top-6 right-6 z-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.a
          href="https://gdg.community.dev/events/details/google-gdg-paris-presents-solve-for-healthcare-amp-life-sciences-with-gemma-hackathon-1/"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-full px-4 py-2 shadow-lg hover:shadow-xl hover:bg-white/95 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="font-medium">Google Healthcare Hackathon</span>
          </div>
        </motion.a>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        className="container mx-auto px-6 py-16 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.div
            className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-lg text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200/50"
            whileHover={{ scale: 1.05 }}
          >
            <MdMedicalServices className="w-4 h-4" />
            Medical Intelligence
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Intelligent
            <span className="block text-blue-600">Pre-diagnosis</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            An automated pre-diagnosis tool and patient scheduling
            prioritization system based on urgency assessment, powered by{" "}
            <a
              href="https://deepmind.google/models/gemma/medgemma/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              MedGemma
            </a>{" "}
            AI agent that analyzes pre-diagnostic results.
          </p>
        </motion.div>

        {/* Feature Icons */}
        <motion.div
          className="flex justify-center gap-8 mb-16"
          variants={itemVariants}
        >
          <motion.div
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-3">
              <FiActivity className="w-8 h-8 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600 font-medium">Diagnosis</span>
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
          >
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-3">
              <MdPriorityHigh className="w-8 h-8 text-green-600" />
            </div>
            <span className="text-sm text-gray-600 font-medium">
              Prioritization
            </span>
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
          >
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-3">
              <FiUsers className="w-8 h-8 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600 font-medium">Patients</span>
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
          >
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-3">
              <FiClock className="w-8 h-8 text-orange-600" />
            </div>
            <span className="text-sm text-gray-600 font-medium">Urgency</span>
          </motion.div>
        </motion.div>

        {/* Navigation Cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          variants={itemVariants}
        >
          {/* Call Card */}
          <motion.a
            href="/call/1"
            className="group block"
            variants={cardHoverVariants}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl hover:bg-white/95 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <FiPhone className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  <FiArrowRight className="w-6 h-6 text-blue-600" />
                </motion.div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Consultation
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Start a pre-diagnostic session with the{" "}
                <a
                  href="https://deepmind.google/models/gemma/medgemma/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  MedGemma
                </a>{" "}
                AI agent. Interactive interface to collect symptoms and generate
                preliminary assessments.
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                Start consultation
                <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.a>

          {/* Report Card */}
          <motion.a
            href="/report/1"
            className="group block"
            variants={cardHoverVariants}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl hover:bg-white/95 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center">
                  <FiFileText className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  <FiArrowRight className="w-6 h-6 text-green-600" />
                </motion.div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Patient Reports
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Visualize automatic prioritization and AI recommendations to
                optimize patient care. Access medical insights and track patient
                progress over time.
              </p>
              <div className="flex items-center text-green-600 font-medium">
                View reports
                <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.a>
        </motion.div>

        {/* Team Section */}
        <motion.div className="mt-24 mb-16" variants={itemVariants}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              <span className="font-semibold text-blue-600">EPITA</span>{" "}
              students united to revolutionize medical diagnosis through
              artificial intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Armand Blin",
                linkedin: "https://www.linkedin.com/in/armandblin/",
                image: "/team/blin.jpeg",
              },
              {
                name: "Arthur Courselle",
                linkedin: "https://www.linkedin.com/in/arthur-courselle/",
                image: "/team/courselle.jpeg",
              },
              {
                name: "Aurélien Daudin",
                linkedin: "https://www.linkedin.com/in/aurelien-daudin/",
                image: "/team/daudin.jpeg",
              },
              {
                name: "Khaled Mili",
                linkedin: "https://www.linkedin.com/in/khaled-mili/",
                image: "/team/mili.jpeg",
              },
              {
                name: "Lucas Duport",
                linkedin: "https://www.linkedin.com/in/lucas-duport/",
                image: "/team/duport.jpeg",
              },
              {
                name: "Samy Yacef",
                linkedin: "https://www.linkedin.com/in/samy-yacef-b88543146/",
                image: "/team/yacef.jpeg",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                className="hover:backdrop-blur-xl rounded-2xl p-6  border-2 border-transparent hover:border-gray-200/50 hover:shadow-xl hover:bg-white/95 transition-all duration-300 text-center"
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {member.name}
                </h3>
                <motion.a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </motion.a>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievement & Acknowledgments Section */}
        <motion.div className="mt-24 mb-16" variants={itemVariants}>
          <div className="max-w-4xl mx-auto">
            {/* Achievement Banner */}
            <motion.a
              href="https://gdg.community.dev/events/details/google-gdg-paris-presents-solve-for-healthcare-amp-life-sciences-with-gemma-hackathon-1/"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-r from-yellow-50 to-orange-50 backdrop-blur-xl rounded-3xl p-8 mb-8 shadow-xl border border-yellow-200/50 relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200/20 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10 text-center">
                <motion.div
                  className="inline-flex items-center gap-2 bg-yellow-100/80 backdrop-blur-lg text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-yellow-200/50"
                  whileHover={{ scale: 1.05 }}
                >
                  🏆 Achievement
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Top 10 Finalists
                </h2>

                <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-6">
                  We're proud to announce that our team finished in the{" "}
                  <span className="font-bold text-yellow-700">
                    top 10 out of 26 teams
                  </span>{" "}
                  at the Google Healthcare Hackathon, and we're the{" "}
                  <span className="font-bold text-yellow-700">
                    only selected student team
                  </span>{" "}
                  among the finalists!
                </p>

                <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">10</span>
                    </div>
                    <span>Top 10 / 26</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <FiUsers className="w-4 h-4 text-white" />
                    </div>
                    <span>Only Student Team</span>
                  </div>
                </div>
              </div>
            </motion.a>

            {/* Thanks Section */}
            <motion.div
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl hover:bg-white/95 transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="text-center">
                <motion.div
                  className="inline-flex items-center gap-2 bg-purple-100/80 backdrop-blur-lg text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-purple-200/50"
                  whileHover={{ scale: 1.05 }}
                >
                  💜 Special Thanks
                </motion.div>

                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Thank You, HeyGen!
                </h3>

                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
                  We extend our heartfelt gratitude to{" "}
                  <motion.a
                    href="https://www.heygen.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 transition-colors font-semibold"
                    whileHover={{ scale: 1.05 }}
                  >
                    HeyGen
                  </motion.a>{" "}
                  for providing free access to their powerful AI avatar API,
                  enabling us to create immersive and interactive consultation
                  experiences for our patients.
                </p>

                <motion.div
                  className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  Visit HeyGen
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Open Source & Technical Section */}
        <motion.div className="mt-16 mb-16" variants={itemVariants}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <motion.div
                className="inline-flex items-center gap-2 bg-gray-100/80 backdrop-blur-lg text-gray-800 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-gray-200/50"
                whileHover={{ scale: 1.05 }}
              >
                🔧 Technical Implementation
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Explore Our Work
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Dive into our open-source codebase and fine-tuned AI model
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* GitHub Repository Card */}
              <motion.a
                href="https://github.com/WhatsUpDoc-Google-Hackathon"
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl hover:bg-white/95 transition-all duration-300"
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                  >
                    <FiArrowRight className="w-6 h-6 text-gray-900" />
                  </motion.div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  GitHub Repository
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Explore our complete open-source codebase including the React
                  frontend, Python backend, and all project documentation from
                  the hackathon.
                </p>
                <div className="flex items-center text-gray-900 font-medium">
                  View on GitHub
                  <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.a>

              {/* Hugging Face Model Card */}
              <motion.a
                href="https://huggingface.co/acours/medgemma-4b-it-sft-lora-cardiovascular-disease"
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl hover:bg-white/95 transition-all duration-300"
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                  >
                    <FiArrowRight className="w-6 h-6 text-orange-600" />
                  </motion.div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Fine-tuned AI Model
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Access our specialized MedGemma-4B model fine-tuned for
                  cardiovascular disease diagnosis, available on Hugging Face
                  for research and development.
                </p>
                <div className="flex items-center text-orange-600 font-medium">
                  Try on Hugging Face
                  <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div className="text-center mt-16" variants={itemVariants}>
          <p className="text-gray-500 text-sm">
            Powered by{" "}
            <a
              href="https://deepmind.google/models/gemma/medgemma/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              MedGemma
            </a>{" "}
            artificial intelligence
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
