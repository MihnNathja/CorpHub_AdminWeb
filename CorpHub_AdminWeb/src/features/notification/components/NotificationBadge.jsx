import React from "react";
import { Bell } from "lucide-react";
import { useSelector } from "react-redux";

/**
 * 🛎️ Component hiển thị biểu tượng chuông thông báo.
 * - Lấy số lượng chưa đọc từ Redux
 * - Hỗ trợ dark mode
 * - Có hiệu ứng rung nhẹ khi có thông báo mới (tuỳ chọn)
 */
export default function NotificationBadge({ onClick }) {
    const unreadCount = useSelector((state) => state.notification.unreadCount);

    return (
        <button
            onClick={onClick}
            className="relative p-2 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="Thông báo"
        >
            <Bell
                className={`w-6 h-6 ${unreadCount > 0
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
            />
            {unreadCount > 0 && (
                <span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 
          animate-pulse"
                >
                    {unreadCount}
                </span>
            )}
        </button>
    );
}
