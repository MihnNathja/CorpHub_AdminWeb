import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "../store/notificationSlice";
import NotificationItem from "./NotificationItem";
import NotificationBadge from "./NotificationBadge";

/**
 * Dropdown hiển thị danh sách thông báo.
 */
export default function NotificationDropdown() {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.notification);
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

    return (
        <div ref={dropdownRef} className="relative">
            <NotificationBadge onClick={() => setOpen(!open)} />

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                    <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-700">Thông báo</h3>
                        {loading && <span className="text-xs text-gray-400">Đang tải...</span>}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {items.length === 0 ? (
                            <p className="text-center text-gray-500 text-sm py-4">
                                Không có thông báo
                            </p>
                        ) : (
                            items.map((notif) => (
                                <NotificationItem
                                    key={notif.id}
                                    notification={notif}
                                    onClick={() => handleItemClick(notif.id)}
                                />
                            ))
                        )}
                    </div>

                    <div className="p-2 text-center text-xs text-gray-400 border-t border-gray-100">
                        {items.length > 0
                            ? "Hiển thị " + items.length + " thông báo"
                            : "Không có thông báo mới"}
                    </div>
                </div>
            )}
        </div>
    );
}
