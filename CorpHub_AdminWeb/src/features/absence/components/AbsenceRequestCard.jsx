import React, { useState } from "react";
import dayjs from "dayjs";
import {
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    PaperClipIcon,
} from "@heroicons/react/24/outline";
import ReasonDialog from "../../../components/ReasonDialog";

const statusColors = {
    PENDING: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    APPROVED: "bg-green-50 text-green-700 border border-green-200",
    REJECTED: "bg-red-50 text-red-700 border border-red-200",
};

const workflowColors = {
    IN_PROGRESS: "text-blue-600",
    APPROVED: "text-green-600",
    REJECTED: "text-red-600",
};

const IconButton = ({ children, color = "blue", ...props }) => {
    const colors = {
        blue: "text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 border-blue-100",
        green: "text-green-600 hover:bg-green-50 dark:hover:bg-green-900 border-green-100",
        red: "text-red-500 hover:bg-red-50 dark:hover:bg-red-900 border-red-100",
    };

    return (
        <button
            {...props}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition ${colors[color]}`}
        >
            {children}
        </button>
    );
};

const AbsenceRequestCard = ({ item, currentUserId, approveRequest, rejectRequest }) => {
    const [openHistory, setOpenHistory] = useState(false);
    const [openReasonDialog, setOpenReasonDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState("approve"); // "approve" | "reject"

    const avatarText = item.user?.fullName
        ? item.user.fullName.charAt(0).toUpperCase()
        : "?";

    // ✅ Xử lý khi click nút Approve
    const handleOpenApproveDialog = () => {
        setDialogMode("approve");
        setOpenReasonDialog(true);
    };

    // ✅ Xử lý khi click nút Reject
    const handleOpenRejectDialog = () => {
        setDialogMode("reject");
        setOpenReasonDialog(true);
    };

    // ✅ Xử lý khi submit dialog
    const handleReasonSubmit = (reason) => {
        if (dialogMode === "approve") {
            approveRequest(item.workflowInstanceId, reason);
        } else {
            rejectRequest(item.workflowInstanceId, reason);
        }
        setOpenReasonDialog(false);
    };

    // ✅ Đóng dialog
    const handleCloseDialog = () => {
        setOpenReasonDialog(false);
    };

    return (
        <>
            <div className="
                bg-white dark:bg-gray-800 
                rounded-xl shadow-sm 
                border border-gray-200 dark:border-gray-700
                px-5 py-4 space-y-4
            ">

                {/* HEADER */}
                <div className="flex justify-between items-center gap-3">

                    {/* Avatar + user info */}
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        {item.user?.avatar ? (
                            <img
                                src={item.user.avatar}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">
                                {avatarText}
                            </div>
                        )}

                        {/* Name + department */}
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                {item.user?.fullName}
                            </h3>

                            {item.user?.department && (
                                <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                                    {item.user.department.name}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex items-center gap-2">
                        <IconButton>
                            <EyeIcon className="w-5 h-5" />
                        </IconButton>

                        {item.currentApproverId === currentUserId &&
                            item.workflowStatus === "IN_PROGRESS" && (
                                <>
                                    <IconButton color="green" onClick={handleOpenApproveDialog}>
                                        <CheckCircleIcon className="w-5 h-5" />
                                    </IconButton>

                                    <IconButton color="red" onClick={handleOpenRejectDialog}>
                                        <XCircleIcon className="w-5 h-5" />
                                    </IconButton>
                                </>
                            )}
                    </div>
                </div>

                {/* INFO GRID */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-700 dark:text-gray-300">

                    <p><strong>Loại nghỉ:</strong> {item.absenceType?.name}</p>
                    <p><strong>Số ngày:</strong> {item.durationDays}</p>

                    <p><strong>Từ:</strong> {dayjs(item.startDate).format("DD/MM/YYYY")}</p>
                    <p><strong>Đến:</strong> {dayjs(item.endDate).format("DD/MM/YYYY")}</p>

                    <div>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${statusColors[item.status]}`}>
                            Request: {item.status}
                        </span>
                    </div>

                    <p className={`font-medium ${workflowColors[item.workflowStatus]}`}>
                        Workflow: {item.workflowStatus}
                    </p>
                </div>

                {/* CREATED INFO */}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    Gửi lúc: {dayjs(item.createdAt).format("HH:mm DD/MM/YYYY")}
                </div>

                {/* REASON */}
                <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Lý do</div>
                    <div className="text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700 rounded-lg px-3 py-2">
                        {item.reason || "-"}
                    </div>

                    {/* Attachment */}
                    {item.attachmentUrl && (
                        <a
                            href={item.attachmentUrl}
                            target="_blank"
                            className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                            <PaperClipIcon className="w-4 h-4" />
                            Xem tệp đính kèm
                        </a>
                    )}
                </div>

                {/* HISTORY COLLAPSE */}
                <button
                    className="w-full flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 px-2 py-1 rounded-lg"
                    onClick={() => setOpenHistory(!openHistory)}
                >
                    <span className="font-medium">Lịch sử duyệt</span>
                    {openHistory ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                </button>

                {openHistory && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-3">
                        {item.workflowActions?.length > 0 ? (
                            item.workflowActions.map((a, idx) => (
                                <div key={idx} className="flex gap-3 items-start">
                                    <div className="mt-1">
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                            {a.actorName}
                                            <span className={a.action === "APPROVE" ? "text-green-600" : "text-red-600"}>
                                                {" • "}{a.action}
                                            </span>
                                        </p>

                                        {a.comment && (
                                            <p className="text-xs italic text-gray-500">"{a.comment}"</p>
                                        )}

                                        <p className="text-xs text-gray-400">
                                            {dayjs(a.createdAt).format("HH:mm • DD/MM/YYYY")}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400 italic">Chưa có lịch sử duyệt</p>
                        )}
                    </div>
                )}
            </div>

            {/* ✅ ReasonDialog */}
            <ReasonDialog
                open={openReasonDialog}
                onClose={handleCloseDialog}
                onAction={handleReasonSubmit}
                isAcceptDialog={dialogMode === "approve"}
                title={dialogMode === "approve" ? "Phê duyệt đơn nghỉ" : "Từ chối đơn nghỉ"}
            />
        </>
    );
};

export default AbsenceRequestCard;
