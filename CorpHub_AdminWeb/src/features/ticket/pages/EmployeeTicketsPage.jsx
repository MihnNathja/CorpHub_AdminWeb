import React, { useState } from "react";
import {
  PlusIcon,
  Mail,
  ClipboardList,
  Loader2,
  AlertCircle,
  Inbox,
  Search,
  Filter,
  Calendar,
} from "lucide-react";
import { useTickets } from "../hooks/useTickets";
import TicketCard from "../components/TicketCard";
import TicketModal from "../components/TicketModal";
import AddTicketModal from "../components/AddTicketModal";
import FloatingButton from "../../global/components/FloatingButton";
import Pagination from "../../global/components/Pagination";
import { statusColors } from "../../global/const/statusColors";
import { priorityColors } from "../../global/const/priorityColors";
import TicketFilter from "../components/AdminTicketFilter";
import { useAttachments } from "../hooks/useAttachment";

const TicketsPage = () => {
  const [activeTab, setActiveTab] = useState("sent");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  const {
    tickets,
    users,
    loading,
    error,
    page,
    setPage,
    totalPages,
    status,
    setStatus,
    size,
    setSize,
    isRequester,
    setIsRequester,
    priority,
    setPriority,
    from,
    setFrom,
    to,
    setTo,
    keyword,
    setKeyword,
    selectedTicket,
    setSelectedTicket,
    isReasonFormOpen,
    setIsReasonFormOpen,
    handleAssign,
    handleAccept,
    handleReject,
    handleComplete,
    handleRemove,
    handleCreateOrUpdate,
  } = useTickets("my");

  const { upload } = useAttachments();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsRequester(tab === "sent");
    setPage(0);
    setStatus("");
    setKeyword("");
    setPriority("");
    setFrom("");
    setTo("");
  };

  const mainTabs = [
    { key: "sent", label: "My requests", icon: Mail },
    { key: "assigned", label: "My tasks", icon: ClipboardList },
  ];

  // Filters panel similar to TicketTableBase

  if (error) {
    return (
      <div className="min-h-[320px] flex flex-col items-center justify-center gap-2 text-center">
        <AlertCircle className="w-10 h-10 text-rose-500" />
        <p className="text-rose-600 dark:text-rose-400 font-semibold">Failed to load tickets</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{error.message || String(error)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FloatingButton
        onClick={() => setIsAddModalOpen(true)}
        icon={PlusIcon}
        tooltip="New ticket"
        color="green"
      />

      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg border border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-white/80">Support Center</p>
            <h1 className="text-2xl font-bold leading-tight">My tickets</h1>
            <p className="text-sm text-white/80 mt-1">Track your submitted and assigned tickets</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex gap-2 px-4 pt-4">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
                  ${active
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-800 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filter Panel */}
        <div className="border-b border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Filters</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            </div>

            {/* Status Filter */}
            <div>
              <TicketFilter
                name="Status"
                filter={status}
                setFilter={setStatus}
                colors={statusColors}
              />
            </div>

            {/* Priority Filter */}
            <div>
              <TicketFilter
                name="Priority"
                filter={priority}
                setFilter={setPriority}
                colors={priorityColors}
              />
            </div>

            {/* From Date */}
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            </div>

            {/* To Date */}
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          {tickets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  setSelectedTicket={setSelectedTicket}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center gap-3 text-center text-gray-500 dark:text-gray-400">
              <Inbox className="w-12 h-12" />
              <p className="font-semibold">No tickets found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Try another status or create a new ticket.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between flex-wrap gap-3">
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Rows per page:
            </label>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-2 py-1 text-xs focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            >
              {[5, 10, 20, 50].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

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
            if (result.validationErrors) return result;

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
