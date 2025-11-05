import React, { useState } from "react";
import LeaveTypeTable from "../components/LeaveTypeTable";
import LeaveBalanceTable from "../components/LeaveBalanceTable";
import HolidayCalendarTable from "../components/HolidayCalendarTable";
import LeaveApprovalTable from "../components/LeaveApprovalTable";

const LeaveAdminPage = () => {
  const [activeTab, setActiveTab] = useState("types");

  const tabs = [
    { key: "types", label: "Leave Types" },
    { key: "balances", label: "Leave Balances" },
    { key: "holidays", label: "Holiday Calendar" },
    { key: "approvals", label: "Leave Approvals" },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner p-6 relative">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Leave Management (Admin)
      </h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-300 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab.key
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "types" && <LeaveTypeTable />}
      {activeTab === "balances" && <LeaveBalanceTable />}
      {activeTab === "holidays" && <HolidayCalendarTable />}
      {activeTab === "approvals" && <LeaveApprovalTable />}
    </div>
  );
};

export default LeaveAdminPage;
