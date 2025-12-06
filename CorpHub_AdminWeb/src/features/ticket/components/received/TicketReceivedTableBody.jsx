import React from "react";
import TicketReceivedRow from "./TicketReceivedRow";
import { AlertCircle } from "lucide-react";

const TicketReceivedTableBody = ({
  tickets,
  users,
  editingId,
  setEditingId,
  handleAssign,
  setIsReasonFormOpen,
  setIsModalOpen,
  setSelectedTicket,
}) => {
  // Empty State
  if (!tickets || tickets.length === 0) {
    return (
      <>
        <tr>
          <td colSpan="9" className="px-4 py-12 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No tickets found
              </p>
            </div>
          </td>
        </tr>
      </>
    );
  }

  return (
    <>
      {tickets.map((ticket) => (
        <TicketReceivedRow
          key={ticket.id}
          ticket={ticket}
          users={users}
          editingId={editingId}
          setEditingId={setEditingId}
          handleAssign={handleAssign}
          setIsReasonFormOpen={setIsReasonFormOpen}
          setIsModalOpen={setIsModalOpen}
          setSelectedTicket={setSelectedTicket}
        />
      ))}
    </>
  );
};

export default TicketReceivedTableBody;
