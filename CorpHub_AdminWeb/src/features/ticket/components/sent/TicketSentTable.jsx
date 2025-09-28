import React, { useMemo } from "react";
import { useTickets } from "../../hooks/useTickets";
import TicketFilter from "../AdminTicketFilter";
import TicketSentTableBody from "./TicketSentTableBody";
import Pagination from "../Pagination";
import TicketModal from "../TicketModal";
import { statusColors } from "../../../global/const/statusColors";
import { priorityColors } from "../../../global/const/priorityColors";
import ReasonForm from "../ReasonForm";

const TicketSentTable = () => {
  const {
    rawTickets,
    tickets,
    loading,
    statusFilter,
    priorityFilter,
    setStatusFilter,
    setPriorityFilter,
    page,
    setPage,
    totalPages,
    users,
    selectedTicket,
    isReasonFormOpen,
    setIsReasonFormOpen,
    setSelectedTicket,
    isModalOpen,
    setIsModalOpen,
    handleConfirmSend,
    handleReject,
  } = useTickets("sent");

  // Đếm số ticket theo status (sử dụng filteredTickets, bỏ qua phân trang)
  const statusCounts = useMemo(() => {
    return rawTickets.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {});
  }, [rawTickets]);

  // Đếm số ticket theo priority
  const priorityCounts = useMemo(() => {
    return rawTickets.reduce((acc, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1;
      return acc;
    }, {});
  }, [rawTickets]);

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl text-center">
        <p className="text-blue-500">Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Sent Tickets
      </h3>

      {/* Bộ lọc */}
      <div className="flex gap-4 mb-4">
        <TicketFilter
          name="Status"
          filter={statusFilter}
          counts={statusCounts}
          setFilter={setStatusFilter}
          colors={statusColors}
        />
        <TicketFilter
          name="Priority"
          filter={priorityFilter}
          counts={priorityCounts}
          setFilter={setPriorityFilter}
          colors={priorityColors}
        />
      </div>

      {/* Bảng tickets */}
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
              <th className="px-4 py-2">View</th>
            </tr>
          </thead>
          <TicketSentTableBody
            tickets={tickets}
            handleConfirmSend={handleConfirmSend}
            setIsReasonFormOpen={setIsReasonFormOpen}
            setSelectedTicket={setSelectedTicket}
            setIsModalOpen={setIsModalOpen}
          />
        </table>
      </div>

      {/* Phân trang */}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />

      {/* Modal chi tiết */}
      <TicketModal
        ticket={isModalOpen ? selectedTicket : null}
        users={users}
        onClose={() => {
          setSelectedTicket(null);
          setIsModalOpen(false);
        }}
        mode="sent"
      />

      {isReasonFormOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl">
            <ReasonForm
              ticket={selectedTicket}
              mode="reject"
              title="Reject Ticket"
              quickReasons={[
                "Insufficient information",
                "Not enough evidence",
                "Out of scope",
                "Duplicate request",
              ]}
              onSubmit={(reason) => {
                handleReject(selectedTicket.id, reason);
                setIsReasonFormOpen(false);
              }}
              onCancel={() => setIsReasonFormOpen(false)}
            />
          </div>
        </div>)}
    </div>
  );
};

export default TicketSentTable;
