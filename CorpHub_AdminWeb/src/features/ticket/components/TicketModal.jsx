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
    navigate(`/users?tab=add&ticketId=${ticket.id}`);
  };

  useEffect(() => {
    if (ticket?.id) {
      //console.log(ticket);
      load(ticket.id);
    }
  }, [ticket, load]);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 
                w-3/4 
                rounded-xl shadow-lg transition-colors"
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center p-4 rounded-t-xl ${statusColors[ticket.status]
            }`}
        >
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Info className="w-5 h-5" /> {ticket.title}
            </h2>
            <StatCard
              label={ticket.priority}
              colors={priorityColors}
              className="px-3 py-1 text-xs"
            />
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nội dung */}
        <div className="p-6 grid grid-cols-3 gap-6">
          {/* Cột trái */}
          <div className="space-y-4 col-span-1">
            <p className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <b>ID:</b> {ticket.id}
            </p>
            <p className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <b>Department:</b> {ticket.department?.name || "N/A"}
            </p>
            <p className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <b>Category:</b> {ticket.category?.categoryName || "N/A"}
            </p>
            <p className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <b>Requester:</b> {ticket.requester?.fullName || "Ẩn danh"}
            </p>
            {ticket.requester?.phone && (
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <b>Contact:</b> {ticket.requester.phone}
              </p>
            )}

            <p className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4" />
              <b>Created At:</b> {new Date(ticket.createdAt).toLocaleString()}
            </p>

            {/* Assignee */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <label className="flex items-center gap-2 font-semibold mb-2">
                <User className="w-4 h-4" /> Assignee
              </label>
              <select
                value={ticket.assignee?.id || ""}
                onChange={(e) => {
                  onClose();
                  // sau này sẽ làm reload lại thay vì tắt hẳn
                  handleAssign(ticket.id, e.target.value);
                }}
                disabled={!(mode === "received" && ticket.status === "WAITING")}
                className={`w-full border rounded-lg p-2 transition-colors
                  dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100
                  focus:ring-2 focus:ring-blue-500
                  ${!(mode === "received" && ticket.status === "WAITING")
                    ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                    : ""
                  }`}
              >
                <option value="">Chưa phân công</option>
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
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <Phone className="w-3 h-3" /> {ticket.assignee.phone}
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

          {/* Cột phải */}
          <div className="space-y-6 col-span-2">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 mt-1" />
              <div className="flex-1">
                <b>Description</b>
                <div
                  className="mt-2 border border-gray-300 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 whitespace-pre-line overflow-y-auto"
                  style={{ maxHeight: "200px" }}
                >
                  {ticket.description}
                </div>

                {/* Comment Section */}
                <CommentSection
                  comments={comments}
                  onAddComment={(text) => {
                    addComment(text);
                  }}
                  onReplyComment={(parentId, text) => {
                    addComment(text, parentId);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t dark:border-gray-700">
          <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CalendarCheck className="w-4 h-4" />
            Updated At: {new Date(ticket.updatedAt).toLocaleString()}
          </p>
          <div className="flex gap-3">
            {ticket.status === "OPEN" && isOwner && (
              <EditButton onClick={() => onEdit?.(ticket)} />
            )}

            {(isCurrentUserAssignee && ticket.status === "IN_PROGRESS") ||
            (isOwner &&
              ticket.status != "REJECTED" &&
              ticket.status != "DONE") ? (
              <CompleteButton
                onClick={() => {
                  onClose();
                  handleComplete(ticket.id);
                }}
              />
            ) : isCurrentUserAssignee ? (
              <TicketActionGroupEmp
                status={ticket.status}
                onAccept={() => handleAccept(ticket.id)}
                onReject={() => setIsReasonFormOpen(true)}
              />
            ) : (user.role === "ROLE_MANAGER" || user.role === "ROLE_ADMIN") &&
              ticket.status === "WAITING" ? (
              <RejectButton onClick={() => setIsReasonFormOpen(true)} />
            ) : null}

            {isOwner && (
              <button
                onClick={() => setIsConfirmOpen(true)}
                className="px-4 py-2 bg-red-500 dark:bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            )}
            {ticket.category.categoryName === "Account Request" && (
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Account
              </button>
            )}
          </div>
        </div>

        {isReasonFormOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl">
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

        <ConfirmDialog
          open={isConfirmOpen}
          title="Xác nhận xóa ticket"
          message="Bạn có chắc chắn muốn xóa ticket này? Hành động này không thể hoàn tác."
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
