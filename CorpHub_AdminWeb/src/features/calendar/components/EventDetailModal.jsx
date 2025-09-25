import React from "react";

const EventDetailModal = ({ isOpen, event, onClose }) => {
    if (!isOpen || !event) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                    {event.title}
                </h2>

                {event.description && (
                    <p className="mb-2 text-gray-700 dark:text-gray-300">
                        <strong>Description:</strong> {event.description}
                    </p>
                )}

                {event.location && (
                    <p className="mb-2 text-gray-700 dark:text-gray-300">
                        <strong>Location:</strong> {event.location}
                    </p>
                )}

                <p className="mb-2 text-gray-700 dark:text-gray-300">
                    <strong>Start:</strong>{" "}
                    {new Date(event.start).toLocaleString("vi-VN")}
                </p>
                <p className="mb-2 text-gray-700 dark:text-gray-300">
                    <strong>End:</strong>{" "}
                    {new Date(event.end).toLocaleString("vi-VN")}
                </p>

                {event.organizerEmail && (
                    <p className="mb-2 text-gray-700 dark:text-gray-300">
                        <strong>Organizer:</strong> {event.organizerEmail}
                    </p>
                )}

                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventDetailModal;
