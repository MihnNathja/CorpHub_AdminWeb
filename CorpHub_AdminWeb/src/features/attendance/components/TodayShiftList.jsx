import React from "react";
import ShiftCard from "./ShiftCard";
import { Clock, Calendar, Zap, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TodayShiftList({
    schedules = [],
    selectedShift = null,
    suggestedShift = null,
    finalShift = null,
    onSelect
}) {
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    return (
        <div className="space-y-4">
            {/* Header Section */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Today's Shifts
                            </h2>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                {today}
                            </p>
                        </div>
                    </div>

                    {/* Shift Count Badge */}
                    <div className="px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800">
                        <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                            {schedules.length} shifts
                        </span>
                    </div>
                </div>

                {/* Suggested Shift Banner */}
                {suggestedShift && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-2"
                    >
                        <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                                💡 Suggested shift
                            </p>
                            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                Shift <span className="font-semibold">{suggestedShift.shift?.name}</span> is suggested based on the current time
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Shifts Grid */}
            {schedules.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    <AnimatePresence mode="popLayout">
                        {schedules.map((ws, idx) => {
                            const shift = ws.shift;

                            return (
                                <motion.div
                                    key={ws.id || idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: idx * 0.05 }}
                                    layout
                                >
                                    <ShiftCard
                                        ws={ws}
                                        shift={shift}
                                        isSelected={selectedShift?.id === ws.id}
                                        isSuggested={suggestedShift?.id === ws.id}
                                        isFinal={finalShift?.id === ws.id}
                                        onSelect={() => onSelect(ws)}
                                    />
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-12 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center space-y-3"
                >
                    <Clock className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto" />
                    <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">
                            No shifts today
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            You are not scheduled to work today
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Legend Section */}
            {schedules.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                >
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                        Legend
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-200 dark:ring-amber-800" />
                            <span className="text-xs text-gray-700 dark:text-gray-300">
                                Suggested shift
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-200 dark:ring-blue-800" />
                            <span className="text-xs text-gray-700 dark:text-gray-300">
                                Selected shift
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-800" />
                            <span className="text-xs text-gray-700 dark:text-gray-300">
                                Current shift
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Helper Text */}
            {schedules.length > 0 && !selectedShift && !finalShift && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 justify-center"
                >
                    <AlertCircle className="w-4 h-4" />
                    <span>Click a shift to select</span>
                </motion.div>
            )}
        </div>
    );
}
