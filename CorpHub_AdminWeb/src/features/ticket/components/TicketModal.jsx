import React, { useEffect, useState } from "react";
import { priorityColors } from "../../global/const/priorityColors";
import { statusColors } from "../../global/const/statusColors";
import StatCard from "../../global/components/StatCard";
import {
  User,
  Building2,
  Tag,
  CalendarClock,
  CalendarCheck,
  X,
  Layers,
  Info,
  Pencil,
  Phone,
  MessageSquare,
  Paperclip,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import TicketActionGroupEmp from "./TicketActionGroupEmp";
import ReasonForm from "./ReasonForm";
import CommentSection from "./comment/CommentSection";
import { useComment } from "../hooks/useComment";
import ConfirmDialog from "../../global/components/ConfirmDialog";
import { useAttachments } from "../hooks/useAttachment";
import TicketAttachments from "./TicketAttachments";
import { useUser } from "../../user/hooks/useUser";
import { useNavigate } from "react-router-dom";
import EditButton from "../../global/components/button/EditButton";
import RejectButton from "../../global/components/button/RejectButton";
import CompleteButton from "../../global/components/button/CompleteButton";

const TicketModal = ({
  ticket,
  onClose,
  onEdit,
  handleAssign,
  handleAccept,
  handleReject,
  handleComplete,
  handleRemove,
  isReasonFormOpen,
  setIsReasonFormOpen,
  mode,
}) => {
  if (!ticket) return null;

  const { user } = useAuth();
  const isCurrentUserAssignee =
    ticket.assignee && user && ticket.assignee.id === user.id;

  const isOwner = ticket.requester && user && ticket.requester.id === user.id;
  const { comments, addComment } = useComment(ticket.id);
  const { items: attachments, load, remove, download } = useAttachments();

  const { employees: users } = useUser();
  const navigate = useNavigate();

  const handleCreateUser = () => {
    navigate(`/users?tab=add&ticketId=${ticket.id}&bulk=true`);
  };

  useEffect(() => {
    if (ticket?.id) {
      load(ticket.id);
    }
  }, [ticket, load]);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div
          className={`flex justify-between items-start p-6 border-b border-gray-200 dark:border-gray-800 ${
            statusColors[ticket.status]
          }`}
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Info className="w-5 h-5" />
              <h2 className="text-xl font-bold">{ticket.title}</h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                #{ticket.id?.slice(0, 8)}
              </span>
              <StatCard
                label={ticket.priority}
                colors={priorityColors}
                className="px-3 py-1 text-xs"
              />
              <StatCard
                label={ticket.status}
                colors={statusColors}
                className="px-3 py-1 text-xs"
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="lg:col-span-1 space-y-4">
              {/* Ticket Info Card */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  Ticket Information
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      ID:
                    </span>
                    <code className="font-mono text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      {ticket.id}
                    </code>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Department:
                    </span>
                    <span className="font-medium">
                      {ticket.department?.name || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Category:
                    </span>
                    <span className="font-medium">
                      {ticket.category?.categoryName || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Requester:
                    </span>
                    <span className="font-medium">
                      {ticket.requester?.fullName || "Anonymous"}
                    </span>
                  </div>

                  {ticket.requester?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Contact:
                      </span>
                      <a
                        href={`tel:${ticket.requester.phone}`}
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {ticket.requester.phone}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Created:
                    </span>
                    <span className="text-xs">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Updated:
                    </span>
                    <span className="text-xs">
                      {new Date(ticket.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assignee Card */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-3">
                <label className="flex items-center gap-2 font-semibold text-sm text-gray-900 dark:text-white">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Assignee
                </label>
                <select
                  value={ticket.assignee?.id || ""}
                  onChange={(e) => {
                    handleAssign(ticket.id, e.target.value);
                    onClose();
                  }}
                  disabled={
                    !(mode === "received" && ticket.status === "WAITING")
                  }
                  className={`w-full border rounded-lg px-3 py-2 text-sm transition-colors
                    dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
                    focus:ring-2 focus:ring-blue-500 focus:outline-none
                    ${
                      !(mode === "received" && ticket.status === "WAITING")
                        ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed opacity-60"
                        : "bg-white hover:border-blue-400 dark:hover:border-blue-500"
                    }`}
                >
                  <option value="">Not Assigned</option>
                  {ticket.assignee &&
                    !users.some((u) => u.id === ticket.assignee.id) && (
                      <option value={ticket.assignee.id}>
                        {ticket.assignee.fullName}
                      </option>
                    )}
                  {users?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName}
                    </option>
                  ))}
                </select>
                {ticket.assignee?.phone && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <Phone className="w-3 h-3" />
                    {ticket.assignee.phone}
                  </div>
                )}
              </div>

              {/* Attachments */}
              <TicketAttachments
                ticket={ticket}
                attachments={attachments}
                onDownload={download}
                mode="view"
              />
            </div>

            {/* Right Column - Description & Comments */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description Card */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  Description
                </h3>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm leading-relaxed overflow-y-auto max-h-[200px]">
                  {ticket.description}
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  Comments
                </h3>
                <CommentSection
                  comments={comments}
                  onAddComment={(text) => addComment(text)}
                  onReplyComment={(parentId, text) =>
                    addComment(text, parentId)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Last updated: {new Date(ticket.updatedAt).toLocaleString()}
          </div>

          <div className="flex gap-2 flex-wrap justify-end">
            {ticket.status === "OPEN" && isOwner && (
              <button
                onClick={() => onEdit?.(ticket)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            )}

            {(isCurrentUserAssignee && ticket.status === "IN_PROGRESS") ||
            (isOwner &&
              ticket.status !== "REJECTED" &&
              ticket.status !== "DONE") ? (
              <button
                onClick={() => {
                  handleComplete(ticket.id);
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition"
              >
                <CheckCircle className="w-4 h-4" />
                Complete
              </button>
            ) : isCurrentUserAssignee ? (
              <TicketActionGroupEmp
                status={ticket.status}
                onAccept={() => handleAccept(ticket.id)}
                onReject={() => setIsReasonFormOpen(true)}
              />
            ) : (user?.role === "ROLE_MANAGER" ||
                user?.role === "ROLE_ADMIN") &&
              ticket.status === "WAITING" ? (
              <button
                onClick={() => setIsReasonFormOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            ) : null}

            {isOwner && (
              <button
                onClick={() => setIsConfirmOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}

            {ticket.category?.categoryName === "Account Request" && (
              <button
                onClick={handleCreateUser}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition"
              >
                <Plus className="w-4 h-4" />
                Create Account
              </button>
            )}
          </div>
        </div>

        {/* Reject Reason Modal */}
        {isReasonFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <ReasonForm
                ticket={ticket}
                mode="reject"
                title="Reject Ticket"
                quickReasons={[
                  "Insufficient information",
                  "Not enough evidence",
                  "Out of scope",
                  "Duplicate request",
                ]}
                onSubmit={(reason) => {
                  handleReject(ticket.id, reason);
                  setIsReasonFormOpen(false);
                }}
                onCancel={() => setIsReasonFormOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={isConfirmOpen}
          title="Delete Ticket"
          message="Are you sure you want to delete this ticket? This action cannot be undone."
          onConfirm={() => {
            handleRemove(ticket.id);
            setIsConfirmOpen(false);
            onClose();
          }}
          onCancel={() => setIsConfirmOpen(false)}
        />
      </div>
    </div>
  );
};

export default TicketModal;
