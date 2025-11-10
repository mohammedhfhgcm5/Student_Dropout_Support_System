import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../api/dashboardService";
import type { DashboardStats } from "../api/dashboardService";

// 🧠 Hook to fetch current and previous dashboard data
export const useDashboard = () => {
  const {
    data: current,
    isLoading,
    error,
    refetch,
  } = useQuery<DashboardStats>({
    queryKey: ["dashboard-current"],
    queryFn: dashboardService.getOverview, // ✅ renamed to match backend
    refetchInterval: 60000, // refresh every 60s
  });

  // 🧩 Optional: fetch previous data (e.g., for trend comparison)
  const {
    data: previous,
  } = useQuery<DashboardStats>({
    queryKey: ["dashboard-previous"],
    queryFn: dashboardService.getRealtimeStats, // simulate previous snapshot
    enabled: !!current, // only after current is loaded
  });

  return {
    current,
    previous,
    isLoading,
    error,
    refetch,
  };
};
