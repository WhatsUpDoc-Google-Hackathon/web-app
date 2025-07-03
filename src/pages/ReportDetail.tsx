import { useParams } from "react-router-dom";
import { Document, Page } from "react-pdf";
import { useState, useEffect } from "react";

import { pdfjs } from "react-pdf";
import DoctorNavbar from "../components/reportComponents/DoctorNavbar";
import PatientTimeline from "../components/reportComponents/PatientTimeline";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
      pdf: "/sample-report.pdf",
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
      pdf: "/sample-report.pdf",
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
      pdf: "/sample-report.pdf",
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

const ReportDetail = () => {
  const { reportID } = useParams<{
    reportID: string;
  }>();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfWidth, setPdfWidth] = useState<number>(800);

  const patient = mockPatients.find((p) => p.latestReport.id === reportID);
  const report = patient?.latestReport;

  // Calculate responsive PDF width
  useEffect(() => {
    const updatePdfWidth = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        // Mobile: Full width minus padding
        setPdfWidth(screenWidth - 32);
      } else if (screenWidth < 1024) {
        // Tablet: Adjust for container
        setPdfWidth(Math.min(600, screenWidth - 64));
      } else {
        // Desktop: Standard width but not too large
        setPdfWidth(Math.min(800, screenWidth * 0.5));
      }
    };

    updatePdfWidth();
    window.addEventListener("resize", updatePdfWidth);
    return () => window.removeEventListener("resize", updatePdfWidth);
  }, []);

  if (!patient || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-xl md:text-2xl font-bold text-primary mb-2 text-center">
          Report Not Found
        </h2>
        <p className="text-gray-500 text-center">
          No report found for this ID.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <div className="w-full">
        <DoctorNavbar />
      </div>
      <div className="w-full flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 px-2 md:px-4 lg:px-12 py-4 md:py-6 lg:py-8">
        {/* Left column: Patient info + Timeline */}
        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 w-full lg:col-span-1">
          {/* Info Card */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow p-4 md:p-6 lg:p-8">
            <div className="flex flex-col gap-4 mb-4">
              <div>
                <div className="text-xl md:text-2xl font-bold text-primary mb-1">
                  {patient.name}
                </div>
                <div className="text-xs text-gray-400 font-medium mb-2">
                  Patient ID: {patient.id}
                </div>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-gray-700 text-sm">
                  <span className="whitespace-nowrap">
                    👤 {patient.age} / {patient.gender}
                  </span>
                  <span
                    className={`inline-block px-2 md:px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${getStatusColor(
                      patient.healthStatus
                    )}`}
                  >
                    {patient.healthStatus}
                  </span>
                </div>
              </div>
              <div className="text-left lg:text-right">
                <div className="text-sm text-gray-500">Report Date:</div>
                <div className="font-semibold text-base">{report.date}</div>
              </div>
            </div>
            <div className="text-gray-600 italic text-sm md:text-base mt-2 leading-relaxed">
              {report.summary}
            </div>
          </div>
          {/* Timeline */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow p-3 md:p-4 lg:p-6">
            <PatientTimeline personID={patient.id} reportID={report.id} />
          </div>
        </div>

        {/* Right column: PDF Viewer */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow p-3 md:p-4 flex flex-col items-center min-h-[50vh] md:min-h-[60vh] lg:col-span-2">
          {/* PDF Header with page count */}
          <div className="w-full border-b border-gray-200 pb-3 md:pb-4 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-base md:text-lg font-semibold text-primary">
                  Medical Report
                </h3>
                <p className="text-xs md:text-sm text-gray-500">
                  Report ID: {report.id}
                </p>
              </div>
              {numPages && (
                <div className="bg-gray-100 px-2 md:px-3 py-1 md:py-2 rounded-lg self-start sm:self-auto">
                  <span className="text-xs md:text-sm font-medium text-gray-700">
                    {numPages} {numPages === 1 ? "page" : "pages"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* PDF Document */}
          <div className="w-full flex flex-col items-center overflow-x-auto">
            <Document
              file={report.pdf}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              className="w-full flex flex-col items-center"
            >
              {Array.from(new Array(numPages), (_, index) => (
                <div key={`page_${index + 1}`} className="mb-4 last:mb-0">
                  <Page
                    pageNumber={index + 1}
                    width={pdfWidth}
                    className="mx-auto overflow-hidden border-b-1 border-gray-200 "
                  />
                </div>
              ))}
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
