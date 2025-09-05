import React, { useState } from "react";
import TicketTable from "../components/TicketTable";

const TicketsPage = () => {
  const [activeTab, setActiveTab] = useState("sent"); // "sent" | "received"

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tickets Management</h2>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-4">
        <button
          onClick={() => setActiveTab("sent")}
          className={`px-4 py-2 ${
            activeTab === "sent"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
        >
          My Tickets's Department 
        </button>
        <button
          onClick={() => setActiveTab("received")}
          className={`px-4 py-2 ${
            activeTab === "received"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
        >
          My Tickets's Department Received
        </button>
      </div>

      {/* Nội dung */}
      {activeTab === "sent" && <TicketTable mode="sent" />}
      {activeTab === "received" && <TicketTable mode="received" />}
    </div>
  );
};

export default TicketsPage;
