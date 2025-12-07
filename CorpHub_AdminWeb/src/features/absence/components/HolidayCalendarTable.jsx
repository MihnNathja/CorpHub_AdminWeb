import React, { useState } from "react";
import { useHolidayCalendar } from "../hooks/useHolidayCalendar";
import HolidayCalendarModal from "./HolidayCalendarModal";
import { Plus, Calendar, Edit2, Trash2, AlertCircle, Repeat } from "lucide-react";

const HolidayCalendarTable = () => {
    const { holidays, create, update, remove } = useHolidayCalendar();
    const [showModal, setShowModal] = useState(false);
    const [selectedHoliday, setSelectedHoliday] = useState(null);

    /* =============================
       HANDLERS
    ============================= */
    const handleAdd = () => {
        setSelectedHoliday(null);
        setShowModal(true);
    };

    const handleEdit = (holiday) => {
        setSelectedHoliday(holiday);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this holiday?")) {
            await remove(id);
        }
    };

    const handleSubmit = async (formData) => {
        if (selectedHoliday) await update(selectedHoliday.id, formData);
        else await create(formData);
        setShowModal(false);
    };

    /* =============================
       RENDER
    ============================= */
    return (
        <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Holiday Calendar
                    </h2>
                </div>
                <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm shadow-sm transition-all duration-200 hover:shadow"
                >
                    <Plus className="w-4 h-4" />
                    Add Holiday
                </button>
            </div>

            {/* Table Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Empty State */}
                {holidays.length === 0 ? (
                    <div className="p-12 text-center">
                        <AlertCircle className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            No holidays found
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Create your first holiday to get started.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 uppercase text-xs font-semibold border-b border-gray-200 dark:border-gray-700 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Holiday Name
                                        </div>
                                    </th>

                                    <th className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Date
                                        </div>
                                    </th>

                                    <th className="px-6 py-3">
                                        Description
                                    </th>

                                    <th className="px-6 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Repeat className="w-4 h-4" />
                                            Recurring
                                        </div>
                                    </th>

                                    <th className="px-6 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {holidays.map((h) => (
                                    <tr
                                        key={h.id}
                                        className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-150 group"
                                    >
                                        <td className="px-6 py-3 font-semibold text-gray-900 dark:text-gray-100">
                                            {h.name}
                                        </td>
                                        <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {new Date(h.date).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {h.description || "—"}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            {h.isRecurring ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800">
                                                    <Repeat className="w-3 h-3" />
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button
                                                    onClick={() => handleEdit(h)}
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-blue-200 dark:border-blue-800/50 bg-blue-50/70 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-150 shadow-sm hover:shadow"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(h.id)}
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-red-200 dark:border-red-800/50 bg-red-50/70 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:border-red-300 dark:hover:border-red-700 transition-all duration-150 shadow-sm hover:shadow"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <HolidayCalendarModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmit}
                    initialData={selectedHoliday}
                />
            )}
        </div>
    );
};

export default HolidayCalendarTable;
