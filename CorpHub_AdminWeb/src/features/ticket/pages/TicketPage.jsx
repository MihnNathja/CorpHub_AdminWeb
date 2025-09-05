import React from "react";
import TicketTable from "../components/TicketTable";

const TicketsPage = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tickets Management</h2>
      <TicketTable />
    </div>
  );
};

export default TicketsPage;
