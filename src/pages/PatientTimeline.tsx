import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import { motion } from "framer-motion";
import {
  MdMedicalServices,
  MdCheckCircle,
  MdError,
  MdAccessTime,
} from "react-icons/md";
import { format } from "date-fns";

const mockTimeline = [
  {
    date: "2024-06-01",
    status: "Critical",
    description:
      "Severe hypertension observed. Immediate medication adjustment.",
    reportID: "r101",
  },
  {
    date: "2024-05-25",
    status: "Follow-up",
    description: "Blood pressure elevated. Scheduled follow-up.",
    reportID: "r102",
  },
  {
    date: "2024-05-10",
    status: "Normal",
    description: "Routine checkup. All vitals within normal range.",
    reportID: "r103",
  },
  {
    date: "2024-04-15",
    status: "Normal",
    description: "No issues detected. Patient in good health.",
    reportID: "r104",
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Normal":
      return <MdCheckCircle className="text-green-500 text-2xl" />;
    case "Follow-up":
      return <MdAccessTime className="text-orange-500 text-2xl" />;
    case "Critical":
      return <MdError className="text-red-500 text-2xl" />;
    default:
      return <MdMedicalServices className="text-gray-400 text-2xl" />;
  }
};

const formatDate = (dateStr: string) => {
  try {
    return format(new Date(dateStr), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
};

interface PatientTimelineProps {
  personID?: string;
  reportID?: string;
}

const PatientTimeline: React.FC<PatientTimelineProps> = ({
  personID: propPersonID,
  reportID,
}) => {
  const params = useParams<{ doctorID: string; personID: string }>();
  const personID = propPersonID || params.personID;
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center"
    >
      <div className="w-full bg-white p-4">
        <h1 className="text-2xl font-bold text-primary mb-4">
          Patient Timeline
        </h1>
        <div className="relative border-l-2 border-gray-200 pl-8 pt-4">
          {mockTimeline.map((entry, idx) => {
            const isActive = reportID && entry.reportID === reportID;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={
                  `group mb-10 last:mb-0 relative transition-shadow cursor-pointer ` +
                  `rounded-xl px-6 py-4 flex flex-col md:flex-row md:items-center md:gap-4 ` +
                  (isActive
                    ? "bg-accent/10 border-2 border-accent shadow-lg"
                    : "bg-gray-50/80 hover:bg-accent/10 shadow-sm hover:shadow-lg")
                }
                style={{ zIndex: mockTimeline.length - idx }}
                onClick={() => {
                  if (entry.reportID) {
                    if (params.doctorID && personID && entry.reportID) {
                      navigate(`/report/${params.doctorID}/${entry.reportID}`);
                    }
                  }
                }}
              >
                {idx !== mockTimeline.length - 1 && (
                  <span className="absolute left-3 top-10 h-[calc(100%-2.5rem)] w-1 bg-accent/20 rounded-full z-0" />
                )}
                <div className="flex flex-col md:flex-row md:items-center md:gap-4 w-full">
                  <div className="absolute left-[-10px] top-[-10px] flex items-center justify-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(
                        entry.status
                      )}`}
                    >
                      {entry.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1 md:mb-0 md:w-32 min-w-[7rem] font-mono">
                    {formatDate(entry.date)}
                  </div>
                  <div className="text-gray-700 text-base ml-0 md:ml-2">
                    {entry.description}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default PatientTimeline;
