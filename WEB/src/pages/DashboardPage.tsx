import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Settings,
  HeartHandshake,
} from "lucide-react";
import { useState } from "react";
import { useDashboard } from "../hooks/useDashboard";
import { useNavigate } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  trend?: { value: number; isPositive: boolean };
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  onClick,
  trend,
}: StatCardProps) => (
  <div
    onClick={onClick}
    className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all group"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-gray-600 text-xs font-medium">{title}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <h3 className="text-2xl font-semibold text-gray-900">{value ?? 0}</h3>
          {trend && trend.value !== 0 && (
            <span
              className={`text-xs font-medium ${
                trend.isPositive ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
      </div>

      <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors">
        {icon}
      </div>
    </div>
  </div>
);

interface QuickActionCardProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const QuickActionCard = ({ label, icon, onClick }: QuickActionCardProps) => (
  <button
    onClick={onClick}
    className="bg-white rounded-xl border border-gray-200 p-10 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-4 cursor-pointer group"
  >
    <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-gray-700 transition-colors">
      {icon}
    </div>
    <p className="text-base font-semibold text-gray-900 text-center">
      {label}
    </p>
  </button>
);

export default function DashboardPage() {

      const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { current, previous, isLoading, error } = useDashboard();

  function calculateAverage(currentValue?: number, previousValue?: number) {
    if (!currentValue || !previousValue || previousValue === 0) return 0;
    const percent = ((currentValue - previousValue) / previousValue) * 100;
    return Number(percent.toFixed(1));
  }

  function getTrend(currentValue?: number, previousValue?: number) {
    const value = calculateAverage(currentValue, previousValue);
    return {
      value: Math.abs(value),
      isPositive: value >= 0,
    };
  }

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading dashboard...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load dashboard data.
      </div>
    );

  if (!current)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No data available.
      </div>
    );

  const statCards = [
    {
      title: "Total Students",
      value: current.studentsCount,
      subtitle: "All registered students",
      icon: <Users size={24} />,
      trend: getTrend(current.studentsCount, previous?.studentsCount),
    },
    {
      title: "Total Users",
      value: current.usersCount,
      subtitle: "All system users",
      icon: <Users size={24} />,
      trend: getTrend(current.usersCount, previous?.usersCount),
    },
    {
      title: "Total Donations",
      value: current.donationsCount,
      subtitle: "All recorded donations",
      icon: <TrendingUp size={24} />,
      trend: getTrend(current.donationsCount, previous?.donationsCount),
    },
    {
      title: "Pending Donations",
      value: current.pendingDonations,
      subtitle: "Awaiting confirmation",
      icon: <AlertCircle size={24} />,
      trend: getTrend(current.pendingDonations, previous?.pendingDonations),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Student Dropout Support System
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Last updated</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

       {/* Management Cards (bigger, no title) */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mt-10">
          <QuickActionCard
            label="Manage Students"
            icon={<Users size={36} />}
            onClick={() => navigate("/students")}
          />
          <QuickActionCard
            label="Manage Users"
            icon={<Settings size={36} />}
            onClick={() => alert("Navigate to Manage Users")}
          />
          <QuickActionCard
            label="Manage Donors"
            icon={<HeartHandshake size={36} />}
            onClick={() => alert("Navigate to Manage Donors")}
          />
        </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Section */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((stat) => (
            <StatCard
              key={stat.title}
              {...stat}
              onClick={() => setActiveSection(stat.title)}
            />
          ))}
        </div>

       

        {/* Recent Notifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Notifications
          </h2>

          {current.recentNotifications?.length ? (
            <div className="space-y-4">
              {current.recentNotifications.map((note) => (
                <div
                  key={note.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{note.title}</p>
                    <p className="text-sm text-gray-600">{note.message}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center">
              No recent notifications.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
