import React, { useState } from "react";
import { PlusCircleIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useHolidayCalendar } from "../hooks/useHolidayCalendar";
import FloatingButton from "../../global/components/FloatingButton";
import HolidayCalendarModal from "./HolidayCalendarModal";
import { PlusIcon } from "lucide-react";

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
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner p-6 relative">
            <FloatingButton
                onClick={handleAdd}
                icon={PlusIcon}
                tooltip="New Holiday"
                color="blue"
            />
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                    <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3 text-center">Recurring</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {holidays.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                                >
                                    No holidays found.
                                </td>
                            </tr>
                        ) : (
                            holidays.map((h) => (
                                <tr
                                    key={h.id}
                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <td className="px-4 py-2">{h.name}</td>
                                    <td className="px-4 py-2">{h.date}</td>
                                    <td className="px-4 py-2">{h.description}</td>
                                    <td className="px-4 py-2 text-center">
                                        {h.isRecurring ? "✅" : "❌"}
                                    </td>
                                    <td className="px-4 py-2 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(h)}
                                            className="text-blue-500 hover:text-blue-600"
                                            title="Edit"
                                        >
                                            <PencilSquareIcon className="w-5 h-5 inline" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(h.id)}
                                            className="text-red-500 hover:text-red-600"
                                            title="Delete"
                                        >
                                            <TrashIcon className="w-5 h-5 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

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
