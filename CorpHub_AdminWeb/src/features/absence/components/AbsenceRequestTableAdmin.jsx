import React from "react";
import dayjs from "dayjs";
import {
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import { useAbsenceRequest } from "../hooks/useAdminAbsenceRequest";

const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
};

const AbsenceRequestTable = () => {
    const { absenceRequests, approve, reject } = useAbsenceRequest();

    const handleView = (item) => {
        console.log("View absence request:", item.id);
    };

    const handleApprove = (item) => {
        if (window.confirm("Xác nhận đồng ý đơn nghỉ phép này?")) {
            approve(item.id);
        }
    };

    const handleReject = (item) => {
        if (window.confirm("Từ chối đơn nghỉ phép này?")) {
            reject(item.id);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner p-4 overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
                    <tr>
                        <th className="py-2">TYPE</th>
                        <th className="py-2">FROM</th>
                        <th className="py-2">TO</th>
                        <th className="py-2">DURATION</th>
                        <th className="py-2 text-center">STATUS</th>
                        <th className="py-2">REASON</th>
                        {/* 👇 căn giữa tiêu đề “ACTION” */}
                        <th className="py-2 text-center">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {absenceRequests.map((item) => (
                        <tr
                            key={item.id}
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            <td className="py-2">{item.absenceType.name}</td>
                            <td className="py-2">{dayjs(item.startDate).format("DD/MM/YYYY")}</td>
                            <td className="py-2">{dayjs(item.endDate).format("DD/MM/YYYY")}</td>
                            <td className="py-2 text-center">{item.durationDays}</td>
                            <td className="py-2 text-center">
                                <span
                                    className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[item.status] ||
                                        "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {item.status}
                                </span>
                            </td>
                            <td className="py-2">{item.reason || "-"}</td>

                            {/* 👇 căn giữa các nút icon */}
                            <td className="py-2 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    {/* 👁️ Xem */}
                                    <button
                                        onClick={() => handleView(item)}
                                        title="Xem chi tiết"
                                        className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-500 transition"
                                    >
                                        <EyeIcon className="w-5 h-5" />
                                    </button>

                                    {/* ✅ Đồng ý */}
                                    {item.status === "PENDING" && (
                                        <button
                                            onClick={() => handleApprove(item)}
                                            title="Đồng ý"
                                            className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900 text-green-600 transition"
                                        >
                                            <CheckCircleIcon className="w-5 h-5" />
                                        </button>
                                    )}

                                    {/* ❌ Từ chối */}
                                    {item.status === "PENDING" && (
                                        <button
                                            onClick={() => handleReject(item)}
                                            title="Từ chối"
                                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-500 transition"
                                        >
                                            <XCircleIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AbsenceRequestTable;
