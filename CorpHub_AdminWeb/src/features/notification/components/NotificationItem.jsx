import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { motion } from "framer-motion";
import {
    Bell,
    Clock,
    CheckCircle,
    AlertCircle,
    Info,
    Zap,
    Mail,
    Calendar,
    FileText,
} from "lucide-react";

dayjs.extend(relativeTime);
dayjs.locale("vi");

/**
 * Hiển thị 1 thông báo.
 * @param {Object} notification - dữ liệu notification
 */
export default function NotificationItem({ notification, onClick }) {
    const { title, message, createdAt, isRead, type } = notification;

    // Icon mapping based on notification type
    const typeConfig = {
        SYSTEM: {
            icon: Zap,
            iconBg: "bg-purple-100 dark:bg-purple-900/30",
            iconColor: "text-purple-600 dark:text-purple-400",
            badge: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
            label: "Hệ thống",
        },
        INFO: {
            icon: Info,
            iconBg: "bg-blue-100 dark:bg-blue-900/30",
            iconColor: "text-blue-600 dark:text-blue-400",
            badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
            label: "Thông tin",
        },
        SUCCESS: {
            icon: CheckCircle,
            iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
            iconColor: "text-emerald-600 dark:text-emerald-400",
            badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
            label: "Thành công",
        },
        WARNING: {
            icon: AlertCircle,
            iconBg: "bg-amber-100 dark:bg-amber-900/30",
            iconColor: "text-amber-600 dark:text-amber-400",
            badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
            label: "Cảnh báo",
        },
        MESSAGE: {
            icon: Mail,
            iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
            iconColor: "text-indigo-600 dark:text-indigo-400",
            badge: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300",
            label: "Tin nhắn",
        },
        EVENT: {
            icon: Calendar,
            iconBg: "bg-rose-100 dark:bg-rose-900/30",
            iconColor: "text-rose-600 dark:text-rose-400",
            badge: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
            label: "Sự kiện",
        },
        DOCUMENT: {
            icon: FileText,
            iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
            iconColor: "text-cyan-600 dark:text-cyan-400",
            badge: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300",
            label: "Tài liệu",
        },
    };

    const config = typeConfig[type] || typeConfig.INFO;
    const IconComponent = config.icon;

    // Format time relative to now
    const timeAgo = dayjs(createdAt).fromNow();

    return (
        <motion.div
            whileHover={{ x: 4 }}
            onClick={onClick}
            className={`group relative p-4 rounded-xl mb-2 cursor-pointer transition-all ${isRead
                    ? "bg-white dark:bg-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    : "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30"
                }`}
        >
            {/* Unread indicator */}
            {!isRead && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r"
                />
            )}

            <div className="flex items-start gap-3 pl-2">
                {/* Icon */}
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className={`flex-shrink-0 w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center shadow-sm`}
                >
                    <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4
                            className={`text-sm font-semibold leading-tight ${isRead
                                    ? "text-gray-700 dark:text-gray-300"
                                    : "text-gray-900 dark:text-white"
                                }`}
                        >
                            {title}
                        </h4>

                        {/* Type badge */}
                        <span
                            className={`flex-shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${config.badge}`}
                        >
                            {config.label}
                        </span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex items-center gap-3">
                        {/* Time */}
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                            <span className="text-[11px] text-gray-500 dark:text-gray-500">
                                {timeAgo}
                            </span>
                        </div>

                        {/* Read status indicator */}
                        {isRead && (
                            <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-emerald-500" />
                                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                    Đã đọc
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Hover indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                        <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            →
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Unread pulse effect */}
            {!isRead && (
                <motion.div
                    animate={{
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"
                />
            )}
        </motion.div>
    );
}
