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
};

const PatientRow = ({ patient, doctorID }: PatientRowProps) => (
  <motion.tr
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
      <StatusBadge status={patient.healthStatus} />
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
);

export default PatientRow;
