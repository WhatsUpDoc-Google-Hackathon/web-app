import { useParams } from "react-router-dom";
import React from "react";
import { motion } from "framer-motion";
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
  onReportSelect?: (reportID: string) => void;
}

const PatientTimeline: React.FC<PatientTimelineProps> = ({
  personID: propPersonID,
  reportID,
  onReportSelect,
}) => {
  const params = useParams<{ doctorID: string; personID: string }>();
  const personID = propPersonID || params.personID;

  console.log("personID", personID);

  const handleTimelineItemClick = (entryReportID: string) => {
    if (onReportSelect && entryReportID) {
      onReportSelect(entryReportID);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center"
    >
      <div className="w-full bg-white p-2 md:p-4">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-primary mb-3 md:mb-4">
          Patient Timeline
        </h1>
        <div className="relative border-l-2 border-gray-200 pl-4 md:pl-6 lg:pl-8 pt-2 md:pt-4">
          {mockTimeline.map((entry, idx) => {
            const isActive = reportID && entry.reportID === reportID;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={
                  `group mb-6 md:mb-8 lg:mb-10 last:mb-0 relative transition-shadow cursor-pointer ` +
                  `rounded-lg md:rounded-xl px-3 md:px-4 lg:px-6 py-3 md:py-4 flex flex-col gap-2 md:gap-3 ` +
                  (isActive
                    ? "bg-accent/10 border-2 border-accent shadow-lg"
                    : "bg-gray-50/80 hover:bg-accent/10 shadow-sm hover:shadow-lg")
                }
                style={{ zIndex: mockTimeline.length - idx }}
                onClick={() => handleTimelineItemClick(entry.reportID)}
              >
                {idx !== mockTimeline.length - 1 && (
                  <span className="absolute left-[-8px] md:left-[-10px] lg:left-[-12px] top-8 md:top-10 lg:top-12 h-[calc(100%-2rem)] md:h-[calc(100%-2.5rem)] w-1 bg-accent/20 rounded-full z-0" />
                )}
                <div className="flex flex-col gap-2 md:gap-3 w-full">
                  <div className="absolute left-[-24px] md:left-[-28px] lg:left-[-32px] top-[-8px] md:top-[-10px] flex items-center justify-center">
                    <span
                      className={`inline-block px-2 md:px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(
                        entry.status
                      )}`}
                    >
                      {entry.status}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 md:gap-2">
                    <div className="text-xs text-gray-400 font-mono min-w-[6rem] md:min-w-[7rem] order-2 sm:order-1">
                      {formatDate(entry.date)}
                    </div>
                    <div className="text-gray-700 text-sm md:text-base leading-relaxed order-1 sm:order-2 flex-1">
                      {entry.description}
                    </div>
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
