import React, { useState } from "react";
import {
  X,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  CalendarClock,
  UserRound,
  Paperclip,
} from "lucide-react";
import {
  approveApprovalStep,
  rejectApprovalStep,
} from "../services/employeeApi";
import { showSuccess, showError } from "../../../utils/toastUtils";
import { useAuth } from "../../auth/hooks/useAuth";

const statusTone = {
  PENDING:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700",
  APPROVED:
    "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-700",
  REJECTED:
    "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-200 dark:border-rose-700",
  CANCELLED:
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/40 dark:text-slate-200 dark:border-slate-700",
};

const decisionTone = {
  APPROVED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
  REJECTED: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200",
  PENDING:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
};

const StepIcon = ({ decision }) => {
  if (decision === "APPROVED")
    return <CheckCircle size={18} className="text-emerald-600" />;
  if (decision === "REJECTED")
    return <XCircle size={18} className="text-rose-600" />;
  return <Clock size={18} className="text-amber-600" />;
};

const InfoItem = ({ label, value, icon }) => (
  <div className="flex items-start gap-2">
    {icon && <span className="text-slate-400 mt-0.5">{icon}</span>}
    <div>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        {value || "-"}
      </p>
    </div>
  </div>
);

const formatDateTime = (val) =>
  val ? new Date(val).toLocaleString("vi-VN") : "-";
const formatDate = (val) =>
  val ? new Date(val).toLocaleDateString("vi-VN") : "-";

