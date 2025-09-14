// components/EventModal.jsx
import React, { useState, useEffect } from "react";

const EventModal = ({ event, onClose, onSave }) => {
    const [title, setTitle] = useState(event.title || "");
    const [date, setDate] = useState(event.date ? event.date.substring(0, 10) : "");

    useEffect(() => {
        if (event.date) setDate(event.date.substring(0, 10));
    }, [event]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !date) return;
        onSave({ ...event, title, date });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-96">
                <h3 className="text-lg font-bold mb-4">{event.id ? "Edit Event" : "New Event"}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" className="text-gray-500" onClick={onClose}>Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventModal;
