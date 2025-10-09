import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import ConfirmDialog from "../../global/components/ConfirmDialog";

const EventPopup = ({ event, position, onClose, onEdit, onDelete }) => {
    const popupRef = useRef(null);

    // ✅ Tự động đóng khi click ra ngoài
    useEffect(() => {
        function handleClickOutside(e) {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    if (!event || !position) return null;

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    return (
        <div
            ref={popupRef}
            className="absolute z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-64"
            style={{ top: position.y, left: position.x }}
        >
            <h3 className="font-bold text-gray-900 dark:text-gray-100">
                {event.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
                {event.description || "No description"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
                {format(new Date(event.start), "PPpp")} –{" "}
                {format(new Date(event.end), "PPpp")}
            </p>

            {event.location && (
                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                    📍 {event.location}
                </p>
            )}
            {event.onlineLink && (
                <a
                    href={event.onlineLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 text-xs underline"
                >
                    Join meeting
                </a>
            )}

            <div className="flex justify-between mt-3">
                <button
                    className="text-green-600 text-sm font-medium hover:underline"
                    onClick={() => {
                        onEdit(event);
                        setTimeout(onClose, 50);
                    }}
                >
                    ✏️ Edit
                </button>

                <button
                    className="text-red-600 text-sm font-medium hover:underline"
                    onClick={() => {
                        setIsConfirmOpen(true);
                        // if (window.confirm("Are you sure you want to delete this meeting?")) {
                        //     onDelete?.(event.id);
                        //     setTimeout(onClose, 50);
                        // }
                    }}
                >
                    🗑 Delete
                </button>

                <button
                    className="text-gray-500 text-sm hover:underline"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
            <ConfirmDialog
                open={isConfirmOpen}
                title="Xác nhận xóa sự kiện này"
                message="Bạn có chắc chắn muốn xóa sự kiện này? Hành động này không thể hoàn tác."
                onConfirm={() => {
                    onDelete?.(event.id);
                    setIsConfirmOpen(false);
                    onClose();
                }}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </div>

    );
};

export default EventPopup;
