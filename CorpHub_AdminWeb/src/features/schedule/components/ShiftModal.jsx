import React, { useState, useEffect, useRef } from "react";
import {
    XMarkIcon,
    ClockIcon,
    MoonIcon,
    CheckCircleIcon,
    ExclamationCircleIcon  // ✅ Changed from AlertCircle
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const ShiftModal = ({ shift, onClose, onSubmit }) => {
    const [form, setForm] = useState(
        shift || {
            name: "",
            startTime: "08:00",
            endTime: "17:00",
            workingHours: 8,
            isNightShift: false,
        }
    );

    const [errors, setErrors] = useState({});
    const isDirtyRef = useRef(false);

    // 🔹 Calculate working hours between two time points
    const calculateHours = (start, end) => {
        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);
        let startMins = sh * 60 + sm;
        let endMins = eh * 60 + em;

        // Night shift → add 24 hours
        if (endMins < startMins) endMins += 24 * 60;

        const totalHours = (endMins - startMins) / 60;
        return Math.round(totalHours * 100) / 100;
    };

    // 🔹 Update working hours and isNightShift whenever start or end time changes
    useEffect(() => {
        if (!isDirtyRef.current) return;

        const newHours = calculateHours(form.startTime, form.endTime);
        const isNightShift = form.endTime < form.startTime; // ✅ Automatically determine night shift

        setForm((prev) => ({
            ...prev,
            workingHours: newHours,
            isNightShift: isNightShift, // ✅ Auto update
        }));
    }, [form.startTime, form.endTime]);

    // Handle input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // When user changes time → enable flag
        if (name === "startTime" || name === "endTime") {
            isDirtyRef.current = true;
        }

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });

        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Shift name is required";
        if (!form.startTime) newErrors.startTime = "Start time is required";
        if (!form.endTime) newErrors.endTime = "End time is required";
        if (!form.workingHours || form.workingHours <= 0) newErrors.workingHours = "Working hours must be greater than 0";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit(form);
            onClose();
        }
    };

    const isNightShift = form.endTime < form.startTime;

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 overflow-hidden">

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
                                    <ClockIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">
                                        {shift ? "Edit Shift" : "Add New Shift"}
                                    </h2>
                                    <p className="text-xs text-white/80">
                                        {shift ? "Update shift information" : "Create a new shift in the system"}
                                    </p>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-6 space-y-4">

                        {/* Shift Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <ClockIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                Shift Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g., Morning shift, Afternoon shift, Night shift..."
                                value={form.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all
                                    ${errors.name
                                        ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                        : "border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20"
                                    }
                                    bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                                    focus:outline-none`}
                            />
                            {errors.name && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                                >
                                    <ExclamationCircleIcon className="w-3 h-3" />
                                    {errors.name}
                                </motion.p>
                            )}
                        </div>

                        {/* Start Time - End Time */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Start Time */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    <ClockIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    Start <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={form.startTime}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all
                                        ${errors.startTime
                                            ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                            : "border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20"
                                        }
                                        bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                        focus:outline-none cursor-pointer`}
                                />
                                {errors.startTime && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs text-red-600 dark:text-red-400 mt-1"
                                    >
                                        {errors.startTime}
                                    </motion.p>
                                )}
                            </div>

                            {/* End Time */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    <ClockIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    End <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={form.endTime}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all
                                        ${errors.endTime
                                            ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                            : "border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20"
                                        }
                                        bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                        focus:outline-none cursor-pointer`}
                                />
                                {errors.endTime && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs text-red-600 dark:text-red-400 mt-1"
                                    >
                                        {errors.endTime}
                                    </motion.p>
                                )}
                            </div>
                        </div>

                        {/* Info box for night shift */}
                        {isNightShift && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700"
                            >
                                <div className="flex items-start gap-3">
                                    <MoonIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                                            This is a night shift
                                        </p>
                                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                                            This shift extends past midnight (end time &lt; start time)
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Working Hours */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <CheckCircleIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                Working Hours <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.25"
                                    name="workingHours"
                                    placeholder="Working hours"
                                    value={form.workingHours}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all
                                        ${errors.workingHours
                                            ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                            : "border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20"
                                        }
                                        bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                        focus:outline-none`}
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                    h
                                </span>
                            </div>
                            {errors.workingHours && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-red-600 dark:text-red-400 mt-1"
                                >
                                    {errors.workingHours}
                                </motion.p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                💡 Automatically calculated from start and end times, but can be manually adjusted
                            </p>
                        </div>

                        {/* Night Shift - Checkbox (Read-only) */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 cursor-default"
                        >
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    name="isNightShift"
                                    checked={form.isNightShift}
                                    readOnly // ✅ Read-only, cannot be manually edited
                                    className="w-5 h-5 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-default appearance-none bg-white dark:bg-gray-800 checked:bg-amber-600 checked:border-amber-600 transition-all"
                                />
                                <motion.div
                                    animate={form.isNightShift ? { scale: 1 } : { scale: 0 }}
                                    className="absolute w-5 h-5 flex items-center justify-center pointer-events-none"
                                >
                                    <CheckCircleIcon className="w-5 h-5 text-white" />
                                </motion.div>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-700 dark:text-gray-300">Night shift</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    A shift that works during nighttime hours
                                </p>
                            </div>
                            <MoonIcon className={`w-5 h-5 transition-all ${form.isNightShift ? "text-amber-600" : "text-gray-400"}`} />
                        </motion.div>

                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
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
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all"
                        >
                            {shift ? "Update" : "Add"}
                        </motion.button>
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ShiftModal;
