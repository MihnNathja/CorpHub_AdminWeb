import React, { useState } from "react";
import dayjs from "dayjs";
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import FloatingButton from "../../global/components/FloatingButton";
import { useAbsenceRequest } from "../hooks/useAbsenceRequest";
import AbsenceRequestModal from "../components/AbsenceRequestModal";
import Pagination from "../../global/components/Pagination";

const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
};

const AbsenceEmployeePage = () => {
    const {
        absenceRequests,
        create,
        update,
        remove,
        loading,
        meta,
        page,
        setPage,
    } = useAbsenceRequest();

    const totalPages = meta.totalPages ?? 1;
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

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa đơn nghỉ này?")) {
            await remove(id);
        }
    };

    const handleSubmit = async (formData) => {
        if (editingItem) await update(editingItem.id, formData);
        else await create(formData);
        setShowModal(false);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner p-6 min-h-[80vh]">
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Nghỉ phép của tôi
            </h1>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner p-4 overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="py-3 px-4">Loại nghỉ</th>
                            <th className="py-3 px-4">Từ ngày</th>
                            <th className="py-3 px-4">Đến ngày</th>
                            <th className="py-3 px-4">Lý do</th>
                            <th className="py-3 px-4 text-center">Trạng thái</th>
                            <th className="py-3 px-4 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="py-6 text-center text-gray-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : absenceRequests.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-6 text-center text-gray-500">
                                    Chưa có đơn nghỉ nào.
                                </td>
                            </tr>
                        ) : (
                            absenceRequests.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                >
                                    <td className="py-2 px-4">{item.absenceType.name}</td>
                                    <td className="py-2 px-4">
                                        {dayjs(item.startDate).format("DD/MM/YYYY")}
                                    </td>
                                    <td className="py-2 px-4">
                                        {dayjs(item.endDate).format("DD/MM/YYYY")}
                                    </td>
                                    <td className="py-2 px-4">{item.reason}</td>
                                    <td className="py-2 px-4 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[item.status] || ""
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 text-center flex justify-center gap-2">
                                        <button
                                            onClick={() => openEdit(item)}
                                            className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                                        >
                                            <PencilSquareIcon className="w-5 h-5 text-blue-500" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition"
                                        >
                                            <TrashIcon className="w-5 h-5 text-red-500" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                    <Pagination
                        page={page}
                        setPage={setPage}
                        totalPages={totalPages}
                    />
                </div>
            )}

            <FloatingButton
                onClick={openAdd}
                icon={PlusIcon}
                tooltip="New ticket"
                color="green"
            />

            {showModal && (
                <AbsenceRequestModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmit}
                    editingItem={editingItem}
                />
            )}
        </div>
    );
};

export default AbsenceEmployeePage;
