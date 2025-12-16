import React, { useState } from "react";
import { List, BarChart2, Calendar } from "lucide-react";
import TimelineChart from "./TimelineChart";

const TimelineTab = ({ roomRequirements = [], loading, onDateChange }) => {
    const [view, setView] = useState("chart"); // chart | list
    const [selectedDate, setSelectedDate] = useState(() =>
        new Date().toISOString().split("T")[0]
    );

    // 👉 Format data for chart
    const schedules = roomRequirements.map((r, idx) => ({
        start: new Date(r.start),
        end: new Date(r.end),
        title: r.id ? "#" + r.id.substring(0, 10) : `Request ${idx + 1}`,
        color: ["bg-yellow-300", "bg-green-300", "bg-blue-300", "bg-red-300"][idx % 4],
        roomName: r.roomName,
        status: r.status,
    }));

    return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 shadow-inner border border-gray-200 dark:border-gray-700">
            {/* Header: date picker + view mode */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                            const newDate = e.target.value;
                            setSelectedDate(newDate);
                            if (onDateChange) onDateChange(newDate);
                        }}
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
                    <TimelineChart schedules={schedules} date={selectedDate} />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Daily timeline chart ({selectedDate})
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {schedules.length > 0 ? (
                        schedules.map((s, i) => (
                            <div
                                key={i}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 rounded-md bg-gray-100 dark:bg-gray-700"
                            >
                                <div className="font-medium">{s.title}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {s.start.toLocaleString()} → {s.end.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-400">{s.roomName}</div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No usage history available.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default TimelineTab;
