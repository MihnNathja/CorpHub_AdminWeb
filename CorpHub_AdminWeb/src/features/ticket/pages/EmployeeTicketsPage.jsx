import React, { useState, useMemo } from "react";
import { PlusIcon } from "lucide-react";
import { useTickets } from "../hooks/useTickets";
import TicketCard from "../components/TicketCard";
import TicketModal from "../components/TicketModal";
import AddTicketModal from "../components/AddTicketModal";
import FloatingButton from "../../global/components/FloatingButton";
import Pagination from "../../global/components/Pagination";
import { statusColors } from "../../global/const/statusColors";
import { useAttachments } from "../hooks/useAttachment";

const TicketsPage = () => {
  // 🟢 Tab hiện tại: Sent (isRequester=true) hoặc Assigned (isRequester=false)
  const [activeTab, setActiveTab] = useState("sent");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  // 🧠 Hook tickets — đã có filter, pagination, CRUD, modal
  const {
    tickets,
    users,
    loading,
    error,

    // Pagination
    page,
    setPage,
    totalPages,

    // Filters
    status,
    setStatus,
    isRequester,
    setIsRequester,

    // Modal & Selection
    selectedTicket,
    setSelectedTicket,
    isReasonFormOpen,
    setIsReasonFormOpen,

    // Actions
    handleAssign,
    handleAccept,
    handleReject,
    handleComplete,
    handleRemove,
    handleCreateOrUpdate,
  } = useTickets("my");

  const { upload } = useAttachments();

  // 🟢 Khi đổi tab → cập nhật vai trò để backend lọc đúng
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsRequester(tab === "sent");
    setPage(0);
    setStatus(""); // reset filter mỗi lần đổi tab
  };

  // 🔹 Tính tổng số vé theo trạng thái (phục vụ hiển thị badge)
  const statusCounts = useMemo(() => {
    return tickets.reduce((acc, t) => {
      const key = t.status?.toUpperCase() || "UNKNOWN";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [tickets]);

  // 🔹 Các tab chính (Sent/Assigned)
  const mainTabs = [
    { key: "sent", label: "My requests" },
    { key: "assigned", label: "My tasks" },
  ];

  // 🔹 Các trạng thái ticket
  const statusTabs = [
    "ALL",
    "OPEN",
    "WAITING",
    "ASSIGNING",
    "IN_PROGRESS",
    "DONE",
    "REJECTED",
  ];

  // =================== LOADING & ERROR ===================
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

  // =================== MAIN RENDER ===================
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner p-6">
      {/* ➕ Floating button */}
      <FloatingButton
        onClick={() => setIsAddModalOpen(true)}
        icon={PlusIcon}
        tooltip="New ticket"
        color="green"
      />

      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        My tickets
      </h2>

      {/* 🧭 Tabs chính (Sent / Assigned) */}
      <div className="flex border-b border-gray-300 dark:border-gray-700">
        {mainTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === tab.key
              ? "bg-white dark:bg-gray-800 border-x border-t border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg p-4 -mt-px bg-white dark:bg-gray-800">
        {/* Bộ lọc trạng thái */}
        <div className="flex flex-wrap gap-2 mb-4">
          {statusTabs.map((s) => {
            const key = s.toUpperCase();
            const active = status === key || (s === "ALL" && status === "");
            const statusClass = statusColors[key] || "bg-gray-300 text-gray-700";
            const count =
              s === "ALL" ? tickets.length : statusCounts[key] || 0;

            return (
              <button
                key={s}
                onClick={() => {
                  setStatus(s === "ALL" ? "" : key);
                  setPage(0);
                }}
                className={`px-3 py-1 text-sm rounded-full border flex items-center gap-1 transition-colors ${active
                  ? `${statusClass} border-transparent`
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
              >
                <span>{s}</span>
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
        {tickets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                setSelectedTicket={setSelectedTicket}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No tickets found with selected filter.
          </p>
        )}
      </div>


      {/* Pagination */}
      <div className="mt-6">
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>

      {/* Modal chi tiết ticket */}
      <TicketModal
        ticket={selectedTicket}
        users={users}
        onClose={() => setSelectedTicket(null)}
        onEdit={() => {
          setEditingTicket(selectedTicket);
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

      {/* Modal thêm / sửa ticket */}
      <AddTicketModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTicket(null);
        }}
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

            const result = await handleCreateOrUpdate(ticketData);

            if (result.success && formData.attachments?.length > 0) {
              await upload(result.id, formData.attachments);
            }

            if (result.validationErrors) {
              console.log("hello");
              return result;
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
