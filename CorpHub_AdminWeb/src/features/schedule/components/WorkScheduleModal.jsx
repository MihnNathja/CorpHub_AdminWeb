import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Calendar,
    Clock,
    Users,
    CheckCircle,
    AlertTriangle,
    Trash2,
    Search,
    User,
} from "lucide-react";
import ConfirmDialog from "../../global/components/ConfirmDialog";

const WorkScheduleModal = ({
    schedule,
    shifts = [],
    users = [],
    userKeyword,
    setUserKeyword,
    onClose,
    onSubmit,
    onDelete
}) => {
    const [form, setForm] = useState(
        schedule || {
            id: "",
            userId: "",
            shiftId: "",
            workDate: "",
            status: "SCHEDULED",
        }
    );
    const [errors, setErrors] = useState({});
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (schedule) {
            setForm({
                id: schedule.id || "",
                userId: schedule.userId || "",
                shiftId: schedule.shiftId || "",
                workDate: schedule.workDate || "",
                status: schedule.status || "SCHEDULED",
            });

            if (schedule.fullName) {
                setUserKeyword(schedule.fullName);
            } else if (schedule.userId) {
                const user = users.find((u) => u.id === schedule.userId);
                if (user) setUserKeyword(user.fullName);
            }
        } else {
            setForm({
                userId: "",
                shiftId: "",
                workDate: "",
                status: "SCHEDULED",
            });
            setUserKeyword("");
        }
        setErrors({});
    }, [schedule, users, setUserKeyword]);

    const currentShift =
        shifts.find((s) => s.id === form.shiftId) || schedule?.shift || null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSelectUser = (user) => {
        setForm((prev) => ({ ...prev, userId: user.id }));
        setUserKeyword(user.fullName);
        setShowUserDropdown(false);
        setErrors((prev) => ({ ...prev, userId: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.userId) newErrors.userId = "Please select an employee";
        if (!form.shiftId) newErrors.shiftId = "Please select a shift";
        if (!form.workDate) newErrors.workDate = "Please select a work date";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        onSubmit(form);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setUserKeyword(value);
        setForm((prev) => ({ ...prev, userId: "" }));
        setShowUserDropdown(value.trim() !== "");
        setErrors((prev) => ({ ...prev, userId: "" }));
    };

    const handleDelete = () => {
        if (!schedule?.id) return;
        setConfirmDelete(true);
    };

    const handleConfirmDelete = () => {
        onDelete(schedule.id);
        setConfirmDelete(false);
    };

    const statusConfig = {
        SCHEDULED: {
            label: "Scheduled",
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            icon: Calendar,
        },
        IN_PROGRESS: {
            label: "In progress",
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50 dark:bg-purple-900/20",
            icon: Clock,
        },
        COMPLETED: {
            label: "Completed",
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            icon: CheckCircle,
        },
        MISSED: {
            label: "Missed",
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-900/20",
            icon: AlertTriangle,
        },
        CANCELLED: {
            label: "Cancelled",
            color: "text-gray-600 dark:text-gray-400",
            bg: "bg-gray-50 dark:bg-gray-900/20",
            icon: X,
        },
        ABSENCE: {
            label: "On leave",
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-900/20",
            icon: AlertTriangle,
        },
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                    {/* Header with gradient */}
                    <div className="relative bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-6 py-5 text-white">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl"
                        />

                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">
                                        {schedule ? "Edit work schedule" : "Add work schedule"}
                                    </h2>
                                    <p className="text-xs text-white/80">
                                        {schedule ? "Update schedule information" : "Create a new work schedule"}
                                    </p>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-5">
                        {/* Employee - REQUIRED */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                Employee <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Search employee..."
                                    value={userKeyword || users.find((u) => u.id === form.userId)?.fullName || ""}
                                    onChange={handleInputChange}
                                    onFocus={() => setShowUserDropdown(userKeyword.trim() !== "")}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all
                                        ${errors.userId
                                            ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                            : "border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20"
                                        }
                                        bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                                        focus:outline-none`}
                                />

                                {/* User Dropdown */}
                                <AnimatePresence>
                                    {showUserDropdown && users.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-xl"
                                        >
                                            {users.map((u) => (
                                                <motion.button
                                                    key={u.id}
                                                    whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                                                    type="button"
                                                    onClick={() => handleSelectUser(u)}
                                                    className={`w-full text-left px-4 py-3 text-sm transition-colors
                                                        ${form.userId === u.id
                                                            ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold"
                                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4 opacity-50" />
                                                        <span>{u.fullName}</span>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            {errors.userId && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                                >
                                    <AlertTriangle className="w-3 h-3" />
                                    {errors.userId}
                                </motion.p>
                            )}
                        </div>

                        {/* Shift - REQUIRED */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                Shift <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="shiftId"
                                required
                                value={form.shiftId}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all
                                    ${errors.shiftId
                                        ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                        : "border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20"
                                    }
                                    bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                    focus:outline-none cursor-pointer`}
                            >
                                <option value="">
                                    {currentShift
                                        ? `${currentShift.name} (${currentShift.startTime} - ${currentShift.endTime})`
                                        : "-- Select a shift --"}
                                </option>
                                {shifts.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} ({s.startTime} - {s.endTime})
                                    </option>
                                ))}
                            </select>
                            {errors.shiftId && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                                >
                                    <AlertTriangle className="w-3 h-3" />
                                    {errors.shiftId}
                                </motion.p>
                            )}
                        </div>

                        {/* Work Date - REQUIRED */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                Work date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="workDate"
                                required
                                value={form.workDate}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all
                                    ${errors.workDate
                                        ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                        : "border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20"
                                    }
                                    bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                    focus:outline-none cursor-pointer`}
                            />
                            {errors.workDate && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                                >
                                    <AlertTriangle className="w-3 h-3" />
                                    {errors.workDate}
                                </motion.p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                Status
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(statusConfig).map(([key, config]) => {
                                    const Icon = config.icon;
                                    const isSelected = form.status === key;
                                    return (
                                        <motion.button
                                            key={key}
                                            type="button"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setForm((prev) => ({ ...prev, status: key }))
                                            }
                                            className={`relative p-3 rounded-xl border-2 transition-all text-left
                                                ${isSelected
                                                    ? `${config.bg} border-current ${config.color} shadow-md`
                                                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Icon className={`w-4 h-4 ${isSelected ? config.color : ""}`} />
                                                <span className="text-xs font-semibold">{config.label}</span>
                                            </div>
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="statusIndicator"
                                                    className="absolute inset-0 rounded-xl border-2 border-current"
                                                />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        {schedule?.id ? (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleDelete}
                                className="px-4 py-2.5 rounded-xl border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </motion.button>
                        ) : (
                            <div />
                        )}

                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                {schedule ? "Update" : "Add new"}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            <ConfirmDialog
                open={confirmDelete}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa lịch làm việc này không?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete(false)}
            />
        </AnimatePresence>
    );
};

export default WorkScheduleModal;
