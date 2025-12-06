import React from "react";
import StatCard from "../../../global/components/StatCard";
import { statusColors } from "../../../global/const/statusColors";
import { priorityColors } from "../../../global/const/priorityColors";
import TicketActionGroup from "../TicketActionGroup";
import { Eye, Building2, FileText, Tag, Clock, User } from "lucide-react";

const TicketSentRow = ({
  ticket,
  handleConfirmSend,
  setSelectedTicket,
  setIsReasonFormOpen,
  setIsModalOpen,
}) => {
  const formattedDate = new Date(ticket.createdAt).toLocaleDateString("vi-VN");
  const formattedTime = new Date(ticket.createdAt).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <tr className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors duration-150 border-b border-gray-200 dark:border-gray-700/50">
      {/* Department */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {ticket.department?.description || "N/A"}
          </span>
        </div>
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
        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-100 border border-purple-200 dark:border-purple-800">
          <Tag className="w-3 h-3 mr-1" />
          {ticket.category?.categoryName || "N/A"}
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

      {/* Requester */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
            {ticket.requester?.fullName || "Ẩn danh"}
          </span>
        </div>
      </td>

      {/* Created At */}
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
        <TicketActionGroup
          status={ticket.status}
          onAccept={() => handleConfirmSend(ticket.id)}
          onReject={() => {
            setSelectedTicket(ticket);
            setIsReasonFormOpen(true);
          }}
        />
      </td>

      {/* View Button */}
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

export default TicketSentRow;
