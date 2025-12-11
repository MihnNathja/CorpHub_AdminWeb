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
      description: "Danh sách và trạng thái nhân viên",
      icon: Users,
    },
    {
      key: "add",
      label: "Add new employee profile",
      description: "Tạo hồ sơ mới và upload avatar",
      icon: UserPlus,
    },
    {
      key: "pendingCompetency",
      label: "Pending Competency",
      description: "Duyệt năng lực/ chứng chỉ chờ xử lý",
      icon: BadgeCheck,
    },
    {
      key: "positionRequests",
      label: "Position Requests",
      description: "Xử lý yêu cầu thay đổi chức danh/phòng ban",
      icon: Shuffle,
    },
    {
      key: "hrFinalization",
      label: "HR Finalization",
      description: "Chốt hồ sơ và tài liệu nhân sự",
      icon: FileCheck2,
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-inner p-6">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-2xl dark:text-gray-100 font-bold">
          Employee Management
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Quản lý hồ sơ, phê duyệt yêu cầu và theo dõi trạng thái nhân viên
          trong một nơi thống nhất.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm mb-3">
        <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
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

        {tabs.find((t) => t.key === activeTab)?.description && (
          <div className="px-4 py-3 bg-indigo-50/60 dark:bg-indigo-900/15 text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2 border-t border-gray-200 dark:border-gray-800">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            {tabs.find((t) => t.key === activeTab)?.description}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 bg-white dark:bg-gray-800 shadow-sm">
        {activeTab === "list" && <EmployeeTable />}
        {activeTab === "add" && <EmployeeProfileForm />}
        {activeTab === "pendingCompetency" && <PendingCompetencyPage />}
        {activeTab === "positionRequests" && <PositionRequestsTab />}
        {activeTab === "hrFinalization" && <HRFinalizationTab />}
      </div>
    </div>
  );
};

export default EmployeePage;
