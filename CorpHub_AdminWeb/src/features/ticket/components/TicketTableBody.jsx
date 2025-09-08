import React from "react";
import TicketRow from "./TicketRow";

const TicketTableBody = ({
  tickets,
  users,
  editingId,
  setEditingId,
  handleAssign,
  handleConfirmSend,
  handleRejectSend,
  setSelectedTicket,
  mode
}) => {
  return (
    <tbody>
      {tickets.map((ticket) => (
        <TicketRow
          key={ticket.id}
          ticket={ticket}
          users={users}
          editingId={editingId}
          setEditingId={setEditingId}
          handleAssign={handleAssign}
          handleConfirmSend={handleConfirmSend}
          handleRejectSend={handleRejectSend}
          setSelectedTicket={setSelectedTicket}
          mode={mode}
        />
      ))}
    </tbody>
  );
};

export default TicketTableBody;
