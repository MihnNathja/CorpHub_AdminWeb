import React, { useState, useMemo } from "react";
import TicketCard from "../components/TicketCard";
import { useTickets } from "../hooks/useTickets";
import { useSelector } from "react-redux";
import Pagination from "../../global/components/Pagination";
import { statusColors } from "../../global/const/statusColors";
import TicketModal from "../components/TicketModal";
import FloatingButton from "../../global/components/FloatingButton";
import { PlusIcon } from "lucide-react";
import AddTicketModal from "../components/AddTicketModal";
import { useAttachments } from "../hooks/useAttachment";

const TicketsPage = () => {
  const [activeTab, setActiveTab] = useState("assigned");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const currentUser = useSelector((state) => state.auth.user);

  const {
    tickets,
    users,
    loading,
    page,
    totalPages,
    setPage,
    selectedTicket,
    setSelectedTicket,
    handleAssign,
    handleAccept,
    handleReject,
    handleComplete,
    handleRemove,
    isReasonFormOpen,
    setIsReasonFormOpen,
    handleCreateOrUpdate,
  } = useTickets("my");

  const { upload } = useAttachments();

  // lọc theo assignee / requester
  const assignedTickets = useMemo(
    () => tickets.filter((t) => t.assignee?.id === currentUser?.id),
    [tickets, currentUser]
  );
  const sentTickets = useMemo(
    () => tickets.filter((t) => t.requester?.id === currentUser?.id),
    [tickets, currentUser]
  );
  const ticketsByTab = activeTab === "assigned" ? assignedTickets : sentTickets;

  // Đếm số lượng theo trạng thái
  const statusCounts = useMemo(() => {
    return ticketsByTab.reduce((acc, t) => {
      const key = t.status?.toUpperCase() || "UNKNOWN";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [ticketsByTab]);

  const filteredTickets = useMemo(() => {
    if (statusFilter === "ALL") return ticketsByTab;
    return ticketsByTab.filter((t) => t.status?.toUpperCase() === statusFilter);
  }, [ticketsByTab, statusFilter]);

  const mainTabs = [
    { key: "assigned", label: "Được phân công" },
    { key: "sent", label: "Đã gửi đi" },
  ];

  const statusTabs = [
    "ALL",
    "OPEN",
    "WAITING",
    "ASSIGNING",
    "IN_PROGRESS",
    "DONE",
    "REJECTED",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-gray-500 dark:text-gray-300">Đang tải ticket...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner p-6">
      <FloatingButton
        onClick={() => setIsAddModalOpen(true)}
        icon={PlusIcon}
        tooltip="Thêm ticket"
        color="green"
      />

      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Quản lý Ticket
      </h2>

      {/* Tabs chính */}
      <div className="flex">
        {mainTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setStatusFilter("ALL");
              setPage(1);
            }}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
              activeTab === tab.key
                ? "bg-gray-100 dark:bg-gray-800 border-x border-t border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {tab.label} (
            {tab.key === "assigned"
              ? assignedTickets.length
              : sentTickets.length}
            )
          </button>
        ))}
      </div>

      {/* Nội dung */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg p-4 -mt-px bg-gray-100 dark:bg-gray-800/80">
        {/* Tabs con */}
        <div className="flex flex-wrap gap-2 mb-4">
          {statusTabs.map((status) => {
            const statusKey = status.toUpperCase();
            const active = statusFilter === status;
            const statusClass =
              statusColors[statusKey] || "bg-gray-300 text-gray-700";

            const count =
              status === "ALL"
                ? ticketsByTab.length
                : statusCounts[statusKey] || 0;

            return (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`px-3 py-1 text-sm rounded-full border flex items-center gap-1 transition-colors ${
                  active
                    ? `${statusClass} border-transparent`
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <span>{status === "ALL" ? "Tất cả" : status}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    active
                      ? "bg-white/30"
                      : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Danh sách ticket */}
        {filteredTickets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                setSelectedTicket={setSelectedTicket}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
            Không tìm thấy ticket nào với trạng thái {statusFilter}.
          </p>
        )}
      </div>

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />

      <TicketModal
        ticket={selectedTicket}
        users={users}
        onClose={() => setSelectedTicket(null)}
        onEdit={(ticket) => {
          setEditingTicket(ticket);
          setIsAddModalOpen(true);
          setSelectedTicket(null);
        }}
        handleAssign={handleAssign}
        handleAccept={async (ticketId) => {
          await handleAccept(ticketId);
          setSelectedTicket(null);
        }}
        handleReject={async (ticketId, reason) => {
          await handleReject(ticketId, reason);
          setSelectedTicket(null);
        }}
        handleComplete={handleComplete}
        handleRemove={handleRemove}
        isReasonFormOpen={isReasonFormOpen}
        setIsReasonFormOpen={setIsReasonFormOpen}
        mode="my"
      />

      <AddTicketModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTicket(null);
        }}
        ticket={editingTicket}
        onSubmit={async (formData) => {
          try {
            // 1. Gọi API tạo hoặc update ticket
            const ticketData = {
              id: formData.id,
              title: formData.title,
              departmentId: formData.departmentId,
              priority: formData.priority,
              categoryId: formData.categoryId,
              description: formData.description,
            };

            const createdTicket = await handleCreateOrUpdate(ticketData);
            //console.log("Created ticket", createdTicket);

            // 2. Upload file bằng hook useAttachments
            if (formData.attachments && formData.attachments.length > 0) {
              //console.log("Upload attachment id: ", createdTicket.id);
              await upload(createdTicket.id, formData.attachments);
              //console.log("Upload attachment");
            }

            setIsAddModalOpen(false);
            setEditingTicket(null);
          } catch (err) {
            console.error("Error saving ticket:", err);
          }
        }}
      />
    </div>
  );
};

export default TicketsPage;
