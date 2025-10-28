import React from "react";
import { motion } from "framer-motion";

/**
 * props:
 *  - schedules: [{ start: Date | string, end: Date | string, title }]
 *  - date: string (yyyy-MM-dd)
 */
const TimelineChart = ({ schedules = [], date = new Date().toISOString().split("T")[0] }) => {
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);
    const now = new Date();

    const toPercentFromDate = (d) => {
        const dateObj = d instanceof Date ? d : new Date(d);
        const minutes = dateObj.getHours() * 60 + dateObj.getMinutes();
        return (minutes / (24 * 60)) * 100;
    };

    // ✅ Hàm xác định màu theo thời điểm
    const getStatusColor = (start, end) => {
        if (end < now) return "from-gray-400 to-gray-500"; // Quá khứ
        if (start <= now && now <= end) return "from-blue-500 to-indigo-500"; // Hiện tại
        return "from-green-400 to-emerald-500"; // Tương lai
    };

    return (
        <div className="relative w-full h-28 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900 shadow-sm transition-colors">
            {/* Vạch chia theo giờ */}
            {Array.from({ length: 25 }, (_, i) => (
                <div
                    key={i}
                    className="absolute top-0 h-full border-l border-gray-200/50 dark:border-gray-700/50"
                    style={{ left: `${(i / 24) * 100}%` }}
                />
            ))}

            {/* Đường hiện tại */}
            {date === now.toISOString().split("T")[0] && (
                <div
                    className="absolute top-0 h-full w-[2px] bg-red-500/70 shadow-md"
                    style={{ left: `${toPercentFromDate(now)}%` }}
                />
            )}

            {/* Các block timeline */}
            {schedules.map((s, idx) => {
                const startDate = new Date(s.start);
                const endDate = new Date(s.end);

                if (endDate < startOfDay || startDate > endOfDay) return null;

                const start = toPercentFromDate(startDate < startOfDay ? startOfDay : startDate);
                const end = toPercentFromDate(endDate > endOfDay ? endOfDay : endDate);
                const width = Math.max(end - start, 1);

                const gradient = getStatusColor(startDate, endDate);

                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className={`absolute top-5 h-8 rounded-lg text-xs flex items-center px-2 text-white font-medium shadow-md bg-gradient-to-r ${gradient} hover:brightness-110 transition-all duration-300`}
                        style={{ left: `${start}%`, width: `${width}%` }}
                        title={`${s.title}: ${startDate.toLocaleString()} → ${endDate.toLocaleString()}`}
                    >
                        {s.title}
                    </motion.div>
                );
            })}

            {/* Mốc giờ */}
            <div className="absolute bottom-1 w-full flex justify-between text-[10px] text-gray-600 dark:text-gray-400 px-2 select-none">
                {Array.from({ length: 25 }, (_, i) => (
                    <span key={i}>{i}h</span>
                ))}
            </div>
        </div>
    );
};

export default TimelineChart;
