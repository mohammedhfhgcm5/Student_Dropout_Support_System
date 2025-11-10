import { apiClient } from "./apiConfig";

// 🧩 Type for Dashboard data (matches backend response)
export interface DashboardStats {
  studentsCount: number;
  activeStudents: number;
  dropoutStudents: number;
  atRiskStudents: number;
  returnedStudents: number;

  usersCount: number;
  fieldTeamsCount: number;
  ngoStaffCount: number;

  donationsCount: number;
  pendingDonations: number;
  confirmedDonations: number;

  visitsCount: number;

  recentNotifications: {
    id: number;
    title: string;
    message: string;
    createdAt: string;
  }[];
}

// 🧠 Type for trends (for charts)
export interface DashboardTrends {
  donations: { month: number; total: number }[];
  students: { month: number; total: number }[];
}

// ⚠️ Type for alerts section
export interface DashboardAlerts {
  criticalCases: number;
  delayedVisits: number;
  unallocatedDonations: number;
}

// 🧩 Dashboard API service
export const dashboardService = {
  // 📊 Summary (overview)
  getOverview: async (): Promise<DashboardStats> => {
    const res = await apiClient.get("/dashboard/overview");
    return res.data;
  },

  // 📈 Monthly trends
  getTrends: async (): Promise<DashboardTrends> => {
    const res = await apiClient.get("/dashboard/trends");
    return res.data;
  },

  // 🚨 Alerts
  getAlerts: async (): Promise<DashboardAlerts> => {
    const res = await apiClient.get("/dashboard/alerts");
    return res.data;
  },

  // 🧠 Optional: real-time stats (polling)
  getRealtimeStats: async (): Promise<DashboardStats> => {
    const res = await apiClient.get("/dashboard/overview"); // Same endpoint reused
    return res.data;
  },
};
