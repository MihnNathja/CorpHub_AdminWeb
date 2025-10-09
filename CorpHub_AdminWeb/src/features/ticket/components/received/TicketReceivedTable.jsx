import React from "react";
import { useTickets } from "../../hooks/useTickets";
import TicketFilter from "../AdminTicketFilter";
import TicketReceivedTableBody from "./TicketReceivedTableBody";
import Pagination from "../../../global/components/Pagination";
import TicketModal from "../TicketModal";
import { statusColors } from "../../../global/const/statusColors";
import { priorityColors } from "../../../global/const/priorityColors";
import ReasonForm from "../ReasonForm";
import { useUser } from "../../../user/hooks/useUser";

const TicketReceivedTable = () => {
  const {
    tickets,
    loading,
    error,

    // Pagination
    page,
    setPage,
    totalPages,
    size,
    setSize,

    // Filters
    status,
    setStatus,
    priority,
    setPriority,
    from,
    setFrom,
    to,
    setTo,
    keyword,
    setKeyword,

    // Ticket selection / modals
    selectedTicket,
    setSelectedTicket,
    isReasonFormOpen,
    setIsReasonFormOpen,
    isModalOpen,
    setIsModalOpen,
    editingId,
    setEditingId,

    // Actions
    handleAssign,
    handleReject,
    handleComplete,
  } = useTickets("received");

  const { employees: users } = useUser();

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-300">
        Loading received tickets...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 dark:text-red-400">
        Failed to load tickets: {error.message || error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Received Tickets
      </h3>

      {/* 🎯 Bộ lọc chính */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div className="flex flex-col mb-4">
          <label className="text-gray-900 dark:text-gray-100 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by title, description, or requester..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border rounded p-1 dark:bg-gray-900 dark:border-gray-700 text-gray-700 dark:text-gray-200"
          />
        </div>

        <TicketFilter
          name="Status"
          filter={status}
          setFilter={setStatus}
          colors={statusColors}
        />

        <TicketFilter
          name="Priority"
          filter={priority}
          setFilter={setPriority}
          colors={priorityColors}
        />

        <div className="flex flex-col mb-4">
          <label className="text-gray-900 dark:text-gray-100 mb-1">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded p-1 dark:bg-gray-900 dark:border-gray-700 text-gray-700 dark:text-gray-200"
          />
        </div>

        <div className="flex flex-col mb-4">
          <label className="text-gray-900 dark:text-gray-100 mb-1">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border rounded p-1 dark:bg-gray-900 dark:border-gray-700 text-gray-700 dark:text-gray-200"
          />
        </div>
      </div>

      {/* Bảng ticket */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-4 py-2">Requester</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Priority</th>
              <th className="px-4 py-2">Assignee</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">View</th>
            </tr>
          </thead>
          <TicketReceivedTableBody
            tickets={tickets}
            users={users}
            editingId={editingId}
            setEditingId={setEditingId}
            handleAssign={handleAssign}
            isReasonFormOpen={isReasonFormOpen}
            setIsReasonFormOpen={setIsReasonFormOpen}
            setIsModalOpen={setIsModalOpen}
            setSelectedTicket={setSelectedTicket}
          />
        </table>
      </div>

      {/* Pagination + Rows per page */}
      <div className="mt-4 flex items-center justify-between">
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Rows:
          </label>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="border rounded p-1 text-sm dark:bg-gray-900 dark:border-gray-700 text-gray-700 dark:text-gray-200"
          >
            {[5, 10, 20, 50].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Modal chi tiết ticket */}
      <TicketModal
        ticket={isModalOpen ? selectedTicket : null}
        handleAssign={handleAssign}
        handleReject={handleReject}
        handleComplete={handleComplete}
        setIsReasonFormOpen={setIsReasonFormOpen}
        onClose={() => {
          setSelectedTicket(null);
          setIsModalOpen(false);
        }}
        mode="received"
      />

      {/* Form reject */}
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
        </div>
      )}
    </div>
  );
};

export default TicketReceivedTable;
