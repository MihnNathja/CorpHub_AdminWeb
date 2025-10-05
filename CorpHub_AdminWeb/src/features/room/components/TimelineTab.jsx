import React, { useState } from "react";
import { Calendar, List, BarChart2 } from "lucide-react";

const TimelineTab = () => {
    const [view, setView] = useState("chart"); // chart | list
    const [selectedDate, setSelectedDate] = useState("2025-10-02");

    // fake timeline demo
    const schedules = [
        { start: "06:00", end: "10:00", title: "Lịch 1", color: "bg-yellow-300" },
        { start: "10:00", end: "15:00", title: "Lịch 2", color: "bg-red-300" },
        { start: "15:00", end: "20:00", title: "Lịch 3", color: "bg-green-300" },
    ];

    // convert -> vị trí trên timeline
    const toMinutes = (t) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 shadow-inner border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-2 py-1 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-600"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView("chart")}
                        className={`p-1.5 rounded-md ${view === "chart"
                            ? "bg-blue-100 text-blue-600"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                    >
                        <BarChart2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setView("list")}
                        className={`p-1.5 rounded-md ${view === "list"
                            ? "bg-blue-100 text-blue-600"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            {view === "chart" ? (
                <div>
                    {/* timeline chart */}
                    <div className="relative w-full h-16 border-t border-b border-gray-300 dark:border-gray-600 mb-4">
                        {/* time labels */}
                        <div className="absolute inset-x-0 -bottom-5 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <span key={i}>{i * 4}h</span>
                            ))}
                        </div>
                        {/* blocks */}
                        {schedules.map((sch, idx) => {
                            const start = toMinutes(sch.start);
                            const end = toMinutes(sch.end);
                            const left = (start / 1440) * 100;
                            const width = ((end - start) / 1440) * 100;
                            return (
                                <div
                                    key={idx}
                                    className={`absolute top-1/2 -translate-y-1/2 h-6 rounded-md text-xs flex items-center px-2 ${sch.color}`}
                                    style={{ left: `${left}%`, width: `${width}%` }}
                                >
                                    {sch.title}
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Biểu đồ timeline trong ngày ({selectedDate})
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {schedules.map((s, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-2 rounded-md bg-gray-100 dark:bg-gray-700"
                        >
                            <span className="font-medium">{s.title}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                {s.start} - {s.end}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TimelineTab;
