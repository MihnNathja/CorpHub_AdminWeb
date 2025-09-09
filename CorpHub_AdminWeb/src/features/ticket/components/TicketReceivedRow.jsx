import React from "react";
import { statusColors } from "./StatCard";
import StatCard from "./StatCard";

const TicketReceivedRow = ({
  ticket,
  users,
  editingId,
  setEditingId,
  handleAssign,
  setSelectedTicket,
}) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.requester.fullName}</td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.title}</td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.description}</td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.category.categoryName}</td>
      <td className="px-4 py-2">
        <StatCard status={ticket.status} count={""} className="w-24 h-8 text-sm" />
      </td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.priority}</td>
      <td className="px-4 py-2">
        {editingId === ticket.id ? (
          <select
            value={ticket.assignee?.id || ""}
            onChange={(e) => handleAssign(ticket.id, e.target.value)}
            className="w-full p-1 rounded bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors"
          >
            <option value="">Chưa phân công</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <span>{ticket.assignee?.fullName || "Chưa phân công"}</span>
            <button
              onClick={() => setEditingId(ticket.id)}
              className="text-blue-500 dark:text-blue-400 hover:dark:text-blue-300 transition-colors"
            >
              ✏️
            </button>
          </div>
        )}
      </td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">
        {new Date(ticket.createdAt).toLocaleString()}
      </td>
      <td className="px-4 py-2 flex justify-center gap-2">
        <button
          onClick={() => setSelectedTicket(ticket)}
          className="min-w-[80px] h-9 px-3 py-1 rounded-lg bg-blue-500 dark:bg-blue-600 text-white font-medium 
                     hover:bg-blue-600 dark:hover:bg-blue-500 shadow-sm transition-colors"
        >
          View
        </button>
      </td>
    </tr>
  );
};

export default TicketReceivedRow;
