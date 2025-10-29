import React from "react";
import TicketModal from "./TicketModal";
import ReasonForm from "./ReasonForm";
import { statusColors } from "../../global/const/statusColors";
import { priorityColors } from "../../global/const/priorityColors";
import Pagination from "../../global/components/Pagination";
import TicketFilter from "./AdminTicketFilter";

const TicketTableBase = ({
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
  keyword,
  setKeyword,
  status,
  setStatus,
  priority,
  setPriority,
  from,
  setFrom,
  to,
  setTo,

  // Selection / modals
  selectedTicket,
  setSelectedTicket,
  isReasonFormOpen,
  setIsReasonFormOpen,
  isModalOpen,
  setIsModalOpen,

  // Actions / handlers
  handleReject,
  modalProps = {},
  reasonFormProps = {},

  // Custom body render
  renderTableHead,
  renderTableBody,
}) => {
  if (error)
    return (
      <div className="p-6 text-center text-red-500 dark:text-red-400">
        Failed to load tickets: {error.message || error}
      </div>
    );

  return (
    <div className="p-0 bg-white dark:bg-gray-800 rounded-2xl transition-colors">

      {/* 🎯 Bộ lọc */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div className="flex flex-col mb-4">
          <label className="text-gray-900 dark:text-gray-100 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by title or description..."
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

      {/* 🧾 Bảng */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
            {renderTableHead()}
          </thead>
          {renderTableBody()}
        </table>
      </div>

      {/* 📄 Pagination */}
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

      {/* 🔍 Modal */}
      <TicketModal
        ticket={isModalOpen ? selectedTicket : null}
        onClose={() => {
          setSelectedTicket(null);
          setIsModalOpen(false);
        }}
        {...modalProps}
      />

      {/* ❌ Form Reject */}
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
                handleReject?.(selectedTicket.id, reason);
                setIsReasonFormOpen(false);
              }}
              onCancel={() => setIsReasonFormOpen(false)}
              {...reasonFormProps}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketTableBase;
