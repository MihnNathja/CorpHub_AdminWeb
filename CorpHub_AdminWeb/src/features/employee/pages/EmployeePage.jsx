import React, { useState } from "react";
import EmployeeProfileForm from "../components/EmployeeProfileForm";
import EmployeeTable from "../components/EmployeeTable";
import PendingCompetencyPage from "../components/PendingCompetencyPage";
import PositionRequestsTab from "../components/PositionRequestsTab";
import HRFinalizationTab from "../components/HRFinalizationTab";
import { Users, UserPlus, BadgeCheck, Shuffle, FileCheck2 } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";

const EmployeePage = () => {
  const { hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState("list");

  const tabs = [
    {
      key: "list",
      label: "Employees list",
      description: "Employee list and status",
      icon: Users,
    },
    {
      key: "add",
      label: "Add new employee profile",
      description: "Create a new profile and upload avatar",
      icon: UserPlus,
    },
    {
      key: "competencyRequests",
      label: "Competency Requests",
      description: "Review and approve competency/certification submissions",
      icon: BadgeCheck,
    },
    {
      key: "positionRequests",
      label: "Position Requests",
      description: "Handle role/department change requests",
      icon: Shuffle,
    },
    {
      key: "hrFinalization",
      label: "HR Finalization",
      description: "Finalize HR records and documents",
      icon: FileCheck2,
    },
  ];

  // Managers can only see list + position requests; admins/HR keep full access
  const visibleTabs =
    hasRole("ROLE_MANAGER") && !hasRole("ROLE_ADMIN") && !hasRole("ROLE_HR")
      ? tabs.filter((t) => ["list", "positionRequests"].includes(t.key))
      : tabs;

  // Ensure active tab stays valid when visibility changes
  const currentTabExists = visibleTabs.some((t) => t.key === activeTab);
  const safeActiveTab = currentTabExists
    ? activeTab
    : visibleTabs[0]?.key ?? "list";

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg border border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-sm">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-white/80 uppercase tracking-wide">
              Workforce
            </p>
            <h1 className="text-3xl font-bold">Employee Management</h1>
          </div>
        </div>
        <p className="text-sm text-white/70 mt-2 ml-13">
          Manage employee records, approvals, and position workflows
        </p>
      </div>

      {/* Tabs Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = safeActiveTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-[180px] px-4 py-3 text-sm font-semibold transition-all duration-150 flex items-center gap-2 border-b-2 ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-300 border-b-indigo-600 dark:border-b-indigo-400 bg-indigo-50/40 dark:bg-indigo-900/20"
                    : "text-gray-600 dark:text-gray-300 border-b-transparent hover:text-indigo-600 dark:hover:text-indigo-200 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                }`}
                aria-pressed={isActive}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {visibleTabs.find((t) => t.key === safeActiveTab)?.description && (
          <div className="px-6 py-3 bg-blue-50/50 dark:bg-blue-900/10 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 border-t border-gray-200 dark:border-gray-800">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            {visibleTabs.find((t) => t.key === safeActiveTab)?.description}
          </div>
        )}
        <div className="p-6 animate-fade-in">
          {safeActiveTab === "list" && <EmployeeTable />}
          {safeActiveTab === "add" && <EmployeeProfileForm />}
          {safeActiveTab === "competencyRequests" && <PendingCompetencyPage />}
          {safeActiveTab === "positionRequests" && <PositionRequestsTab />}
          {safeActiveTab === "hrFinalization" && <HRFinalizationTab />}
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
