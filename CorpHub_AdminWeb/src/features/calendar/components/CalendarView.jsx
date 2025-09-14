// components/CalendarView.jsx
import React from "react";
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    format,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday,
} from "date-fns";
import EventItem from "./EventItem";

const CalendarView = ({ selectedDate, onDateChange, events, onEventClick }) => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const nextMonth = () => onDateChange(addMonths(selectedDate, 1));
    const prevMonth = () => onDateChange(subMonths(selectedDate, 1));
    const goToday = () => onDateChange(new Date());

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            const formattedDate = format(day, dateFormat);
            const cloneDay = day;
            const dayEvents = events.filter((event) =>
                isSameDay(new Date(event.date), cloneDay)
            );

            days.push(
                <div
                    key={day}
                    className={`border p-2 h-32 text-sm relative cursor-pointer
    ${!isSameMonth(day, monthStart)
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-400"
                            : "bg-white dark:bg-gray-800"}
    ${isToday(day) ? "border-2 border-blue-500" : ""}
  `}
                    onClick={() => onDateChange(cloneDay)}
                >
                    <div
                        className={`font-semibold w-6 h-6 flex items-center justify-center rounded-full ${isToday(day)
                                ? "bg-blue-500 text-white"
                                : ""
                            }`}
                    >
                        {formattedDate}
                    </div>
                    <div className="overflow-y-auto max-h-24 space-y-1 mt-1">
                        {dayEvents.map((event) => (
                            <EventItem key={event.id} event={event} onClick={() => onEventClick(event)} />
                        ))}
                    </div>
                </div>

            );
            day = addDays(day, 1);
        }
        rows.push(<div key={day} className="grid grid-cols-7">{days}</div>);
        days = [];
    }

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const monthYearFormat = "MMMM yyyy";

    return (
        <div>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={prevMonth}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    ← Prev
                </button>

                <div className="text-lg font-bold text-center">
                    {format(monthStart, monthYearFormat)}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={goToday}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Today
                    </button>
                    <button
                        onClick={nextMonth}
                        className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        Next →
                    </button>
                </div>
            </div>


            {/* Week Days */}
            <div className="grid grid-cols-7 bg-gray-100 dark:bg-gray-700 text-center font-bold">
                {weekDays.map((day) => (
                    <div key={day} className="py-2">{day}</div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div>{rows}</div>
        </div>
    );
};

export default CalendarView;
