import React from "react";
import { useTickets } from "../hooks/useTickets";
import TicketFilter from "./TicketFilter";
import TicketSentTableBody from "./TicketSentTableBody";
import Pagination from "./Pagination";
import TicketModal from "./TicketModal";

const TicketSentTable = () => {
  const {
    tickets, loading, statusFilter, setStatusFilter,
    page, setPage, totalPages, users,
    selectedTicket, setSelectedTicket,
    handleConfirmSend,
    handleRejectSend
  } = useTickets("sent");

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Sent Tickets
      </h3>

      <TicketFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Priority</th>
              <th className="px-4 py-2">Requester</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <TicketSentTableBody
            tickets={tickets}
            handleConfirmSend={handleConfirmSend}
            handleRejectSend={handleRejectSend}
            setSelectedTicket={setSelectedTicket}
          />
        </table>
      </div>

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />

      <TicketModal
        ticket={selectedTicket}
        users={users}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
};

export default TicketSentTable;
