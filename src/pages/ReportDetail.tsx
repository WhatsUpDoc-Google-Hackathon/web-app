import { useParams } from "react-router-dom";
import { Document, Page } from "react-pdf";
import { useState, useEffect } from "react";

import { pdfjs } from "react-pdf";
import DoctorNavbar from "../components/reportComponents/DoctorNavbar";
import PatientTimeline from "../components/reportComponents/PatientTimeline";
import { PatientService } from "../api/patients";
import type { Report, Patient } from "../api/patients";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
  const { reportID: urlReportID } = useParams<{
    reportID: string;
  }>();

  const [selectedReportID, setSelectedReportID] = useState<string>("");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfWidth, setPdfWidth] = useState<number>(800);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch initial report data
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!urlReportID) {
        setError("No report ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch report details by ID
        const reportDetails = await PatientService.getReportById(urlReportID);

        setReport(reportDetails.report);
        setPatient(reportDetails.patient);
        setSelectedReportID(urlReportID);

        // Fetch all reports for this patient for the timeline
        const patientReports = await PatientService.getPatientReports(
          reportDetails.patient.id
        );
        setReports(patientReports.reports);
      } catch (err) {
        console.error("Failed to fetch report data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch report data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [urlReportID]);

  // Handle report selection change from timeline
  const handleReportChange = async (reportID: string) => {
    try {
      setLoading(true);
      setError(null);

      const reportDetails = await PatientService.getReportById(reportID);
      setReport(reportDetails.report);
      setSelectedReportID(reportID);
      setNumPages(null); // Reset page count for new PDF
    } catch (err) {
      console.error("Failed to fetch report:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-gray-50">
        <div className="w-full">
          <DoctorNavbar />
        </div>
        <div className="flex justify-center items-center flex-1">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading report...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-gray-50">
        <div className="w-full">
          <DoctorNavbar />
        </div>
        <div className="flex justify-center items-center flex-1">
          <div className="text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">
              Error Loading Report
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
      </div>
    );
  }

  if (!patient || !report) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-gray-50">
        <div className="w-full">
          <DoctorNavbar />
        </div>
        <div className="flex flex-col items-center justify-center flex-1 px-4">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-2 text-center">
            Report Not Found
          </h2>
          <p className="text-gray-500 text-center">
            No report found for this ID.
          </p>
        </div>
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
                      report.health_status
                    )}`}
                  >
                    {report.health_status}
                  </span>
                </div>
              </div>
              <div className="text-left lg:text-right">
                <div className="text-sm text-gray-500">Report Date:</div>
                <div className="font-semibold text-base">
                  {report.report_date}
                </div>
              </div>
            </div>
            <div className="text-gray-600 italic text-sm md:text-base mt-2 leading-relaxed">
              {report.summary || "No summary available"}
            </div>
          </div>
          {/* Timeline */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow p-3 md:p-4 lg:p-6">
            <PatientTimeline
              reportID={selectedReportID}
              reports={reports}
              onReportSelect={handleReportChange}
            />
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
            {report.report_url ? (
              <Document
                file={report.report_url}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                className="w-full flex flex-col items-center"
                key={selectedReportID} // Force re-render when report changes
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
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📄</div>
                <div className="text-gray-600 text-lg font-medium mb-2">
                  No PDF Available
                </div>
                <div className="text-gray-500 text-sm text-center max-w-md">
                  This report doesn't have an associated PDF document. The
                  report details are available in the summary above.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
