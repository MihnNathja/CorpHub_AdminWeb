import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "../store/notificationSlice";
import NotificationItem from "./NotificationItem";
import NotificationBadge from "./NotificationBadge";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, Loader2, Inbox, RefreshCw } from "lucide-react";

/**
 * Dropdown hiển thị danh sách thông báo.
 */
export default function NotificationDropdown() {
    const dispatch = useDispatch();
    const { items, loading, unreadCount } = useSelector((state) => state.notification);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Lấy danh sách thông báo khi mở dropdown
    useEffect(() => {
        if (open) dispatch(fetchNotifications());
    }, [open, dispatch]);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleItemClick = (id) => {
        dispatch(markAsRead(id));
    };

    const handleMarkAllAsRead = () => {
        items.filter(item => !item.read).forEach(item => {
            dispatch(markAsRead(item.id));
        });
    };

    const handleRefresh = () => {
        dispatch(fetchNotifications());
    };

    return (
        <div ref={dropdownRef} className="relative">
            <NotificationBadge onClick={() => setOpen(!open)} />

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-[420px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                    >
                        {/* Header with gradient */}
                        <div className="relative bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-6 py-5 text-white overflow-hidden">
                            {/* Animated background */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl"
                            />

                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Thông báo</h3>
                                        <p className="text-xs text-white/80">
                                            {unreadCount > 0
                                                ? `${unreadCount} chưa đọc`
                                                : "Tất cả đã đọc"}
                                        </p>
                                    </div>
                                </div>

                                {/* Refresh button */}
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 180 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleRefresh}
                                    disabled={loading}
                                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
                                    title="Làm mới"
                                >
                                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Action buttons */}
                        {items.length > 0 && unreadCount > 0 && (
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleMarkAllAsRead}
                                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors w-full"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                    Đánh dấu tất cả đã đọc
                                </motion.button>
                            </div>
                        )}

                        {/* Notifications list */}
                        <div className="max-h-[500px] overflow-y-auto">
                            {loading && items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 px-4">
                                    <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mb-3" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                        Đang tải thông báo...
                                    </p>
                                </div>
                            ) : items.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-16 px-4"
                                >
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4">
                                        <Inbox className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                        Không có thông báo
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                        Bạn đã xem hết tất cả thông báo
                                    </p>
                                </motion.div>
                            ) : (
                                <div className="p-2">
                                    {items.map((notif, idx) => (
                                        <motion.div
                                            key={notif.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <NotificationItem
                                                notification={notif}
                                                onClick={() => handleItemClick(notif.id)}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900/50 dark:to-blue-900/20 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                                        Hiển thị {items.length} thông báo
                                    </span>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                                    >
                                        Xem tất cả
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
