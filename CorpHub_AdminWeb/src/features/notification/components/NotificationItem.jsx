import React from "react";
import dayjs from "dayjs";

/**
 * Hiển thị 1 thông báo.
 * @param {Object} notification - dữ liệu notification
 */
export default function NotificationItem({ notification, onClick }) {
    const { title, message, createdAt, isRead, type } = notification;

    return (
        <div
            onClick={onClick}
            className={`p-3 cursor-pointer border-b border-gray-100 transition ${isRead ? "bg-white hover:bg-gray-50" : "bg-blue-50 hover:bg-blue-100"
                }`}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{title}</p>
                    <p className="text-gray-600 text-xs line-clamp-2">{message}</p>
                </div>
                {type === "SYSTEM" && (
                    <span className="text-[10px] text-gray-500 ml-2 uppercase bg-gray-200 px-1 rounded">
                        SYSTEM
                    </span>
                )}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
                {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
            </div>
        </div>
    );
}