export default function PositionRequestDetailModal({
  request,
  onClose,
  onRefresh,
}) {
  const { hasAnyRole } = useAuth();
  const [stepComments, setStepComments] = useState({});
  const [actionInProgress, setActionInProgress] = useState(null);

  const getStepComment = (stepId) => stepComments[stepId] || "";
  const setStepComment = (stepId, comment) =>
    setStepComments((prev) => ({ ...prev, [stepId]: comment }));

  const handleApprove = async (approvalId) => {
    setActionInProgress(approvalId);
    try {
      await approveApprovalStep(approvalId, getStepComment(approvalId) || "");
      showSuccess("Phê duyệt thành công");
      setStepComment(approvalId, "");
      onRefresh?.();
      onClose?.();
    } catch (err) {
      showError("Phê duyệt thất bại");
      console.error(err);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (approvalId) => {
    const comment = getStepComment(approvalId);
    if (!comment.trim()) {
      showError("Vui lòng nhập lý do từ chối");
      return;
    }

    setActionInProgress(approvalId);
    try {
      await rejectApprovalStep(approvalId, comment);
      showSuccess("Từ chối thành công");
      setStepComment(approvalId, "");
      onRefresh?.();
      onClose?.();
    } catch (err) {
      showError("Từ chối thất bại");
      console.error(err);
    } finally {
      setActionInProgress(null);
    }
  };

  if (!request) return null;

  const statusClass = statusTone[request.status] || statusTone.CANCELLED;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-slate-700 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 px-6 pb-6 pt-5 text-white dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 dark:border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_35%)]" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-white/80">
                Yêu cầu thay đổi vị trí
              </p>
              <h2 className="mt-1 text-2xl font-semibold leading-tight">
                {request?.newPositionName || "Chi tiết yêu cầu"}
              </h2>
              <p className="text-sm text-white/80">
                Mã yêu cầu: {request.id?.slice(0, 10) || "-"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${statusClass}`}
              >
                <Clock size={14} />
                {request.status || "PENDING"}
              </span>
              <button
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-3 overflow-y-auto">
          {/* Column: Main summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Tổng quan
              </p>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <InfoItem
                  label="Nhân viên"
                  value={request.employeeName}
                  icon={<UserRound size={16} />}
                />
                <InfoItem
                  label="Người tạo"
                  value={request.createdByName}
                  icon={<UserRound size={16} />}
                />
                <InfoItem
                  label="Ngày tạo"
                  value={formatDateTime(request.createdAt)}
                  icon={<Clock size={16} />}
                />
                <InfoItem
                  label="Ngày hiệu lực"
                  value={formatDate(request.effectDate)}
                  icon={<CalendarClock size={16} />}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800/70">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                <FileText size={18} className="text-blue-600" /> Thông tin vị
                trí
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <div className="rounded-lg border border-slate-200 bg-blue-50 px-4 py-3 dark:border-blue-900/40 dark:bg-blue-900/30">
                  <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-300">
                    Vị trí hiện tại
                  </p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                    {request.oldPositionName || "-"}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {request.oldDepartmentName || "-"}
                  </p>
                </div>

                <div className="hidden md:flex items-center justify-center text-slate-400">
                  <ArrowRight size={22} />
                </div>

                <div className="rounded-lg border border-slate-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/40 dark:bg-emerald-900/30">
                  <p className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                    Vị trí đề xuất
                  </p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                    {request.newPositionName || "-"}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {request.newDepartmentName || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <InfoItem
                  label="Loại"
                  value={request.type}
                  icon={<SparklesIcon />}
                />
                <InfoItem
                  label="Ngày hiệu lực"
                  value={formatDate(request.effectDate)}
                  icon={<CalendarClock size={16} />}
                />
                <InfoItem
                  label="Mã yêu cầu"
                  value={request.id?.slice(0, 10) || "-"}
                  icon={<FileText size={16} />}
                />
              </div>

              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Lý do
                </p>
                <p className="mt-2 whitespace-pre-wrap leading-relaxed">
                  {request.reason || "Không có mô tả"}
                </p>
              </div>
            </div>

            <AttachmentsSection attachments={request.attachments} />
          </div>

          {/* Column: Approval steps */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800/70">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                <Clock size={18} className="text-purple-600" />
                Tiến trình phê duyệt
              </div>

              {!request.approvalSteps?.length ? (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  Chưa có bước phê duyệt.
                </p>
              ) : (
                <div className="relative mt-4">
                  <div className="absolute left-[11px] top-0 h-full border-l border-slate-200 dark:border-slate-700" />
                  <div className="space-y-4">
                    {request.approvalSteps.map((step, idx) => {
                      const isActionInProgress = actionInProgress === step.id;
                      const stepComment = getStepComment(step.id);

                      return (
                        <div key={step.id || idx} className="relative pl-8">
                          <span className="absolute left-[2px] top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white bg-white shadow ring-2 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
                            <StepIcon decision={step.decision} />
                          </span>

                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/80">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                  Bước {step.stepOrder || idx + 1} -{" "}
                                  {step.role || "Phê duyệt"}
                                </p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                                  {step.approver?.fullName || "-"}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {[
                                    step.approver?.positionName,
                                    step.approver?.departmentName,
                                  ]
                                    .filter(Boolean)
                                    .join(" | ") || "Không rõ vị trí"}
                                </p>
                              </div>

                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                  decisionTone[step.decision] ||
                                  decisionTone.PENDING
                                }`}
                              >
                                {step.decision}
                              </span>
                            </div>

                            {step.decidedAt && (
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Quyết định: {formatDateTime(step.decidedAt)}
                              </p>
                            )}

                            {step.comment && (
                              <p className="mt-2 rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                                {step.comment}
                              </p>
                            )}

                            <div className="mt-3 space-y-2">
                              <textarea
                                placeholder="Nhập bình luận (tùy chọn)"
                                value={stepComment}
                                onChange={(e) =>
                                  setStepComment(step.id, e.target.value)
                                }
                                className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                                rows="2"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApprove(step.id)}
                                  disabled={isActionInProgress}
                                  className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                                >
                                  {isActionInProgress
                                    ? "Đang xử lý..."
                                    : "Phê duyệt"}
                                </button>
                                <button
                                  onClick={() => handleReject(step.id)}
                                  disabled={isActionInProgress}
                                  className="inline-flex items-center justify-center rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                                >
                                  {isActionInProgress
                                    ? "Đang xử lý..."
                                    : "Từ chối"}
                                </button>
                              </div>
                            </div>

                            {step.decision === "PENDING" && (
                              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                                Chờ {step.approver?.fullName || "người duyệt"}{" "}
                                phê duyệt
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/70">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Bạn có thể phê duyệt/từ chối trực tiếp các bước đang chờ.
          </div>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

const SparklesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="h-4 w-4 text-amber-500"
  >
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
    <path d="M6 16l.8 2.2L9 19l-2.2.8L6 22l-.8-2.2L3 19l2.2-.8L6 16z" />
    <path d="M18 14l.9 1.8L21 17l-2.1.8L18 20l-.9-2.2L15 17l2.1-.8L18 14z" />
  </svg>
);

const AttachmentsSection = ({ attachments }) => {
  if (!attachments?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800/70">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
        <Paperclip size={18} className="text-orange-500" /> Tài liệu đính kèm
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {attachments.map((att, idx) => (
          <a
            key={idx}
            href={att.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-orange-50/70 px-3 py-2 text-sm text-slate-800 transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:shadow-sm dark:border-orange-900/50 dark:bg-orange-900/20 dark:text-orange-50"
          >
            <div className="mt-0.5 rounded-md bg-white/70 p-1 text-orange-600 shadow-sm dark:bg-orange-900/40">
              <FileText size={16} />
            </div>
            <div>
              <p className="font-semibold leading-snug">
                {att.fileName || "Tài liệu"}
              </p>
              <p className="text-xs text-orange-700/80 dark:text-orange-100/80">
                Nhấn để mở
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
