import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import DoctorNavbar from "../components/reportComponents/DoctorNavbar";
import SearchBar from "../components/reportComponents/SearchBar";
import PatientRow from "../components/reportComponents/PatientRow";
import { PatientService } from "../api/patients";
import type { PatientWithLatestReport } from "../api/patients";

// Transform API data to match component expectations
interface PatientRowData {
  id: string;
  name: string;
  age: number;
  gender: string;
  healthStatus: string;
  latestReport: {
    id: string;
    date: string;
    summary: string;
  };
}

const DoctorReports = () => {
  const { doctorID } = useParams<{ doctorID: string }>();
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<PatientRowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch patients data on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiPatients =
          await PatientService.getAllPatientsWithLatestReports();

        // Transform API data to match component expectations
        const transformedPatients: PatientRowData[] = apiPatients.map(
          (patient: PatientWithLatestReport) => ({
            id: patient.patient_id,
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            healthStatus: patient.health_status || "Unknown",
            latestReport: {
              id: patient.report_id || "",
              date: patient.report_date || "",
              summary: patient.summary || "No report available",
            },
          })
        );

        setPatients(transformedPatients);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch patients"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full min-h-full p-0 m-0"
      >
        <div className="w-full">
          <div className="w-full">
            <DoctorNavbar />
          </div>
        </div>
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading patients...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full min-h-full p-0 m-0"
      >
        <div className="w-full">
          <div className="w-full">
            <DoctorNavbar />
          </div>
        </div>
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">
              Error Loading Patients
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-full p-0 m-0"
    >
      <div className="w-full">
        <div className="w-full">
          <DoctorNavbar />
        </div>
      </div>
      <SearchBar value={search} onChange={setSearch} />
      <div className="overflow-x-auto w-full px-2 md:px-4 lg:px-0">
        <div className="min-w-[800px]">
          <table className="w-full divide-y divide-gray-200 bg-white rounded-lg md:rounded-xl shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Patient",
                  "👤 Age & Gender",
                  "Latest Report Date",
                  "Summary",
                  "⚠️ Health Status",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-3 md:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
                <th className="px-3 md:px-4 lg:px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-gray-500 py-8 text-sm md:text-base"
                  >
                    {search
                      ? "No patients found matching your search."
                      : "No patients found."}
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient, index) => (
                  <PatientRow
                    key={patient.id}
                    patient={patient}
                    doctorID={doctorID}
                    isOdd={index % 2 === 1}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorReports;
