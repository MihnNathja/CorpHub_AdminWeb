import React from "react";
import TicketReceivedRow from "./TicketReceivedRow";

const TicketReceivedTableBody = ({ tickets, users, editingId, setEditingId, handleAssign, setIsReasonFormOpen, setIsModalOpen, setSelectedTicket }) => {
  return (
    <tbody>
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
    </tbody>
  );
};

export default TicketReceivedTableBody;
