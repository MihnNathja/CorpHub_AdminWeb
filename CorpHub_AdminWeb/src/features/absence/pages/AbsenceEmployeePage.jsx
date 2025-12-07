import React, { useState } from "react";
import dayjs from "dayjs";
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { Calendar, AlertCircle, Loader2, CheckCircle, Clock, XCircle } from "lucide-react";
import FloatingButton from "../../global/components/FloatingButton";
import { useAbsenceRequest } from "../hooks/useAbsenceRequest";
import AbsenceRequestModal from "../components/AbsenceRequestModal";
import Pagination from "../../global/components/Pagination";
import { motion } from "framer-motion";

const statusConfig = {
    PENDING: {
        bg: "bg-amber-50 dark:bg-amber-900/20",
        border: "border-amber-200 dark:border-amber-800",
        text: "text-amber-700 dark:text-amber-300",
        badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
        icon: Clock,
    },
    APPROVED: {
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        border: "border-emerald-200 dark:border-emerald-800",
        text: "text-emerald-700 dark:text-emerald-300",
        badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
        icon: CheckCircle,
    },
    REJECTED: {
        bg: "bg-rose-50 dark:bg-rose-900/20",
        border: "border-rose-200 dark:border-rose-800",
        text: "text-rose-700 dark:text-rose-300",
        badge: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
        icon: XCircle,
    },
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

    const totalPages = meta?.totalPages ?? 1;
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

    const statusCounts = {
        PENDING: absenceRequests.filter(r => r.status === "PENDING").length,
        APPROVED: absenceRequests.filter(r => r.status === "APPROVED").length,
        REJECTED: absenceRequests.filter(r => r.status === "REJECTED").length,
    };

    return (
        <div className="space-y-6">
            {/* Floating Button */}
            <FloatingButton
                onClick={openAdd}
                icon={PlusIcon}
                tooltip="New absence request"
                color="green"
            />

            {/* Hero Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-white/80 uppercase tracking-wide">My Records</p>
                        <h1 className="text-3xl font-bold">Absence Requests</h1>
                    </div>
                </div>
                <p className="text-sm text-white/70 ml-16">
                    View and manage your absence and leave requests
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Pending", count: statusCounts.PENDING, icon: Clock, color: "amber" },
                    { label: "Approved", count: statusCounts.APPROVED, icon: CheckCircle, color: "emerald" },
                    { label: "Rejected", count: statusCounts.REJECTED, icon: XCircle, color: "rose" },
                ].map((stat) => {
                    const Icon = stat.icon;
                    const colorClasses = {
                        amber: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300",
                        emerald: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300",
                        rose: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300",
                    };

                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl border ${colorClasses[stat.color]}`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-1">
                                        {stat.label}
                                    </p>
                                    <p className="text-3xl font-bold">{stat.count}</p>
                                </div>
                                <Icon className="w-8 h-8 opacity-40" />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                My Requests
                            </h2>
                        </div>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                            {absenceRequests.length} request{absenceRequests.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                            <p className="text-gray-600 dark:text-gray-400 font-medium">Loading requests...</p>
                        </div>
                    ) : absenceRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-700" />
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                No requests yet
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Create your first absence request to get started
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs">
                                        Absence Type
                                    </th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs">
                                        Start Date
                                    </th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs">
                                        End Date
                                    </th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs">
                                        Reason
                                    </th>
                                    <th className="px-6 py-4 text-center font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-center font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {absenceRequests.map((item, idx) => {
                                    const config = statusConfig[item.status] || statusConfig.PENDING;
                                    const StatusIcon = config.icon;
                                    const canEdit = item.status === "PENDING";

                                    return (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {item.absenceType?.name || "N/A"}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                                {dayjs(item.startDate).format("DD/MM/YYYY")}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                                {dayjs(item.endDate).format("DD/MM/YYYY")}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                                {item.reason || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${config.badge}`}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    {canEdit && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => openEdit(item)}
                                                            className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <PencilSquareIcon className="w-4 h-4" />
                                                        </motion.button>
                                                    )}
                                                    {canEdit && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </motion.button>
                                                    )}
                                                    {!canEdit && (
                                                        <span className="text-xs text-gray-400 italic px-2">
                                                            Read-only
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <Pagination
                            page={page}
                            setPage={setPage}
                            totalPages={totalPages}
                        />
                    </div>
                )}
            </div>

            {/* Modal */}
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
