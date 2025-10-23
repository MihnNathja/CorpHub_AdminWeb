import React from "react";
import { useTickets } from "../../hooks/useTickets";
import TicketTableBase from "../TicketTableBase";
import TicketSentTableBody from "./TicketSentTableBody";

const TicketSentTable = () => {
  const props = useTickets("sent");

  return (
    <TicketTableBase
      title="Sent Tickets"
      {...props}
      renderTableHead={() => (
        <tr>
          <th className="px-4 py-2">Department</th>
          <th className="px-4 py-2">Title</th>
          <th className="px-4 py-2">Description</th>
          <th className="px-4 py-2">Category</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Priority</th>
          <th className="px-4 py-2">Requester</th>
          <th className="px-4 py-2">Created At</th>
          <th className="px-4 py-2">Action</th>
          <th className="px-4 py-2">View</th>
        </tr>
      )}
      renderTableBody={() => (
        <TicketSentTableBody
          tickets={props.tickets}
          handleConfirmSend={props.handleConfirmSend}
          setSelectedTicket={props.setSelectedTicket}
          setIsReasonFormOpen={props.setIsReasonFormOpen}
          setIsModalOpen={props.setIsModalOpen}
        />
      )}
      modalProps={{
        mode: "sent",
      }}
    />
  );
};

export default TicketSentTable;
