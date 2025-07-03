import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

type Patient = {
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
};

type PatientRowProps = {
  patient: Patient;
  doctorID: string | undefined;
  isOdd?: boolean;
};

const PatientRow = ({ patient, doctorID, isOdd = false }: PatientRowProps) => (
  <motion.tr
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`hover:bg-accent/10 transition-colors ${
      isOdd ? "bg-gray-100/50" : "bg-white"
    }`}
  >
    <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 whitespace-nowrap font-medium text-primary">
      <div className="text-sm md:text-base">{patient.name}</div>
      <span className="block text-xs text-gray-400 font-normal">
        {patient.id}
      </span>
    </td>
    <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 whitespace-nowrap text-gray-700 text-sm md:text-base">
      👤 {patient.age} / {patient.gender}
    </td>
    <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 whitespace-nowrap text-gray-700 text-sm md:text-base">
      {patient.latestReport.date}
    </td>
    <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-gray-600 max-w-xs truncate text-sm md:text-base">
      {patient.latestReport.summary}
    </td>
    <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 whitespace-nowrap">
      <StatusBadge status={patient.healthStatus} />
    </td>
    <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 whitespace-nowrap">
      <Link
        to={`/report/${doctorID}/${patient.latestReport.id}`}
        className="px-3 md:px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-xs md:text-sm shadow hover:bg-primary transition-colors cursor-pointer inline-block"
      >
        <span className="hidden sm:inline">View Report</span>
        <span className="sm:hidden">View</span>
      </Link>
    </td>
  </motion.tr>
);

export default PatientRow;
