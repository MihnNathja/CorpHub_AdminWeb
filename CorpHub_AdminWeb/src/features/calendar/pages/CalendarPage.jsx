import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEvent, updateEvent, fetchMeetings } from "../store/calendarSlice";
import MyCalendar from "../components/MyCalendar";
import ButtonOutline from "../../global/components/ButtonOutline";
import EventFormModal from "../components/EventFormModal";
import EventDetailModal from "../components/EventDetailModal";
import { useTheme } from "../../../context/ThemeContext";
import { toLocal, toUtc } from "../../global/utils/timezone";

const CalendarPage = () => {
    const dispatch = useDispatch();
    const { meetings, loading, error } = useSelector((state) => state.events);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [slotInfo, setSlotInfo] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // load meetings từ backend khi vào trang
    useEffect(() => {
        dispatch(fetchMeetings());
    }, [dispatch]);

    const handleAddEvent = (eventData) => {
        // convert start/end về UTC trước khi lưu
        const startUtc = toUtc(eventData.start);
        const endUtc = toUtc(eventData.end);

        dispatch(addEvent({ id: Date.now(), ...eventData, start: startUtc, end: endUtc }));
        setIsModalOpen(false);
        setSlotInfo(null);
    };

    const handleSelectSlot = ({ start, end }) => {
        // convert start/end về giờ local để hiển thị trong form
        const localStart = toLocal(start);
        const localEnd = toLocal(end);

        console.log("Converted start:", localStart, "Converted end:", localEnd);
        setSlotInfo({ start: localStart, end: localEnd });
        setIsModalOpen(true);
    };

    const handleEventDrop = ({ event, start, end }) => {
        const startUtc = toUtc(start);
        const endUtc = toUtc(end);

        dispatch(updateEvent({ ...event, start: startUtc, end: endUtc }));
    };

    const handleDoubleClickEvent = (event) => {
        setSlotInfo({
            ...event,
            start: toLocal(event.start),
            end: toLocal(event.end),
        });
        setIsModalOpen(true);
    };

    const handleEditEvent = (event) => {
        setSlotInfo({
            ...event,
            start: toLocal(event.start),
            end: toLocal(event.end),
        });
        setIsModalOpen(true);
    };


    const { isDark } = useTheme();

    console.log(meetings);

    return (
        <div className="text-gray-900 dark:text-gray-700">
            <h1 className="text-xl font-bold dark:text-gray-100">Event Calendar</h1>

            <div className="flex justify-between items-center mb-4 mt-4">
                <ButtonOutline onClick={() => setIsModalOpen(true)} color={"green"}>
                    Add Event
                </ButtonOutline>
            </div>

            {loading && <p className="text-blue-500">Loading meetings...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            <MyCalendar
                events={(meetings || []).map((e) => ({
                    ...e,
                    start: toLocal(e.startTime),
                    end: toLocal(e.endTime),
                }))}
                onSelectSlot={handleSelectSlot}
                onEventDrop={handleEventDrop}
                onDoubleClickEvent={handleDoubleClickEvent}
                onEditEvent={handleEditEvent}
                theme={isDark ? "dark" : "light"}
            />

            {isModalOpen && (
                <EventFormModal
                    isOpen={isModalOpen}
                    slotInfo={slotInfo}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleAddEvent}
                />
            )}

            <EventDetailModal
                isOpen={!!selectedEvent}
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
            />

        </div>
    );
};

export default CalendarPage;
