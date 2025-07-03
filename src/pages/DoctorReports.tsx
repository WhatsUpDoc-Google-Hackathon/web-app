import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import DoctorNavbar from "../components/reportComponents/DoctorNavbar";
import SearchBar from "../components/reportComponents/SearchBar";
import PatientRow from "../components/reportComponents/PatientRow";

// Mock data
const mockPatients = [
  {
    id: "p001",
    name: "Alice Smith",
    age: 29,
    gender: "Female",
    healthStatus: "Normal",
    latestReport: {
      id: "r101",
      date: "2024-06-01",
      summary: "Mild fever, prescribed rest and fluids.",
    },
  },
  {
    id: "p002",
    name: "Bob Johnson",
    age: 54,
    gender: "Male",
    healthStatus: "Follow-up",
    latestReport: {
      id: "r102",
      date: "2024-05-28",
      summary: "Routine checkup, all vitals normal.",
    },
  },
  {
    id: "p003",
    name: "Charlie Lee",
    age: 67,
    gender: "Male",
    healthStatus: "Critical",
    latestReport: {
      id: "r103",
      date: "2024-05-25",
      summary: "Follow-up for hypertension, medication adjusted.",
    },
  },
];

const DoctorReports = () => {
  const { doctorID } = useParams<{ doctorID: string }>();
  const [search, setSearch] = useState("");

  const filteredPatients = mockPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

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
                    No patients found.
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
