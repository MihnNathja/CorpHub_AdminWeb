import React, { useState } from "react";
import TicketSentTable from "../components/sent/TicketSentTable";
import TicketReceivedTable from "../components/received/TicketReceivedTable";

const TicketsPage = () => {
  const [activeTab, setActiveTab] = useState("sent");

  const tabs = [
    { key: "sent", label: "My Tickets's Department" },
    { key: "received", label: "My Tickets's Department Received" },
  ];

  return (
    <div className="text-gray-900 dark:text-gray-700">
      <h2 className="text-xl dark:text-gray-100 font-bold mb-4">Tickets Management</h2>

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
        {activeTab === "sent" && <TicketSentTable />}
        {activeTab === "received" && <TicketReceivedTable />}
      </div>
    </div>
  );
};

export default TicketsPage;
