import React from "react";

const TimelineChart = ({ schedules }) => {
    const colors = [
        "bg-yellow-300",
        "bg-red-300",
        "bg-green-300",
        "bg-blue-300",
        "bg-purple-300",
    ];

    const toPercent = (time) => {
        const [h, m] = time.split(":").map(Number);
        return ((h * 60 + m) / (24 * 60)) * 100;
    };

    return (
        <div className="w-full p-4">
            {/* Thanh timeline */}
            <div className="relative w-full h-20 border-b border-gray-400">
                {/* Vạch chia theo giờ */}
                {Array.from({ length: 25 }, (_, i) => (
                    <div
                        key={i}
                        className="absolute top-0 h-full border-l border-gray-200 dark:border-gray-700"
                        style={{ left: `${(i / 24) * 100}%` }}
                    />
                ))}

                {/* Các block schedule */}
                {schedules.map((s, idx) => {
                    const start = toPercent(s.start);
                    const end = toPercent(s.end);
                    const width = end - start;

                    return (
                        <div
                            key={idx}
                            className={`absolute top-4 h-8 rounded text-xs flex items-center px-2 shadow cursor-pointer ${colors[idx % colors.length]}`}
                            style={{ left: `${start}%`, width: `${width}%` }}
                            title={`${s.title}: ${s.start} - ${s.end}`}
                        >
                            {s.title}
                        </div>
                    );
                })}
            </div>

            {/* Các mốc giờ */}
            <div className="relative flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                {Array.from({ length: 25 }, (_, i) => (
                    <span key={i} className="absolute" style={{ left: `${(i / 24) * 100}%` }}>
                        {i}h
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TimelineChart;
