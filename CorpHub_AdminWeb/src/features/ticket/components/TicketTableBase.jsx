import React from "react";
import TicketModal from "./TicketModal";
import ReasonDialog from "../../../components/ReasonDialog";
import { statusColors } from "../../global/const/statusColors";
import { priorityColors } from "../../global/const/priorityColors";
import Pagination from "../../global/components/Pagination";
import TicketFilter from "./AdminTicketFilter";
import { Search, Filter, Calendar, AlertCircle } from "lucide-react";

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
  handleAccept,
  handleRemove,
  modalProps = {},
  reasonFormProps = {},

  // Custom body render
  renderTableHead,
  renderTableBody,
}) => {
  if (error)
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-red-500 dark:text-red-400 mb-3" />
        <p className="text-lg font-semibold text-red-600 dark:text-red-400">
          Failed to load tickets
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {error.message || error}
        </p>
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
      {/* Filter Panel */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
            Filters
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          {/* Status Filter */}
          <div>
            <TicketFilter
              name="Status"
              filter={status}
              setFilter={setStatus}
              colors={statusColors}
            />
          </div>

          {/* Priority Filter */}
          <div>
            <TicketFilter
              name="Priority"
              filter={priority}
              setFilter={setPriority}
              colors={priorityColors}
            />
          </div>

          {/* From Date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          {/* To Date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!loading && tickets?.length === 0 && (
        <div className="p-12 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            No tickets found
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}

      {/* Table */}
      {tickets?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 uppercase text-xs font-semibold border-b border-gray-200 dark:border-gray-700">
              {renderTableHead()}
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {renderTableBody()}
            </tbody>
          </table>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-3">
            Loading tickets...
          </p>
        </div>
      )}

      {/* Footer: Pagination + Size */}
      {tickets?.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between flex-wrap gap-3">
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Rows per page:
            </label>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-2 py-1 text-xs focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            >
              {[5, 10, 20, 50].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      <TicketModal
        ticket={isModalOpen ? selectedTicket : null}
        onClose={() => {
          setSelectedTicket(null);
          setIsModalOpen(false);
        }}
        handleAccept={handleAccept}
        handleRemove={handleRemove}
        {...modalProps}
      />

      {/* Reject Reason Dialog */}
      <ReasonDialog
        open={isReasonFormOpen && !!selectedTicket}
        onClose={() => setIsReasonFormOpen(false)}
        onAction={(reason) => {
          handleReject?.(selectedTicket.id, reason);
          setIsReasonFormOpen(false);
        }}
        isAcceptDialog={false}
        title="Rejection confirmation"
      />
    </div>
  );
};

export default TicketTableBase;
