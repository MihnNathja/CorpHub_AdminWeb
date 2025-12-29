import React from "react";
import { useTickets } from "../../hooks/useTickets";
import { useUser } from "../../../user/hooks/useUser";
import TicketTableBase from "../TicketTableBase";
import TicketReceivedTableBody from "./TicketReceivedTableBody";
import { User, FileText, Tag, CheckCircle, AlertCircle, Users, Calendar, Eye } from "lucide-react";

const TicketReceivedTable = () => {
  const props = useTickets("received");
  const { list: users } = useUser();

  const headerConfig = [
    { icon: User, label: "Requester", width: "w-32" },
    { icon: FileText, label: "Title", width: "w-48" },
    { icon: Tag, label: "Category", width: "w-28" },
    { icon: CheckCircle, label: "Status", width: "w-28" },
    { icon: AlertCircle, label: "Priority", width: "w-24" },
    { icon: Users, label: "Assignee", width: "w-32" },
    { icon: Calendar, label: "Created At", width: "w-32" },
    { icon: Eye, label: "Action", width: "w-16" },
  ];


  return (
    <TicketTableBase
      title="Received Tickets"
      {...props}
      renderTableHead={() => (
        <tr>
          {headerConfig.map((header, idx) => {
            const Icon = header.icon;
            return (
              <th
                key={idx}
                className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span>{header.label}</span>
                </div>
              </th>
            );
          })}
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
        mode: "received",
        handleAssign: props.handleAssign,
        handleReject: props.handleReject,
        handleComplete: props.handleComplete,
        setIsReasonFormOpen: props.setIsReasonFormOpen,
      }}
    />
  );
};

export default TicketReceivedTable;
