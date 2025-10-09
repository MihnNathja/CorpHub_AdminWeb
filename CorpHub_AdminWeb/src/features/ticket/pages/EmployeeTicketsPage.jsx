import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import TicketCard from "../components/TicketCard";
import { useTickets } from "../hooks/useTickets";
import Pagination from "../../global/components/Pagination";
import { statusColors } from "../../global/const/statusColors";
import TicketModal from "../components/TicketModal";
import FloatingButton from "../../global/components/FloatingButton";
import { PlusIcon } from "lucide-react";
import AddTicketModal from "../components/AddTicketModal";
import { useAttachments } from "../hooks/useAttachment";

const TicketsPage = () => {
  // 🟢 Tab hiện tại: Assigned (isRequester=false) hoặc Sent (isRequester=true)
  const [activeTab, setActiveTab] = useState("sent");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  // 🧠 Hook tickets (đã có phân trang, filter, modal, v.v.)
  const {
    tickets,
    users,
    loading,
    error,
    page,
    totalPages,
    setPage,
    selectedTicket,
    setSelectedTicket,
    isRequester,
    setIsRequester,
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

  // 🟢 Khi đổi tab → cập nhật vai trò để backend lọc đúng
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsRequester(tab === "sent"); // nếu là "sent" → true, còn "assigned" → false
    setPage(0);
    setStatusFilter("ALL");
  };

  // 🔹 Đếm số lượng vé theo trạng thái (FE count)
  const statusCounts = useMemo(() => {
    return tickets.reduce((acc, t) => {
      const key = t.status?.toUpperCase() || "UNKNOWN";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [tickets]);

  // 🔹 Lọc vé theo trạng thái (nếu cần)
  const filteredTickets = useMemo(() => {
    if (statusFilter === "ALL") return tickets;
    return tickets.filter((t) => t.status?.toUpperCase() === statusFilter);
  }, [tickets, statusFilter]);

  const mainTabs = [
    { key: "sent", label: "Sent" },
    { key: "assigned", label: "Assigned" },
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
        <p className="text-gray-500 dark:text-gray-300">
          Loading tickets...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-red-500">
        Failed to load tickets: {error.message || error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner p-6">
      {/* ➕ Nút thêm ticket */}
      <FloatingButton
        onClick={() => setIsAddModalOpen(true)}
        icon={PlusIcon}
        tooltip="New ticket"
        color="green"
      />

      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        My Tickets
      </h2>

      {/* Tabs chính */}
      <div className="flex">
        {mainTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === tab.key
              ? "bg-gray-100 dark:bg-gray-800 border-x border-t border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Nội dung */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg p-4 -mt-px bg-gray-100 dark:bg-gray-800/80">
        {/* Tabs con (lọc trạng thái) */}
        <div className="flex flex-wrap gap-2 mb-4">
          {statusTabs.map((status) => {
            const statusKey = status.toUpperCase();
            const active = statusFilter === status;
            const statusClass =
              statusColors[statusKey] || "bg-gray-300 text-gray-700";
            const count =
              status === "ALL"
                ? tickets.length
                : statusCounts[statusKey] || 0;

            return (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(0);
                }}
                className={`px-3 py-1 text-sm rounded-full border flex items-center gap-1 transition-colors ${active
                  ? `${statusClass} border-transparent`
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
              >
                <span>{status}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${active
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
            No tickets found with status {statusFilter}.
          </p>
        )}
      </div>

      {/* Pagination */}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />

      {/* Modal chi tiết ticket */}
      <TicketModal
        ticket={selectedTicket}
        users={users}
        onClose={() => setSelectedTicket(null)}
        onEdit={() => {
          setIsAddModalOpen(true);
        }}
        handleAssign={handleAssign}
        handleAccept={handleAccept}
        handleReject={handleReject}
        handleComplete={handleComplete}
        handleRemove={handleRemove}
        isReasonFormOpen={isReasonFormOpen}
        setIsReasonFormOpen={setIsReasonFormOpen}
        mode="my"
      />

      {/* Modal thêm/sửa ticket */}
      <AddTicketModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTicket(null);
        }}
        error={error}
        ticket={editingTicket}
        onSubmit={async (formData) => {
          try {
            const ticketData = {
              id: formData.id,
              title: formData.title,
              departmentId: formData.departmentId,
              priority: formData.priority,
              categoryId: formData.categoryId,
              description: formData.description,
            };

            const createdTicket = await handleCreateOrUpdate(ticketData);

            if (formData.attachments?.length > 0) {
              await upload(createdTicket.id, formData.attachments);
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
