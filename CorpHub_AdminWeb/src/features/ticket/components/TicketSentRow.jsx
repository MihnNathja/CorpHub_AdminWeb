import React from "react";
import StatCard from "./StatCard";

const TicketSentRow = ({ ticket, handleConfirmSend, handleRejectSend, setSelectedTicket }) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.department.description}</td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.title}</td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.description}</td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.category.categoryName}</td>
      <td className="px-4 py-2">
        <StatCard status={ticket.status} count={""} className="w-24 h-8 text-sm" />
      </td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.priority}</td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.requester?.fullName || "Ẩn danh"}</td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{new Date(ticket.createdAt).toLocaleString()}</td>
      <td className="px-4 py-2 flex justify-center gap-2">
        {ticket.status === "open" ? (
          <>
            <button
              onClick={() => handleConfirmSend(ticket.id)}
              className="min-w-[80px] h-9 px-3 py-1 rounded-lg bg-green-500 dark:bg-green-600 text-white font-medium 
                         hover:bg-green-600 dark:hover:bg-green-500 shadow-sm transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={() => handleRejectSend(ticket.id)}
              className="min-w-[80px] h-9 px-3 py-1 rounded-lg bg-red-500 dark:bg-red-600 text-white font-medium 
                         hover:bg-red-600 dark:hover:bg-red-500 shadow-sm transition-colors"
            >
              Reject
            </button>
          </>
        ) : (
          <button
            onClick={() => setSelectedTicket(ticket)}
            className="min-w-[80px] h-9 px-3 py-1 rounded-lg bg-blue-500 dark:bg-blue-600 text-white font-medium 
                       hover:bg-blue-600 dark:hover:bg-blue-500 shadow-sm transition-colors"
          >
            View
          </button>
        )}
      </td>
    </tr>
  );
};

export default TicketSentRow;
