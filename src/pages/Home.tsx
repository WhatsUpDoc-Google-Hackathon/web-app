import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="home-container flex flex-col items-center justify-center"
    >
      <h1 className="text-xl font-bold">Welcome to Home</h1>
      <p className="text-sm underline">
        This is the home page of your application.
      </p>
      <div className="flex gap-4 mt-6">
        <a
          href="/call/1"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Go to Call
        </a>
        <a
          href="/report/1"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Go to Report
        </a>
      </div>
    </motion.div>
  );
};

export default Home;
