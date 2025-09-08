import React from "react";

const TicketSentRow = ({ ticket, handleConfirmSend, handleRejectSend, setSelectedTicket }) => {
  return (
    <tr className="hover:bg-gray-100">
      <td className="border px-4 py-2">{ticket.department.description}</td>
      <td className="border px-4 py-2">{ticket.title}</td>
      <td className="border px-4 py-2">{ticket.description}</td>
      <td className="border px-4 py-2">{ticket.category.categoryName}</td>
      <td className="border px-4 py-2">{ticket.status}</td>
      <td className="border px-4 py-2">{ticket.priority}</td>
      <td className="border px-4 py-2">{ticket.requester?.fullName || "Ẩn danh"}</td>
      <td className="border px-4 py-2">{new Date(ticket.createdAt).toLocaleString()}</td>
      <td className="border px-4 py-2 flex justify-center gap-2">
        {ticket.status === "open" ? (
          <>
            <button
              onClick={() => handleConfirmSend(ticket.id)}
              className="min-w-[80px] h-9 px-3 py-1 rounded-lg bg-green-500 text-white font-medium 
                        hover:bg-green-600 shadow-sm transition"
            >
              Confirm
            </button>
            <button
              onClick={() => handleRejectSend(ticket.id)}
              className="min-w-[80px] h-9 px-3 py-1 rounded-lg bg-red-500 text-white font-medium 
                        hover:bg-red-600 shadow-sm transition"
            >
              Reject
            </button>
          </>
        ) : (
          <button
            onClick={() => setSelectedTicket(ticket)}
            className="min-w-[80px] h-9 px-3 py-1 rounded-lg bg-blue-500 text-white font-medium 
                      hover:bg-blue-600 shadow-sm transition"
          >
            View
          </button>
        )}
      </td>
    </tr>
  );
};

export default TicketSentRow;
