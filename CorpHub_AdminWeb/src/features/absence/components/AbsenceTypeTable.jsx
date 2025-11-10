import React, { useState } from "react";
import { useAbsenceType } from "../hooks/useAbsenceType";
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import AbsenceTypeModal from "./AbsenceTypeModal";
import FloatingButton from "../../global/components/FloatingButton";

const AbsenceTypeTable = () => {
    const { absenceTypes, create, update, remove } = useAbsenceType();
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const openAdd = () => {
        setEditingItem(null);
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setShowModal(true);
    };

    const handleSubmit = async (formData) => {
        if (editingItem) await update(editingItem.id, formData);
        else await create(formData);
        setShowModal(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this absence type?")) {
            await remove(id);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner p-4 relative">
            {/* Floating Add Button */}
            <FloatingButton
                onClick={openAdd}
                icon={PlusIcon}
                tooltip="Add Absence Type"
                color="blue"
            />

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                    <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-3">Code</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3 text-center">Proof</th>
                            <th className="px-4 py-3 text-center">Affect Quota</th>
                            <th className="px-4 py-3 text-center">Max Days</th>
                            <th className="px-4 py-3">Gender</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {absenceTypes.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                                >
                                    No absence types found.
                                </td>
                            </tr>
                        ) : (
                            absenceTypes.map((t) => (
                                <tr
                                    key={t.id}
                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                >
                                    <td className="px-4 py-2">{t.code}</td>
                                    <td className="px-4 py-2 font-medium">{t.name}</td>
                                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                        {t.description || "-"}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {t.requireProof ? (
                                            <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                                        ) : (
                                            <XCircleIcon className="w-5 h-5 text-red-500 mx-auto" />
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {t.affectQuota ? (
                                            <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                                        ) : (
                                            <XCircleIcon className="w-5 h-5 text-red-500 mx-auto" />
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {t.maxPerRequest ?? "-"}
                                    </td>
                                    <td className="px-4 py-2">{t.genderLimit}</td>
                                    <td className="px-4 py-2 text-right space-x-2">
                                        <button
                                            onClick={() => openEdit(t)}
                                            className="text-blue-500 hover:text-blue-400 transition"
                                            title="Edit"
                                        >
                                            <PencilSquareIcon className="w-5 h-5 inline" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            className="text-red-500 hover:text-red-400 transition"
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

            {/* Modal */}
            <AbsenceTypeModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
                initialData={editingItem}
            />
        </div>
    );
};

export default AbsenceTypeTable;
