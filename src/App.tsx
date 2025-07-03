import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Call from "./pages/Call";
import DoctorReports from "./pages/DoctorReports";
import ReportDetail from "./pages/ReportDetail";
import PatientTimeline from "./components/reportComponents/PatientTimeline";
import Footer from "./components/mainComponents/Footer";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 App">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/call/:id" element={<Call />} />
              <Route path="/report/:doctorID" element={<DoctorReports />} />
              <Route
                path="/report/:doctorID/:reportID"
                element={<ReportDetail />}
              />
              <Route
                path="/report/:doctorID/:personID/timeline"
                element={<PatientTimeline />}
              />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
