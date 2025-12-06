import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, AlertCircle } from "lucide-react";

/**
 * props:
 *  - schedules: [{ start: Date | string, end: Date | string, title, organizer?, attendees? }]
 *  - date: string (yyyy-MM-dd)
 */
const TimelineChart = ({ schedules = [], date = new Date().toISOString().split("T")[0] }) => {
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);
    const now = new Date();
    const isToday = date === now.toISOString().split("T")[0];

    const toPercentFromDate = (d) => {
        const dateObj = d instanceof Date ? d : new Date(d);
        const minutes = dateObj.getHours() * 60 + dateObj.getMinutes();
        return (minutes / (24 * 60)) * 100;
    };

    // Format time display
    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    // Get status color with better gradients
    const getStatusColor = (start, end) => {
        if (end < now) {
            return {
                gradient: "from-gray-400 to-gray-500",
                label: "Past",
                bgLight: "bg-gray-100 dark:bg-gray-900/30",
                textLight: "text-gray-700 dark:text-gray-300",
            };
        }
        if (start <= now && now <= end) {
            return {
                gradient: "from-blue-500 via-indigo-500 to-indigo-600",
                label: "Ongoing",
                bgLight: "bg-blue-100 dark:bg-blue-900/30",
                textLight: "text-blue-700 dark:text-blue-300",
            };
        }
        return {
            gradient: "from-emerald-400 to-teal-500",
            label: "Upcoming",
            bgLight: "bg-emerald-100 dark:bg-emerald-900/30",
            textLight: "text-emerald-700 dark:text-emerald-300",
        };
    };

    // Calculate statistics
    const stats = useMemo(() => {
        const ongoing = schedules.filter(
            (s) => new Date(s.start) <= now && now <= new Date(s.end)
        ).length;
        const upcoming = schedules.filter((s) => new Date(s.start) > now).length;
        const completed = schedules.filter((s) => new Date(s.end) < now).length;

        return { ongoing, upcoming, completed };
    }, [schedules]);

    if (schedules.length === 0) {
        return (
            <div className="w-full rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 p-8 shadow-sm">
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="p-3 rounded-xl bg-gray-200 dark:bg-gray-800">
                        <Clock className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            No events scheduled
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {isToday ? "Nothing planned for today" : "No events on this date"}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                        Upcoming
                    </p>
                    <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                        {stats.upcoming}
                    </p>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                        Ongoing
                    </p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                        {stats.ongoing}
                    </p>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Completed
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {stats.completed}
                    </p>
                </div>
            </div>

            {/* Timeline Chart */}
            <div className="relative w-full rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-sm transition-colors">
                {/* Hour Grid Lines */}
                <div className="absolute inset-0 flex">
                    {Array.from({ length: 24 }, (_, i) => (
                        <div
                            key={i}
                            className="flex-1 border-r border-gray-200/40 dark:border-gray-700/40 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
                        />
                    ))}
                </div>

                {/* Current Time Indicator */}
                {isToday && (
                    <div className="absolute top-0 h-full w-1 bg-gradient-to-b from-rose-500 via-red-500 to-transparent shadow-lg z-20 pointer-events-none"
                        style={{ left: `${toPercentFromDate(now)}%` }}
                    >
                        <div className="absolute -top-3 -left-2 w-5 h-5 rounded-full bg-rose-500 border-2 border-white dark:border-gray-900 shadow-md" />
                    </div>
                )}

                {/* Events Container */}
                <div className="relative h-32 px-2 py-3">
                    {schedules.map((s, idx) => {
                        const startDate = new Date(s.start);
                        const endDate = new Date(s.end);

                        if (endDate < startOfDay || startDate > endOfDay) return null;

                        const start = toPercentFromDate(startDate < startOfDay ? startOfDay : startDate);
                        const end = toPercentFromDate(endDate > endOfDay ? endOfDay : endDate);
                        const width = Math.max(end - start, 2);
                        const statusColor = getStatusColor(startDate, endDate);

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scaleX: 0.8 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                className="absolute top-3 group"
                                style={{
                                    left: `${start}%`,
                                    width: `${width}%`,
                                    transformOrigin: "left",
                                }}
                            >
                                {/* Event Block */}
                                <div
                                    className={`
                                        h-10 rounded-lg px-2.5 py-1.5 flex items-center justify-between
                                        bg-gradient-to-r ${statusColor.gradient}
                                        text-white text-xs font-semibold
                                        shadow-md hover:shadow-lg hover:brightness-110
                                        border border-white/30 backdrop-blur-sm
                                        transition-all duration-300 cursor-pointer
                                        overflow-hidden hover:z-30
                                    `}
                                    title={`${s.title}\n${formatTime(startDate)} - ${formatTime(endDate)}\n${statusColor.label}`}
                                >
                                    <span className="truncate flex-1">{s.title}</span>
                                    {width > 80 && (
                                        <span className="text-[10px] opacity-80 ml-1 flex-shrink-0">
                                            {formatTime(startDate)}
                                        </span>
                                    )}
                                </div>

                                {/* Tooltip on Hover */}
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-40 pointer-events-none whitespace-nowrap">
                                    <div className="bg-gray-900 dark:bg-gray-950 text-white text-xs rounded-lg px-3 py-2 shadow-lg border border-gray-800">
                                        <p className="font-semibold">{s.title}</p>
                                        <p className="text-gray-300 text-[10px] mt-0.5">
                                            {formatTime(startDate)} - {formatTime(endDate)}
                                        </p>
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-950 rotate-45" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Hour Labels */}
                <div className="relative h-6 flex border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
                    {Array.from({ length: 24 }, (_, i) => (
                        <div
                            key={i}
                            className="flex-1 flex items-center justify-center text-[10px] font-semibold text-gray-500 dark:text-gray-500 border-r border-gray-200/40 dark:border-gray-700/40"
                        >
                            {i}
                        </div>
                    ))}
                    <div className="w-12 flex items-center justify-center text-[10px] font-semibold text-gray-500 dark:text-gray-500">
                        h
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gradient-to-r from-emerald-400 to-teal-500" />
                    <span className="text-gray-600 dark:text-gray-400">Upcoming</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gradient-to-r from-blue-500 to-indigo-600" />
                    <span className="text-gray-600 dark:text-gray-400">Ongoing</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gradient-to-r from-gray-400 to-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Completed</span>
                </div>
            </div>
        </div>
    );
};

export default TimelineChart;
