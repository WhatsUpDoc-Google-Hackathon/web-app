import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdSearch } from "react-icons/md";
import DoctorNavbar from "../components/reportComponents/DoctorNavbar";

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "Normal":
      return "bg-green-100 text-green-700 border-green-300";
    case "Follow-up":
      return "bg-orange-100 text-orange-700 border-orange-300";
    case "Critical":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

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
      <div className="flex items-center mb-4 bg-white w-full max-w-none rounded-2xl shadow-none border-b border-gray-100 px-8 py-4">
        <MdSearch className="text-accent text-xl mr-2" />
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-[var(--color-text)] placeholder-gray-400 px-2 py-1"
          placeholder="Search by patient name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                👤 Age & Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Latest Report Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Summary
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                ⚠️ Health Status
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-8">
                  No patients found.
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient) => (
                <motion.tr
                  key={patient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="hover:bg-accent/10 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-primary">
                    {patient.name}
                    <span className="block text-xs text-gray-400 font-normal">
                      {patient.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    👤 {patient.age} / {patient.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {patient.latestReport.date}
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                    {patient.latestReport.summary}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(
                        patient.healthStatus
                      )}`}
                    >
                      {patient.healthStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/report/${doctorID}/${patient.latestReport.id}`}
                      className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-sm shadow hover:bg-primary transition-colors cursor-pointer"
                    >
                      View Report
                    </Link>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DoctorReports;
