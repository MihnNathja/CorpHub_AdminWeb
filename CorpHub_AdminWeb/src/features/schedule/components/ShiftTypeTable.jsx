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
            {/* 🔹 Floating button to add shift */}
            <FloatingButton
                onClick={() => {
                    setEditingShift(null);
                    setIsModalOpen(true);
                }}
                icon={PlusIcon}
                tooltip="Add new shift"
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
                            <h2 className="text-2xl font-bold text-white">Shift Management</h2>
                            <p className="text-blue-100 text-sm mt-1">
                                Total: <span className="font-semibold">{meta?.totalElements || shifts.length}</span> shifts
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-4 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg transition-all flex items-center gap-2 border border-white/20 font-medium"
                    >
                        <FunnelIcon className="w-5 h-5" />
                        <span>{showFilters ? "Hide" : "Show"} filters</span>
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
                                Search filters
                            </h3>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium flex items-center gap-1"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search Input */}
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Search shift name
                                </label>
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="keywords"
                                        placeholder="Enter shift name..."
                                        value={filters.keywords}
                                        onChange={handleFilterChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Start Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Start time from
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
                                    End time to
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
                                    Reset
                                </button>
                                <button
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-sm"
                                >
                                    Apply
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
                        Shift list
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
                                    Shift name
                                </th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Start time
                                </th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    End time
                                </th>
                                <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Working hours
                                </th>
                                <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Shift type
                                </th>
                                <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
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
                                                    Night shift
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-sm font-medium">
                                                    <SunIcon className="w-4 h-4" />
                                                    Day shift
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
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelected(s);
                                                        setIsConfirmDialogOpen(true);
                                                    }}
                                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors group"
                                                    title="Delete"
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
                                                No shifts available
                                            </p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                                Add a new shift to get started
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

            {/* 🔹 Modal for add/edit */}
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

            {/* 🔹 Delete confirmation */}
            {isConfirmDialogOpen && (
                <ConfirmDialog
                    open={isConfirmDialogOpen}
                    title="Confirm delete"
                    message={`Are you sure you want to delete the shift "${selected?.name}"?`}
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
