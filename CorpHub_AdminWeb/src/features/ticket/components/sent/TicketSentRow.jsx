import React from "react";
import StatCard from "../../../global/components/StatCard";
import { statusColors } from "../../../global/const/statusColors";
import { priorityColors } from "../../../global/const/priorityColors";
import ButtonOutline from "../../../global/components/ButtonOutline";

const TicketSentRow = ({ ticket, handleConfirmSend, handleRejectSend, setSelectedTicket }) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.department.description}</td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.title}</td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.description}</td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.category.categoryName}</td>
      <td className="px-4 py-2">
        <StatCard label={ticket.status} colors={statusColors} className="w-24 h-8 text-sm" />
      </td>
      <td className="px-4 py-2">
        <StatCard label={ticket.priority} colors={priorityColors} className="w-24 h-8 text-sm" />
      </td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.requester?.fullName || "Ẩn danh"}</td>
      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{new Date(ticket.createdAt).toLocaleString()}</td>
      <td className="px-4 py-2 flex justify-center gap-2">
        {ticket.status === "OPEN" ? (
          <>
            <ButtonOutline onClick={() => handleConfirmSend(ticket.id)} color="green">
              Confirm
            </ButtonOutline>
            <ButtonOutline onClick={() => handleRejectSend(ticket.id)} color="red">
              Reject
            </ButtonOutline>
          </>
        ) : null}
            <ButtonOutline onClick={() => setSelectedTicket(ticket)} color="blue">
            View
          </ButtonOutline>
      </td>

    </tr>
  );
};

export default TicketSentRow;
