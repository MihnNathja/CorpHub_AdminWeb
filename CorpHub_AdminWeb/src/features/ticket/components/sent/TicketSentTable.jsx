import React from "react";
import { useTickets } from "../../hooks/useTickets";
import TicketFilter from "../TicketFilter";
import TicketSentTableBody from "./TicketSentTableBody";
import Pagination from "../Pagination";
import TicketModal from "../TicketModal";

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
    <div className="p-4">
      <TicketFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Department</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Priority</th>
              <th className="border px-4 py-2">Requester</th>
              <th className="border px-4 py-2">Created At</th>
              <th className="border px-4 py-2">Action</th>
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
