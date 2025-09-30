import React from "react";
import StatCard from "../../../global/components/StatCard";
import { statusColors } from "../../../global/const/statusColors";
import { priorityColors } from "../../../global/const/priorityColors";
import AssigneeSelect from "../../../global/components/AssigneeSelect";
import { EyeIcon } from "lucide-react";

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
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.requester.fullName}</td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.title}</td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.description}</td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.category.categoryName}</td>
      <td className="px-4 py-2">
        <StatCard label={ticket.status} colors={statusColors} className="w-24 h-8 text-sm" />
      </td>
      <td className="px-4 py-2">
        <StatCard label={ticket.priority} colors={priorityColors} className="w-24 h-8 text-sm" />
      </td>
      <td className="px-4 py-2">
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
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">
        {new Date(ticket.createdAt).toLocaleString()}
      </td>
      <td className="px-4 py-2">
        <button
          type="button"
          onClick={() => {
            setSelectedTicket(ticket);
            setIsModalOpen(true);
          }}
          className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md
      bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 transition`}
        >
          <EyeIcon className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
};

export default TicketReceivedRow;
