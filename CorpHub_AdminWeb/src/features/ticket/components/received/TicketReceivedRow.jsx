import React from "react";
import StatCard from "../../../global/components/StatCard";
import { statusColors } from "../../../global/const/statusColors";
import { priorityColors } from "../../../global/const/priorityColors";
import AssigneeSelect from "../../../global/components/AssigneeSelect";
import { Eye, Clock, FileText } from "lucide-react";

const TicketReceivedRow = ({
  ticket,
  users,
  editingId,
  setEditingId,
  handleAssign,
  setIsReasonFormOpen,
  setIsModalOpen,
  setSelectedTicket,
}) => {
  const createdDate = new Date(ticket.createdAt);
  const formattedDate = createdDate.toLocaleDateString("vi-VN");
  const formattedTime = createdDate.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <tr className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors duration-150 border-b border-gray-200 dark:border-gray-700/50">
      {/* Requester */}
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {ticket.requester.fullName}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {ticket.requester.email}
        </p>
      </td>

      {/* Title */}
      <td className="px-4 py-3">
        <div className="flex items-start gap-2">
          <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {ticket.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
              {ticket.description}
            </p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-3">
        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-100 border border-indigo-200 dark:border-indigo-800">
          {ticket.category.categoryName}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatCard label={ticket.status} colors={statusColors} className="w-28 h-8 text-xs" />
      </td>

      {/* Priority */}
      <td className="px-4 py-3">
        <StatCard label={ticket.priority} colors={priorityColors} className="w-24 h-8 text-xs" />
      </td>

      {/* Assignee */}
      <td className="px-4 py-3">
        <AssigneeSelect
          ticket={ticket}
          users={users}
          editingId={editingId}
          setEditingId={setEditingId}
          handleAssign={handleAssign}
          setIsReasonFormOpen={setIsReasonFormOpen}
          setSelectedTicket={setSelectedTicket}
        />
      </td>

      {/* Created Date */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4 text-gray-400" />
          <div className="text-xs">
            <p className="font-medium">{formattedDate}</p>
            <p className="text-gray-500 dark:text-gray-400">{formattedTime}</p>
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={() => {
            setSelectedTicket(ticket);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-blue-200 dark:border-blue-800/50 bg-blue-50/70 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-150 shadow-sm hover:shadow"
          title="View details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

export default TicketReceivedRow;
