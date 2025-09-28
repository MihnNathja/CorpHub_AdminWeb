import React from "react";
import TicketReceivedRow from "./TicketReceivedRow";

const TicketReceivedTableBody = ({ tickets, users, editingId, setEditingId, handleAssign, setIsModalOpen, setSelectedTicket }) => {
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
          setIsModalOpen={setIsModalOpen}
          setSelectedTicket={setSelectedTicket}
        />
      ))}
    </tbody>
  );
};

export default TicketReceivedTableBody;
