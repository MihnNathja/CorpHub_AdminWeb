import React, { useState } from "react";
import EmployeeProfileForm from "../components/EmployeeProfileForm";
import EmployeeTable from "../components/EmployeeTable";

const EmployeePage = () => {
  const [activeTab, setActiveTab] = useState("list");

  const tabs = [
    { key: "list", label: "Employees list" },
    { key: "add", label: "Add new employee profile" },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner p-6">
      <h2 className="text-xl dark:text-gray-100 font-bold mb-4">
        Employee Management
      </h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 -mb-px font-medium rounded-t-lg transition-colors ${
              activeTab === tab.key
                ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-b-0 text-gray-900 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg p-4 -mt-px bg-white dark:bg-gray-800">
        {activeTab === "list" && <EmployeeTable />}
        {activeTab === "add" && <EmployeeProfileForm />}
      </div>
    </div>
  );
};

export default EmployeePage;
