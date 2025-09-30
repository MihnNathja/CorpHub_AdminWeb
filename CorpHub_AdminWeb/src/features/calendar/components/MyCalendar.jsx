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

export default function MyCalendar({ date, onNavigate, events, eventPropGetter, onSelectSlot, onEventDrop, onDoubleClickEvent, onEditEvent, onDelete, theme }) {
    const [popup, setPopup] = useState(null);

    const handleSelectEvent = (event, e) => {
        // Lấy vị trí để đặt popup cạnh event
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
        <div className={theme === "dark" ? "calendar-dark" : "calendar-light"
        }>
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
                style={{ height: 600, }}
                className={`rounded-xl shadow-lg p-4 bg-white dark:bg-gray-800 dark:text-gray-200 transition-colors`}
            />

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
                    }
                    }
                    onDelete={(id) => {
                        onDelete?.(id);
                        setPopup(null);
                    }}
                />

            )}
        </div >
    );
}
