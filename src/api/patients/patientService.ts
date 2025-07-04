// Base URL for the backend API - can be configured via environment variable
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Types based on the database schema
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  created_at?: string;
}

export interface Report {
  id: string;
  patient_id: string;
  summary: string | null;
  health_status: string;
  report_date: string;
  report_url: string | null;
  created_at?: string;
}

export interface PatientWithLatestReport {
  patient_id: string;
  name: string;
  age: number;
  gender: string;
  report_id: string | null;
  summary: string | null;
  health_status: string | null;
  report_date: string | null;
  report_url: string | null;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  count?: number;
}

export interface PatientReportsResponse {
  patient: Patient;
  reports: Report[];
}

export interface ReportDetailsResponse {
  report: Report;
  patient: Patient;
}

export class PatientService {
  /**
   * Get all patients with their latest reports for the table view
   */
  static async getAllPatientsWithLatestReports(): Promise<
    PatientWithLatestReport[]
  > {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<PatientWithLatestReport[]> =
        await response.json();

      if (result.status !== "success") {
        throw new Error("Failed to fetch patients");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw new Error(
        `Failed to fetch patients: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get patient details by ID
   */
  static async getPatientById(patientId: string): Promise<Patient> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Patient not found");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Patient> = await response.json();

      if (result.status !== "success") {
        throw new Error("Failed to fetch patient");
      }

      return result.data;
    } catch (error) {
      console.error(`Error fetching patient ${patientId}:`, error);
      throw new Error(
        `Failed to fetch patient: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get all reports for a patient (timeline view)
   */
  static async getPatientReports(
    patientId: string
  ): Promise<PatientReportsResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/patients/${patientId}/reports`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Patient not found");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<PatientReportsResponse> = await response.json();

      if (result.status !== "success") {
        throw new Error("Failed to fetch patient reports");
      }

      return result.data;
    } catch (error) {
      console.error(`Error fetching reports for patient ${patientId}:`, error);
      throw new Error(
        `Failed to fetch patient reports: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get specific report details by ID
   */
  static async getReportById(reportId: string): Promise<ReportDetailsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Report not found");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ReportDetailsResponse> = await response.json();

      if (result.status !== "success") {
        throw new Error("Failed to fetch report");
      }

      return result.data;
    } catch (error) {
      console.error(`Error fetching report ${reportId}:`, error);
      throw new Error(
        `Failed to fetch report: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
