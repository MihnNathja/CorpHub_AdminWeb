import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function EventFormModal({ isOpen, onClose, onSubmit, slotInfo }) {
    const [form, setForm] = useState({
        to: "",
        subject: "",
        title: "",
        description: "",
        location: "",
        onlineLink: "",
        start: "",
        end: "",
        organizer: "",
    });

    useEffect(() => {
        if (isOpen) {
            setForm((prev) => ({
                ...prev,
                start: slotInfo?.start
                    ? new Date(slotInfo.start).toISOString().slice(0, 16)
                    : "",
                end: slotInfo?.end
                    ? new Date(slotInfo.end).toISOString().slice(0, 16)
                    : "",
            }));
        }
    }, [isOpen, slotInfo]);

    if (!isOpen || typeof document === "undefined") return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            ...form,
            to: form.to.split(",").map((email) => email.trim()).filter(Boolean),
            start: new Date(form.start),
            end: new Date(form.end),
        };
        onSubmit(data);
    };

    return createPortal(
        <div className="fixed inset-0 z-[10000]">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   w-full max-w-2xl rounded-xl shadow-2xl
                   bg-white dark:bg-gray-800 p-6"
            >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Create Meeting
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="to"
                        placeholder="Recipients (comma separated emails)"
                        value={form.to}
                        onChange={handleChange}
                        className="w-full rounded-md p-2 bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
                    />
                    <input
                        type="text"
                        name="subject"
                        placeholder="Email subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border"
                    />
                    <input
                        type="text"
                        name="title"
                        placeholder="Event title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border"
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border"
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={form.location}
                        onChange={handleChange}
                        className="w-full rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border"
                    />
                    <input
                        type="text"
                        name="onlineLink"
                        placeholder="Online meeting link"
                        value={form.onlineLink}
                        onChange={handleChange}
                        className="w-full rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border"
                    />
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Start</label>
                            <input
                                type="datetime-local"
                                name="start"
                                value={form.start}
                                onChange={handleChange}
                                className="w-full rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">End</label>
                            <input
                                type="datetime-local"
                                name="end"
                                value={form.end}
                                onChange={handleChange}
                                className="w-full rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border"
                            />
                        </div>
                    </div>
                    <input
                        type="email"
                        name="organizer"
                        placeholder="Organizer email"
                        value={form.organizer}
                        onChange={handleChange}
                        className="w-full rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border"
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
