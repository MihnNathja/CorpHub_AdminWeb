import React from "react";
import dayjs from "dayjs";
import { TrashIcon } from "@heroicons/react/24/outline";

const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
};

const AbsenceRequestTable = ({ data = [], onDelete }) => {
    if (!data.length)
        return <p className="text-gray-500 text-center mt-6">Chưa có đơn nghỉ phép nào.</p>;

    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner p-4 overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-gray-600 dark:text-gray-300 border-b">
                    <tr>
                        <th className="py-2">Loại nghỉ</th>
                        <th className="py-2">Từ ngày</th>
                        <th className="py-2">Đến ngày</th>
                        <th className="py-2">Số ngày</th>
                        <th className="py-2">Trạng thái</th>
                        <th className="py-2">Lý do</th>
                        <th className="py-2 text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-2">{item.absenceType?.name}</td>
                            <td className="py-2">{dayjs(item.startDate).format("DD/MM/YYYY")}</td>
                            <td className="py-2">{dayjs(item.endDate).format("DD/MM/YYYY")}</td>
                            <td className="py-2">{item.durationDays}</td>
                            <td className="py-2">
                                <span
                                    className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[item.status] || "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {item.status}
                                </span>
                            </td>
                            <td className="py-2">{item.reason || "-"}</td>
                            <td className="py-2 text-right">
                                {item.status === "PENDING" && (
                                    <button
                                        onClick={() => onDelete(item.id)}
                                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-500"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AbsenceRequestTable;
