import React, { useState } from "react";
import dayjs from "dayjs";
import {
  Eye,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Paperclip,
  Clock,
  Download,
} from "lucide-react";
import ReasonDialog from "../../../components/ReasonDialog";
import { downloadAttachment } from "../service/absenceRequestApi";
import { showError } from "../../../utils/toastUtils";

const statusColors = {
  PENDING:
    "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-800",
  APPROVED:
    "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-100 dark:border-emerald-800",
  REJECTED:
    "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-100 dark:border-rose-800",
};

const IconButton = ({ children, color = "blue", ...props }) => {
  const colors = {
    blue: "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-800",
    green:
      "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800",
    red: "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 border-rose-200 dark:border-rose-800",
  };

  return (
    <button
      {...props}
      className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-200 ${colors[color]}`}
    >
      {children}
    </button>
  );
};

const AbsenceRequestCard = ({
  item,
  currentUserId,
  approveRequest,
  rejectRequest,
}) => {
  const [openHistory, setOpenHistory] = useState(false);
  const [openReasonDialog, setOpenReasonDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("approve");

  const avatarText = item.user?.fullName
    ? item.user.fullName.charAt(0).toUpperCase()
    : "?";

  const handleOpenApproveDialog = () => {
    setDialogMode("approve");
    setOpenReasonDialog(true);
  };

  const handleOpenRejectDialog = () => {
    setDialogMode("reject");
    setOpenReasonDialog(true);
  };

  const handleReasonSubmit = (reason) => {
    if (dialogMode === "approve") {
      approveRequest(item.workflowInstanceId, reason);
    } else {
      rejectRequest(item.workflowInstanceId, reason);
    }
    setOpenReasonDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenReasonDialog(false);
  };

  const handleDownload = async (e) => {
    e?.preventDefault();
    try {
      // Prefer server download by objectKey if available
      const objectKey = item.attachmentKey || item.attachmentUrl;
      if (!objectKey) {
        // fallback to opening url
        window.open(item.attachmentUrl, "_blank");
        return;
      }

      const result = await downloadAttachment(objectKey);
      const blob = result?.blob ?? result;
      const serverFilename = result?.filename;
      // blob may be a Blob or ArrayBuffer depending on axios config
      const fileBlob = blob instanceof Blob ? blob : new Blob([blob]);
      const url = window.URL.createObjectURL(fileBlob);
      const a = document.createElement("a");
      a.href = url;
      const filename = serverFilename || item.attachmentName || "attachment";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
      showError("Không thể tải tệp xuống");
    }
  };

  console.log(item);

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* HEADER - Compact with all key info */}
        <div className="px-4 py-3.5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-800">
          {/* Row 1: User + Status */}
          <div className="flex justify-between items-start gap-3 mb-3">
            {/* User Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {item.user?.avatar ? (
                <img
                  src={item.user.avatar}
                  alt={item.user.fullName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700 flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-gray-200 dark:ring-gray-700 flex-shrink-0">
                  {avatarText}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate">
                  {item.user?.fullName}
                </h3>
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  {item.user?.department && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {item.user.department.name}
                    </p>
                  )}
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {dayjs(item.createdAt).format("DD/MM HH:mm")}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <span
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                statusColors[item.status]
              }`}
            >
              {item.status}
            </span>
          </div>

          {/* Row 2: Type, Duration, Dates */}
          <div className="grid grid-cols-4 gap-3 text-sm">
            {/* Type */}
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide mb-1">
                Loại
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {item.absenceType?.name}
              </p>
            </div>

            {/* Duration */}
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide mb-1">
                Kỳ hạn
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {item.durationDays} ngày
              </p>
            </div>

            {/* From */}
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide mb-1">
                Từ
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {dayjs(item.startDate).format("DD/MM")}
              </p>
            </div>

            {/* To */}
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide mb-1">
                Đến
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {dayjs(item.endDate).format("DD/MM")}
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT - 2 Column Layout (2:1 ratio) */}
        <div className="px-4 py-3.5 grid grid-cols-3 gap-3">
          {/* Left Column (2/3) - Reason and Attachment */}
          <div className="col-span-2 space-y-3">
            {/* Reason Section */}
            {(item.reason || item.attachmentUrl) && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3.5 py-3 border border-gray-200 dark:border-gray-700 space-y-2">
                {item.reason && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                      Lý do
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">
                      {item.reason}
                    </p>
                  </div>
                )}
                {item.attachmentUrl && (
                  <div className="flex items-center justify-between">
                    <a
                      href={item.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      <Paperclip className="w-4 h-4" />
                      Tệp đính kèm
                    </a>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Tải
                    </button>
                  </div>
                )}
              </div>
            )}

            {!item.reason && !item.attachmentUrl && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3.5 py-3 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Không có lý do hoặc tệp đính kèm
                </p>
              </div>
            )}
          </div>

          {/* Right Column (1/3) - History */}
          <div className="col-span-1">
            {item.workflowActions?.length > 0 ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden h-full flex flex-col">
                <button
                  className="flex justify-between items-center px-3.5 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700 uppercase tracking-wide"
                  onClick={() => setOpenHistory(!openHistory)}
                >
                  <span className="truncate">
                    Lịch sử ({item.workflowActions.length})
                  </span>
                  {openHistory ? (
                    <ChevronUp className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  )}
                </button>

                {openHistory && (
                  <div className="px-3 py-2.5 overflow-y-auto flex-1 max-h-[250px] space-y-2">
                    {item.workflowActions.map((a, idx) => (
                      <div
                        key={idx}
                        className="flex gap-2 items-start pb-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                      >
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                            a.action === "APPROVE"
                              ? "bg-emerald-500"
                              : "bg-rose-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1.5 mb-1">
                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">
                              {a.actorName}
                            </p>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap flex-shrink-0 ${
                                a.action === "APPROVE"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                  : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                              }`}
                            >
                              {a.action === "APPROVE" ? "✓" : "✕"}
                            </span>
                          </div>
                          {a.comment && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mb-1">
                              "{a.comment}"
                            </p>
                          )}
                          <p className="text-[10px] text-gray-500 dark:text-gray-500">
                            {dayjs(a.createdAt).format("HH:mm • DD/MM")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3.5 py-3 border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Không có lịch sử
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER - Actions */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <button className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Eye className="w-4 h-4" />
          </button>

          {item.currentApproverId === currentUserId &&
            item.workflowStatus === "IN_PROGRESS" && (
              <div className="flex items-center gap-1">
                <IconButton
                  color="green"
                  onClick={handleOpenApproveDialog}
                  title="Approve"
                >
                  <CheckCircle className="w-4 h-4" />
                </IconButton>
                <IconButton
                  color="red"
                  onClick={handleOpenRejectDialog}
                  title="Reject"
                >
                  <XCircle className="w-4 h-4" />
                </IconButton>
              </div>
            )}
        </div>
      </div>

      {/* ReasonDialog */}
      <ReasonDialog
        open={openReasonDialog}
        onClose={handleCloseDialog}
        onAction={handleReasonSubmit}
        isAcceptDialog={dialogMode === "approve"}
        title={
          dialogMode === "approve" ? "Phê duyệt đơn nghỉ" : "Từ chối đơn nghỉ"
        }
      />
    </>
  );
};

export default AbsenceRequestCard;
