import React from "react";
import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

/**
 * 🛎️ Component hiển thị biểu tượng chuông thông báo.
 * - Lấy số lượng chưa đọc từ Redux
 * - Hỗ trợ dark mode
 * - Có hiệu ứng rung nhẹ khi có thông báo mới
 */
export default function NotificationBadge({ onClick }) {
    const unreadCount = useSelector((state) => state.notification.unreadCount);

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClick}
                className="relative p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group shadow-sm hover:shadow-md"
                title="Thông báo"
            >
                {/* Bell icon with shake animation when there are unread notifications */}
                <motion.div
                    animate={
                        unreadCount > 0
                            ? {
                                rotate: [0, -15, 15, -15, 15, 0],
                            }
                            : {}
                    }
                    transition={{
                        duration: 0.5,
                        repeat: unreadCount > 0 ? Infinity : 0,
                        repeatDelay: 3,
                    }}
                >
                    <Bell
                        className={`w-6 h-6 transition-colors ${unreadCount > 0
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                            }`}
                    />
                </motion.div>

                {/* Unread count badge */}
                {unreadCount > 0 && (
                    <>
                        {/* Pulse ring effect */}
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 animate-ping opacity-75"></span>

                        {/* Badge */}
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gradient-to-br from-red-500 to-rose-600 text-white text-[10px] font-bold rounded-full shadow-lg border-2 border-white dark:border-gray-900"
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </motion.span>
                    </>
                )}

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-xl bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-200"></div>
            </motion.button>

            {/* Tooltip on hover */}
            <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap shadow-lg z-50">
                {unreadCount > 0
                    ? `${unreadCount} thông báo chưa đọc`
                    : "Không có thông báo mới"}
                <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
            </div>
        </div>
    );
}
