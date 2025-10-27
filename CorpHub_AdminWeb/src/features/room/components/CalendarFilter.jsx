// CalendarFilter.jsx
import React from "react";
import { Calendar } from "lucide-react";

const CalendarFilter = ({ selectedDate, onChange }) => {
    return (
        <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => onChange(e.target.value)}
                className="px-2 py-1 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-600"
            />
        </div>
    );
};

export default CalendarFilter;
