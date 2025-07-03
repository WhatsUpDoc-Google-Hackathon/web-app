import { Link, useParams } from "react-router-dom";
import { Document, Page } from "react-pdf";
import { useState } from "react";

import { pdfjs } from "react-pdf";
import DoctorNavbar from "../components/DoctorNavbar";
import PatientTimeline from "./PatientTimeline";

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
  const { doctorID, reportID } = useParams<{
    doctorID: string;
    reportID: string;
  }>();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const patient = mockPatients.find((p) => p.latestReport.id === reportID);
  const report = patient?.latestReport;

  if (!patient || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Report Not Found
        </h2>
        <p className="text-gray-500">No report found for this ID.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <div className="w-full">
        <DoctorNavbar />
      </div>
      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-12 py-8">
        {/* Left column: Patient info + Timeline */}
        <div className="flex flex-col gap-8 w-full md:col-span-1">
          {/* Info Card */}
          <div className="bg-white rounded-2xl shadow p-8 ">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {patient.name}
                </div>
                <div className="text-xs text-gray-400 font-medium mb-2">
                  Patient ID: {patient.id}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-gray-700 text-sm">
                  <span className="whitespace-nowrap">
                    👤 {patient.age} / {patient.gender}
                  </span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${getStatusColor(
                      patient.healthStatus
                    )}`}
                  >
                    {patient.healthStatus}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Report Date:</div>
                <div className="font-semibold text-base">{report.date}</div>
              </div>
            </div>
            <div className="text-gray-600 italic text-base mt-2">
              {report.summary}
            </div>
          </div>
          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow p-6">
            <PatientTimeline personID={patient.id} reportID={report.id} />
          </div>
        </div>
        {/* Right column: PDF Viewer */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center min-h-[60vh] md:col-span-2">
          <Document
            file={report.pdf}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            className="w-full flex flex-col items-center"
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={800}
                className="my-4 mx-auto border-b-gray-200 border-b-1"
              />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
