import React from "react";

const colors = [
    "bg-yellow-300",
    "bg-red-300",
    "bg-green-300",
    "bg-blue-300",
    "bg-purple-300",
];

/**
 * props:
 *  - schedules: [{ start: Date | string, end: Date | string, title, color }]
 *  - date: string (yyyy-MM-dd) => để xác định biểu đồ của ngày nào
 */
const TimelineChart = ({ schedules = [], date = new Date().toISOString().split("T")[0] }) => {
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    const toPercentFromDate = (d) => {
        const dateObj = d instanceof Date ? d : new Date(d);
        const minutes = dateObj.getHours() * 60 + dateObj.getMinutes();
        return (minutes / (24 * 60)) * 100;
    };

    return (
        <div className="relative w-full h-24 border-b border-gray-400">
            {/* Vạch chia theo giờ */}
            {Array.from({ length: 25 }, (_, i) => (
                <div
                    key={i}
                    className="absolute top-0 h-full border-l border-gray-200 dark:border-gray-700"
                    style={{ left: `${(i / 24) * 100}%` }}
                />
            ))}

            {/* Các block timeline */}
            {schedules.map((s, idx) => {
                const startDate = new Date(s.start);
                const endDate = new Date(s.end);

                // Nếu không giao ngày được chọn thì bỏ qua
                if (endDate < startOfDay || startDate > endOfDay) return null;

                // Giới hạn block trong phạm vi 00:00–23:59
                const start = toPercentFromDate(
                    startDate < startOfDay ? startOfDay : startDate
                );
                const end = toPercentFromDate(
                    endDate > endOfDay ? endOfDay : endDate
                );

                const width = Math.max(end - start, 1); // đảm bảo không âm

                return (
                    <div
                        key={idx}
                        className={`absolute top-4 h-8 rounded text-xs flex items-center px-2 shadow cursor-pointer truncate ${colors[idx % colors.length]}`}
                        style={{ left: `${start}%`, width: `${width}%` }}
                        title={`${s.title}: ${startDate.toLocaleString()} → ${endDate.toLocaleString()}`}
                    >
                        {s.title}
                    </div>
                );
            })}

            {/* Mốc giờ */}
            <div className="absolute bottom-0 w-full flex justify-between text-[10px] text-gray-600 dark:text-gray-400 mt-1">
                {Array.from({ length: 25 }, (_, i) => (
                    <span key={i}>{i}h</span>
                ))}
            </div>
        </div>
    );
};

export default TimelineChart;
