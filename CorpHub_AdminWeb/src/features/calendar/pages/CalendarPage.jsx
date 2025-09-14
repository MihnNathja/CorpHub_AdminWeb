// pages/CalendarPage.jsx
import React, { useState, useEffect } from "react";
import EventModal from "../components/EventModal";
import { useSelector, useDispatch } from "react-redux";
import { addEvent, updateEvent, deleteEvent, loadEvents } from "../store/calendarSlice";
import CalendarView from "../components/CalendarView";

const CalendarPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [modalData, setModalData] = useState(null);
    const events = useSelector((state) => state.calendar.events);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadEvents());
    }, [dispatch]);

    const handleEventSave = (event) => {
        if (event.id) {
            dispatch(updateEvent(event));
        } else {
            dispatch(addEvent({ ...event, id: Date.now() }));
        }
        setModalData(null);
    };

    const handleEventClick = (event) => {
        setModalData(event);
    };

    return (
        <div className="text-gray-900 dark:text-gray-100">
            <h2 className="text-xl font-bold mb-4">My Calendar</h2>
            <CalendarView
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                events={events}
                onEventClick={handleEventClick}
            />
            {modalData && (
                <EventModal
                    event={modalData}
                    onClose={() => setModalData(null)}
                    onSave={handleEventSave}
                />
            )}
        </div>
    );
};

export default CalendarPage;
