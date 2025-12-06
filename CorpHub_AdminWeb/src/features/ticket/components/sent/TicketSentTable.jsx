import React from "react";
import { useTickets } from "../../hooks/useTickets";
import TicketTableBase from "../TicketTableBase";
import TicketSentTableBody from "./TicketSentTableBody";
import { Building2, FileText, Tag, CheckCircle, AlertCircle, User, Calendar, Zap, Eye } from "lucide-react";

const TicketSentTable = () => {
  const props = useTickets("sent");

  const headerConfig = [
    { icon: Building2, label: "Department" },
    { icon: FileText, label: "Title" },
    { icon: Tag, label: "Category" },
    { icon: CheckCircle, label: "Status" },
    { icon: AlertCircle, label: "Priority" },
    { icon: User, label: "Requester" },
    { icon: Calendar, label: "Created At" },
    { icon: Zap, label: "Action" },
    { icon: Eye, label: "View" },
  ];

  return (
    <TicketTableBase
      title="Sent Tickets"
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
        handleConfirmSend: props.handleConfirmSend,
        handleReject: props.handleReject,
        setIsReasonFormOpen: props.setIsReasonFormOpen,
      }}
    />
  );
};

export default TicketSentTable;
