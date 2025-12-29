import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import EventPopup from "./EventPopup";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "../../../assets/css/calendar-theme.css";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });
const DnDCalendar = withDragAndDrop(Calendar);

export default function MyCalendar({
    date,
    onNavigate,
    events,
    eventPropGetter,
    onSelectSlot,
    onEventDrop,
    onDoubleClickEvent,
    onEditEvent,
    onDelete,
    theme,
}) {
    const [popup, setPopup] = useState(null);

    const handleSelectEvent = (event, e) => {
        const target = e?.target || e?.currentTarget;
        const rect = target?.getBoundingClientRect
            ? target.getBoundingClientRect()
            : { right: e?.clientX || 0, top: e?.clientY || 0 };

        setPopup({
            event,
            position: {
                x: rect.right + 10,
                y: rect.top,
            },
        });
    };

    return (
        <div className={`calendar-wrapper ${theme === "dark" ? "calendar-dark" : "calendar-light"}`}>
            {/* Calendar Container */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-200 hover:shadow-md">
                <div className="p-6">
                    <DnDCalendar
                        date={date}
                        onNavigate={onNavigate}
                        localizer={localizer}
                        events={events}
                        eventPropGetter={eventPropGetter}
                        startAccessor="start"
                        endAccessor="end"
                        selectable
                        resizable
                        onSelectSlot={onSelectSlot}
                        onEventDrop={onEventDrop}
                        onEventResize={onEventDrop}
                        onDoubleClickEvent={onDoubleClickEvent}
                        onSelectEvent={handleSelectEvent}
                        style={{ height: 650 }}
                        className={`
                            calendar-content
                            rounded-xl
                            bg-white
                            dark:bg-gray-800
                            dark:text-gray-200
                            transition-colors
                            duration-200
                            border
                            border-gray-200
                            dark:border-gray-700
                            shadow-sm
                        `}
                        views={["month", "week", "day", "agenda"]}
                        defaultView="month"
                        popup={false}
                        step={30}
                        showMultiDayTimes
                        defaultDate={date}
                    />
                </div>

                {/* Calendar Footer Tips */}
                <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center gap-4">
                    {/* Legend */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Organizer</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Accepted</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-rose-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Declined</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Pending</span>
                        </div>
                    </div>

                    {/* Info Text */}
                    <div className="text-xs text-gray-500 dark:text-gray-500 italic ml-auto">
                        Tip: Use drag and drop to reschedule events
                    </div>
                </div>
            </div>

            {/* Event Popup */}
            {popup && (
                <EventPopup
                    event={popup.event}
                    position={popup.position}
                    onClose={() => setPopup(null)}
                    onEdit={(event) => {
                        setPopup(null);
                        setTimeout(() => {
                            onEditEvent?.({
                                ...event,
                                start: new Date(event.start),
                                end: new Date(event.end),
                            });
                        }, 0);
                    }}
                    onDelete={(id) => {
                        onDelete?.(id);
                        setPopup(null);
                    }}
                />
            )}
        </div>
    );
}
