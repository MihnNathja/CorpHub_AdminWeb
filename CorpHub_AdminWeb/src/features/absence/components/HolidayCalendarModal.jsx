import React, { useEffect, useState } from "react";

const HolidayCalendarModal = ({ show, onClose, onSubmit, initialData }) => {
    const [form, setForm] = useState({
        name: "",
        date: "",
        description: "",
        isRecurring: false,
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm({ name: "", date: "", description: "", isRecurring: false });
    }, [initialData]);

    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    {initialData ? "Edit Holiday" : "Add New Holiday"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm mb-1">Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Date</label>
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            required
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            rows="3"
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Recurring</label>
                        <select
                            value={form.isRecurring}
                            onChange={(e) =>
                                setForm({ ...form, isRecurring: e.target.value === "true" })
                            }
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                        >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                        >
                            {initialData ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HolidayCalendarModal;
