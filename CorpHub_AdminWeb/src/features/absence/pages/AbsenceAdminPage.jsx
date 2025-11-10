import React, { useState } from "react";
import AbsenceTypeTable from "../components/AbsenceTypeTable";
import AbsenceBalanceTable from "../components/AbsenceBalanceTable";
import HolidayCalendarTable from "../components/HolidayCalendarTable";
import AbsenceApprovalTable from "../components/AbsenceApprovalTable";
import AbsenceRequestTable from "../components/AbsenceRequestTableAdmin";

const AbsenceAdminPage = () => {
  const [activeTab, setActiveTab] = useState("requests");

  const tabs = [
    { key: "requests", label: "Absence Requests" },
    { key: "types", label: "Absence Types" },
    { key: "balances", label: "Absence Balances" },
    { key: "holidays", label: "Holiday Calendar" },
    { key: "approvals", label: "Absence Approvals" },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner p-6 relative">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Absence Management (Admin)
      </h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-300 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium ${activeTab === tab.key
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 hover:text-blue-500"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "requests" && <AbsenceRequestTable />}
      {activeTab === "types" && <AbsenceTypeTable />}
      {activeTab === "balances" && <AbsenceBalanceTable />}
      {activeTab === "holidays" && <HolidayCalendarTable />}
      {activeTab === "approvals" && <AbsenceApprovalTable />}
    </div>
  );
};

export default AbsenceAdminPage;
