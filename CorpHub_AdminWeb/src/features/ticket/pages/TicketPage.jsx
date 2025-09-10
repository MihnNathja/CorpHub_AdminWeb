import React, { useState } from "react";
import TicketSentTable from "../components/TicketSentTable";
import TicketReceivedTable from "../components/TicketReceivedTable";

const TicketsPage = () => {
  const [activeTab, setActiveTab] = useState("sent"); // "sent" | "received"

  return (
    <div className="text-gray-900 dark:text-gray-700">
      {/* Title */}
      <h2 className="text-xl dark:text-gray-100 font-bold mb-4">Tickets Management</h2>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-4">
        <button
          onClick={() => setActiveTab("sent")}
          className={`px-4 py-2 transition-colors ${activeTab === "sent"
            ? "border-b-2 border-blue-500 font-semibold text-blue-600 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
        >
          My Tickets's Department
        </button>
        <button
          onClick={() => setActiveTab("received")}
          className={`px-4 py-2 transition-colors ${activeTab === "received"
            ? "border-b-2 border-blue-500 font-semibold text-blue-600 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
        >
          My Tickets's Department Received
        </button>
      </div>

      {/* Nội dung */}
      {activeTab === "sent" && <TicketSentTable />}
      {activeTab === "received" && <TicketReceivedTable />}
    </div>
  );
};

export default TicketsPage;
