import React from "react";
import TicketSentRow from "./TicketSentRow";

const TicketSentTableBody = ({
  tickets,
  handleConfirmSend,
  setSelectedTicket,
  setIsReasonFormOpen,
  setIsModalOpen
}) => {
  return (
    <>
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
    </>
  );
};

export default TicketSentTableBody;
