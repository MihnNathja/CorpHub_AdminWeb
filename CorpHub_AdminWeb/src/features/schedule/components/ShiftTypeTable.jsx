import React, { useState } from "react";
import FloatingButton from "../../global/components/FloatingButton";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ConfirmDialog from "../../global/components/ConfirmDialog";
import ShiftModal from "./ShiftModal";
import Pagination from "../../global/components/Pagination";
import { useShift } from "../hooks/useShift";
import { FilterIcon, Search } from "lucide-react";

const ShiftTypeTable = () => {
    const {
        shifts,
        page,
        size,
        setPage,
        meta,
        filters,
        setFilters,
        create,
        update,
        remove,
    } = useShift();

    const [editingShift, setEditingShift] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleAdd = (data) => create(data);
    const handleUpdate = (data) => update(data.id, data);
    const handleDelete = (id) => remove(id);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const clearFilters = () =>
        setFilters({ keywords: "", startFrom: "", endTo: "" });

    return (
        <div>
            {/* 🔹 Floating button thêm ca */}
            <FloatingButton
                onClick={() => {
                    setEditingShift(null);
                    setIsModalOpen(true);
                }}
                icon={PlusIcon}
                tooltip="Thêm ca làm"
                color="blue"
            />

            {/* 🔍 Bộ lọc */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-5">
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                    {/* Ô tìm kiếm */}
                    <div className="relative w-full md:w-1/3">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            name="keywords"
                            placeholder="Tìm kiếm tên ca..."
                            value={filters.keywords}
                            onChange={handleFilterChange}
                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    {/* Các filter phụ */}
                    <div className="flex flex-wrap items-center gap-3 md:justify-end w-full md:w-auto">

                        {/* Bắt đầu từ */}
                        <div className="flex items-center gap-2">
                            <label
                                htmlFor="startFrom"
                                className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                            >
                                Bắt đầu:
                            </label>
                            <input
                                id="startFrom"
                                type="time"
                                name="startFrom"
                                value={filters.startFrom}
                                onChange={handleFilterChange}
                                className="border rounded-lg px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>

                        {/* Kết thúc đến */}
                        <div className="flex items-center gap-2">
                            <label
                                htmlFor="endTo"
                                className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                            >
                                Kết thúc:
                            </label>
                            <input
                                id="endTo"
                                type="time"
                                name="endTo"
                                value={filters.endTo}
                                onChange={handleFilterChange}
                                className="border rounded-lg px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>

                        {/* Nút Clear */}
                        <button
                            onClick={clearFilters}
                            className="h-[38px] flex items-center justify-center gap-1 px-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            <FilterIcon className="w-4 h-4" />
                            Xóa lọc
                        </button>
                    </div>
                </div>
            </div>

            {/* 🔹 Bảng danh sách ca */}
            <div className="overflow-x-auto rounded-lg shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            {[
                                "#",
                                "Tên ca",
                                "Giờ bắt đầu",
                                "Giờ kết thúc",
                                "Giờ công",
                                "Ca đêm",
                                "Hành động",
                            ].map((col) => (
                                <th
                                    key={col}
                                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {shifts.length > 0 ? (
                            shifts.map((s, i) => (
                                <tr
                                    key={s.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                >
                                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                        {i + 1}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                                        {s.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm">{s.startTime}</td>
                                    <td className="px-4 py-3 text-sm">{s.endTime}</td>
                                    <td className="px-4 py-3 text-sm text-center">
                                        {s.workingHours}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-center">
                                        {s.isNightShift ? "🌙" : "☀️"}
                                    </td>
                                    <td className="px-4 py-3 text-center flex justify-center gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingShift(s);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                            title="Chỉnh sửa"
                                        >
                                            <PencilIcon className="w-5 h-5 text-yellow-500" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelected(s);
                                                setIsConfirmDialogOpen(true);
                                            }}
                                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                            title="Xóa ca"
                                        >
                                            <TrashIcon className="w-5 h-5 text-red-500" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="text-center py-6 text-gray-500 dark:text-gray-400 italic"
                                >
                                    Không có ca làm nào phù hợp
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 🔹 Modal thêm/sửa */}
            {isModalOpen && (
                <ShiftModal
                    shift={editingShift}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={(form) => {
                        editingShift ? handleUpdate(form) : handleAdd(form);
                        setIsModalOpen(false);
                    }}
                />
            )}

            {/* 🔹 Xác nhận xóa */}
            {isConfirmDialogOpen && (
                <ConfirmDialog
                    open={isConfirmDialogOpen}
                    title="Xác nhận xóa"
                    message={`Bạn có chắc muốn xóa ca "${selected?.name}"?`}
                    onConfirm={() => {
                        handleDelete(selected.id);
                        setIsConfirmDialogOpen(false);
                    }}
                    onCancel={() => setIsConfirmDialogOpen(false)}
                />
            )}

            {/* 🔹 Phân trang */}
            <div className="mt-4">
                <Pagination page={page} setPage={setPage} totalPages={meta.totalPages || 1} />
            </div>
        </div>
    );
};

export default ShiftTypeTable;
