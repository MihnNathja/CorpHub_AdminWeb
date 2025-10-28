import React from "react";
import { useTickets } from "../hooks/useTickets";
import TicketTableBase from "./TicketTableBase";
import TicketReceivedTableBody from "./received/TicketReceivedTableBody";
import { useUser } from "../../user/hooks/useUser";

const TicketAccountRequestTable = () => {
  const props = useTickets("account_request");
  const { employees: users } = useUser();

  return (
    <TicketTableBase
      title="Account Request Tickets"
      {...props}
      renderTableHead={() => (
        <tr>
          <th className="px-4 py-2">Requester</th>
          <th className="px-4 py-2">Title</th>
          <th className="px-4 py-2">Description</th>
          <th className="px-4 py-2">Category</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Priority</th>
          <th className="px-4 py-2">Assignee</th>
          <th className="px-4 py-2">Created At</th>
          <th className="px-4 py-2">View</th>
        </tr>
      )}
      renderTableBody={() => (
        <TicketReceivedTableBody
          tickets={props.tickets}
          users={users}
          editingId={props.editingId}
          setEditingId={props.setEditingId}
          handleAssign={props.handleAssign}
          setIsReasonFormOpen={props.setIsReasonFormOpen}
          setIsModalOpen={props.setIsModalOpen}
          setSelectedTicket={props.setSelectedTicket}
        />
      )}
      modalProps={{
        mode: "accountRequest",
        handleAssign: props.handleAssign,
        handleReject: props.handleReject,
        handleComplete: props.handleComplete,
        setIsReasonFormOpen: props.setIsReasonFormOpen,
      }}
    />
  );
};

export default TicketAccountRequestTable;
