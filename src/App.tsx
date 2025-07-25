import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Call from "./pages/Call";
import DoctorReports from "./pages/DoctorReports";
import ReportDetail from "./pages/ReportDetail";
import NotFound from "./pages/NotFound";
import Footer from "./components/mainComponents/Footer";
import "./App.css";
import { StreamingAvatarProvider } from "./heygen/StreamingAvatarContext";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 App px-2 md:px-4 py-2 md:py-4">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/call/:user_id"
                element={
                  <StreamingAvatarProvider>
                    <Call />
                  </StreamingAvatarProvider>
                }
              />
              <Route path="/report/:doctorID" element={<DoctorReports />} />
              <Route
                path="/report/:doctorID/:reportID"
                element={<ReportDetail />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
