import React from "react";
import TicketSentRow from "./TicketSentRow";

const TicketSentTableBody = ({ tickets, handleConfirmSend, handleRejectSend, setSelectedTicket }) => {
  return (
    <tbody>
      {tickets.map((ticket) => (
        <TicketSentRow
          key={ticket.id}
          ticket={ticket}
          handleConfirmSend={handleConfirmSend}
          handleRejectSend={handleRejectSend}
          setSelectedTicket={setSelectedTicket}
        />
      ))}
    </tbody>
  );
};

export default TicketSentTableBody;
