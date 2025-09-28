import React from "react";
import TicketSentRow from "./TicketSentRow";

const TicketSentTableBody = ({ tickets, handleConfirmSend, setSelectedTicket,
  setIsReasonFormOpen,
  setIsModalOpen }) => {
  return (
    <tbody>
      {tickets.map((ticket) => (
        <TicketSentRow
          key={ticket.id}
          ticket={ticket}
          handleConfirmSend={handleConfirmSend}
          setSelectedTicket={setSelectedTicket}
          setIsReasonFormOpen={setIsReasonFormOpen}
          setIsModalOpen={setIsModalOpen}
        />
      ))}
    </tbody>
  );
};

export default TicketSentTableBody;
