import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeetings, updateEvent, createOrUpdateMeeting, removeMeeting } from "../store/calendarSlice";
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
    const { isDark } = useTheme();

    useEffect(() => {
        dispatch(fetchMeetings());
    }, [dispatch]);

    const handleAddUpdateEvent = async (eventData) => {
        const payload = {
            id: eventData.id ?? null,
            title: eventData.title,
            subject: eventData.subject,
            description: eventData.description,
            location: eventData.location,
            onlineLink: eventData.onlineLink,
            to: eventData.to,
            start: (eventData.start).toISOString(),
            end: (eventData.end).toISOString(),
        };

        const action = await dispatch(createOrUpdateMeeting(payload));
        if (createOrUpdateMeeting.fulfilled.match(action)) {
            dispatch(updateEvent(action.payload));
            setIsModalOpen(false);
            setSlotInfo(null);
        } else {
            console.error("Create meeting failed:", action.payload || action.error);
        }
    };

    const handleEditEvent = (event) => {
        setSlotInfo({
            ...event,
            start: toLocal(event.start),
            end: toLocal(event.end),
        });
        setIsModalOpen(true);
    };

    const handleDeleteEvent = async (id) => {
        const action = await dispatch(removeMeeting(id));
        if (removeMeeting.fulfilled.match(action)) {
            // Redux state sẽ tự cập nhật meetings
            console.log("Deleted successfully", id);
        } else {
            console.error("Delete failed", action.payload || action.error);
        }
    };


    return (
        <div className="text-gray-900 dark:text-gray-100">
            <h1 className="text-xl font-bold">Event Calendar</h1>

            <div className="flex justify-between items-center mb-4 mt-4">
                <ButtonOutline onClick={() => setIsModalOpen(true)} color="green">
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
                onSelectSlot={({ start, end }) => {
                    setSlotInfo({ start: toLocal(start), end: toLocal(end) });
                    setIsModalOpen(true);
                }}
                onEventDrop={({ event, start, end }) => {
                    handleAddUpdateEvent({
                        ...event,
                        start,
                        end,
                    });
                }}
                onDoubleClickEvent={(event) => {
                    setSlotInfo({ ...event, start: toLocal(event.start), end: toLocal(event.end) });
                    setIsModalOpen(true);
                }}
                onEditEvent={handleEditEvent}
                onDelete={(id) => handleDeleteEvent(id)}
                theme={isDark ? "dark" : "light"}
            />

            {isModalOpen && (
                <EventFormModal
                    isOpen={isModalOpen}
                    slotInfo={slotInfo}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleAddUpdateEvent}

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
