import React, { useState } from "react";
import { X, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  approveApprovalStep,
  rejectApprovalStep,
} from "../services/employeeApi";
import { showSuccess, showError } from "../../../utils/toastUtils";
import { useAuth } from "../../auth/hooks/useAuth";

export default function PositionRequestDetailModal({
  request,
  onClose,
  onRefresh,
}) {
  const { hasAnyRole } = useAuth();
  const [stepComments, setStepComments] = useState({}); // { stepId: comment }
  const [actionInProgress, setActionInProgress] = useState(null);

  const getStepComment = (stepId) => stepComments[stepId] || "";
  const setStepComment = (stepId, comment) => {
    setStepComments((prev) => ({ ...prev, [stepId]: comment }));
  };
  console.log(request);
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[900px] max-h-[90vh] overflow-y-auto p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-blue-600">
            Chi tiết yêu cầu thay đổi vị trí
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Main Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Nhân viên
            </p>
            <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {request.employeeName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Người tạo
            </p>
            <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {request.createdByName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Ngày tạo</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {request.createdAt
                ? new Date(request.createdAt).toLocaleString("vi-VN")
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Trạng thái
            </p>
            <p
              className={`font-semibold inline-block px-3 py-1 rounded text-sm ${
                request.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : request.status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : request.status === "REJECTED"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {request.status}
            </p>
          </div>
        </div>

        {/* Position Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            Thông tin vị trí
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Vị trí hiện tại
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {request.oldPositionName || "-"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Phòng ban: {request.oldDepartmentName || "-"}
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Vị trí yêu cầu
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {request.newPositionName || "-"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Phòng ban: {request.newDepartmentName || "-"}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">Loại</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {request.type || "-"}
            </p>
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Ngày hiệu lực
            </p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {request.effectDate
                ? new Date(request.effectDate).toLocaleDateString("vi-VN")
                : "-"}
            </p>
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">Lý do</p>
            <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
              {request.reason || "-"}
            </p>
          </div>
        </div>

        {/* Attachments */}
        {request.attachments?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText size={20} className="text-orange-600" />
              Tài liệu đính kèm
            </h3>
            <div className="space-y-2">
              {request.attachments.map((att, idx) => (
                <a
                  key={idx}
                  href={att.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded hover:bg-orange-100 transition"
                >
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    {att.fileName}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Approval Steps */}
        {request.approvalSteps?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock size={20} className="text-purple-600" />
              Các bước phê duyệt
            </h3>
            <div className="space-y-4">
              {request.approvalSteps.map((step, idx) => {
                // TODO: Uncomment role check after testing
                // const canApprove =
                //   hasAnyRole(["ROLE_ADMIN", "ROLE_HR", "ROLE_MANAGER"]) &&
                //   step.decision === "PENDING";

                const canApprove = step.decision === "PENDING"; // Temporary: show all PENDING steps
                const isActionInProgress = actionInProgress === step.id;
                const stepComment = getStepComment(step.id);

                return (
                  <div
                    key={step.id}
                    className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Bước {step.stepOrder || idx + 1} - [
                          {step.role || "Phê duyệt"}]
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {step.approver?.fullName || "-"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {step.approver?.positionName &&
                            `Vị trí: ${step.approver.positionName}`}
                          {step.approver?.positionName &&
                            step.approver?.departmentName &&
                            " | "}
                          {step.approver?.departmentName &&
                            `Phòng ban: ${step.approver.departmentName}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {step.decision === "APPROVED" && (
                          <CheckCircle size={20} className="text-green-600" />
                        )}
                        {step.decision === "REJECTED" && (
                          <XCircle size={20} className="text-red-600" />
                        )}
                        {step.decision === "PENDING" && (
                          <Clock size={20} className="text-yellow-600" />
                        )}
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            step.decision === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : step.decision === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {step.decision}
                        </span>
                      </div>
                    </div>

                    {step.decidedAt && (
                      <p className="text-xs text-gray-500 mb-2">
                        Quyết định vào:{" "}
                        {new Date(step.decidedAt).toLocaleString("vi-VN")}
                      </p>
                    )}

                    {step.comment && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                        {step.comment}
                      </p>
                    )}

                    {canApprove && (
                      <div className="mt-3 space-y-2">
                        <textarea
                          placeholder="Nhập bình luận (tùy chọn)"
                          value={stepComment}
                          onChange={(e) =>
                            setStepComment(step.id, e.target.value)
                          }
                          className="w-full p-2 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                          rows="2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(step.id)}
                            disabled={isActionInProgress}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded text-sm font-medium transition"
                          >
                            {isActionInProgress ? "Đang xử lý..." : "Phê duyệt"}
                          </button>
                          <button
                            onClick={() => handleReject(step.id)}
                            disabled={isActionInProgress}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded text-sm font-medium transition"
                          >
                            {isActionInProgress ? "Đang xử lý..." : "Từ chối"}
                          </button>
                        </div>
                      </div>
                    )}

                    {!canApprove && step.decision === "PENDING" && (
                      <p className="text-xs text-gray-500 italic mt-2">
                        Chờ {step.approver?.fullName} phê duyệt
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
