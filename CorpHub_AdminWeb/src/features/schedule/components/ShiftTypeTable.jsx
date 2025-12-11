import React, { useState } from "react";
import FloatingButton from "../../global/components/FloatingButton";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    ClockIcon,
    SunIcon,
    MoonIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import ConfirmDialog from "../../global/components/ConfirmDialog";
import ShiftModal from "./ShiftModal";
import Pagination from "../../global/components/Pagination";
import { useShift } from "../hooks/useShift";

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
    const [showFilters, setShowFilters] = useState(true);

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

    const hasActiveFilters = filters.keywords || filters.startFrom || filters.endTo;

    return (
        <div className="space-y-5">
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

            {/* HEADER CARD */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <ClockIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Quản lý ca làm việc</h2>
                            <p className="text-blue-100 text-sm mt-1">
                                Tổng cộng: <span className="font-semibold">{meta?.totalElements || shifts.length}</span> ca làm việc
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-4 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg transition-all flex items-center gap-2 border border-white/20 font-medium"
                    >
                        <FunnelIcon className="w-5 h-5" />
                        <span>{showFilters ? "Ẩn" : "Hiện"} bộ lọc</span>
                    </button>
                </div>
            </div>

            {/* 🔍 FILTER SECTION */}
            {showFilters && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-900/50 px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                <FunnelIcon className="w-4 h-4" />
                                Bộ lọc tìm kiếm
                            </h3>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium flex items-center gap-1"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                    Xóa bộ lọc
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search Input */}
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tìm kiếm tên ca
                                </label>
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="keywords"
                                        placeholder="Nhập tên ca làm việc..."
                                        value={filters.keywords}
                                        onChange={handleFilterChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Start Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Giờ bắt đầu từ
                                </label>
                                <div className="relative">
                                    <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="time"
                                        name="startFrom"
                                        value={filters.startFrom}
                                        onChange={handleFilterChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* End Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Giờ kết thúc đến
                                </label>
                                <div className="relative">
                                    <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="time"
                                        name="endTo"
                                        value={filters.endTo}
                                        onChange={handleFilterChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-end gap-2">
                                <button
                                    onClick={clearFilters}
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-all"
                                >
                                    Đặt lại
                                </button>
                                <button
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-sm"
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔹 TABLE CARD */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">

                {/* Table Header */}
                <div className="bg-gray-50 dark:bg-gray-900/50 px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Danh sách ca làm việc
                    </h3>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    #
                                </th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Tên ca
                                </th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Giờ bắt đầu
                                </th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Giờ kết thúc
                                </th>
                                <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Giờ công
                                </th>
                                <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Loại ca
                                </th>
                                <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                            {shifts.length > 0 ? (
                                shifts.map((s, i) => (
                                    <tr
                                        key={s.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                                            {page * size + i + 1}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                                    <ClockIcon className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                    {s.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
                                                <ClockIcon className="w-4 h-4" />
                                                {s.startTime}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium">
                                                <ClockIcon className="w-4 h-4" />
                                                {s.endTime}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-bold">
                                                {s.workingHours}h
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            {s.isNightShift ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium">
                                                    <MoonIcon className="w-4 h-4" />
                                                    Ca đêm
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-sm font-medium">
                                                    <SunIcon className="w-4 h-4" />
                                                    Ca ngày
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingShift(s);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 transition-colors group"
                                                    title="Chỉnh sửa"
                                                >
                                                    <PencilIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelected(s);
                                                        setIsConfirmDialogOpen(true);
                                                    }}
                                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors group"
                                                    title="Xóa ca"
                                                >
                                                    <TrashIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-5 py-12 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                                                <ClockIcon className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">
                                                Không có ca làm việc nào
                                            </p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                                Thêm ca làm việc mới để bắt đầu
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {shifts.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-900/50 px-5 py-4 border-t border-gray-200 dark:border-gray-700">
                        <Pagination
                            page={page}
                            setPage={setPage}
                            totalPages={meta.totalPages || 1}
                        />
                    </div>
                )}
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
        </div>
    );
};

export default ShiftTypeTable;
