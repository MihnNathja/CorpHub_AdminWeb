import React from "react";
import { format } from "date-fns";

const EventPopup = ({ event, position, onClose, onEdit, onDelete }) => {
    if (!event || !position) return null;

    return (
        <div
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
                        if (window.confirm("Are you sure you want to delete this meeting?")) {
                            onDelete?.(event.id); // gọi callback từ CalendarPage
                            setTimeout(onClose, 50);
                        }
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
        </div>
    );
};

export default EventPopup;
