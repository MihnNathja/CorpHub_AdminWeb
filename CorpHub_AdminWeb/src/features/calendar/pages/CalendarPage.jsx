import React, { useMemo, useState } from "react";
import MyCalendar from "../components/MyCalendar";
import EventFormModal from "../components/EventFormModal";
import { useTheme } from "../../../context/ThemeContext";
import { toLocal } from "../../global/utils/timezone";
import Calendar from "react-calendar";
import { useCalendar } from "../hooks/useCalendar";
import { useUser } from "../../user/hooks/useUser";

import "react-calendar/dist/Calendar.css";
import "../../../assets/css/mini-calendar-theme.css";
import { PlusIcon } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import FloatingButton from "../../global/components/FloatingButton";

const CalendarPage = () => {
    const { user } = useAuth();
    const currentEmail = user?.email;
    const [selectedEmails, setSelectedEmails] = useState([]);
    const {
        meetings,
        loading,
        error,
        isModalOpen,
        setIsModalOpen,
        slotInfo,
        setSlotInfo,
        selectedEvent,
        setSelectedEvent,
        selectedDate,
        setSelectedDate,
        handleAddUpdateEvent,
        handleDeleteEvent,
    } = useCalendar(selectedEmails);

    const { isDark } = useTheme();

    const { employees, loadingUsers, errorUsers } = useUser();


    const toggleEmail = (email) => {
        setSelectedEmails((prev) =>
            prev.includes(email)
                ? prev.filter((e) => e !== email)
                : [...prev, email]
        );
    };

    const selectAll = () => setSelectedEmails(employees.map((e) => e.email));
    const deselectAll = () => setSelectedEmails([]);

    const events = useMemo(
        () =>
            (meetings || []).map((e) => {
                const currentAttendee = e.attendees?.find(
                    (a) => a.email === currentEmail
                );

                const status = e.organizerEmail === currentEmail
                    ? "ORGANIZER"
                    : currentAttendee?.status || "PENDING";

                console.log("status: ", status);

                return {
                    ...e,
                    start: new Date(e.startTime),
                    end: new Date(e.endTime),
                    isOrganizer: e.organizerEmail === currentEmail,
                    status,
                    className: status.toLowerCase(),
                };
            }),
        [meetings, currentEmail]
    );

    return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Event Calendar</h2>

            <FloatingButton
                onClick={() => setIsModalOpen(true)}
                icon={PlusIcon}
                tooltip="Thêm sự kiện"
                color="green"
            />

            <div className="flex justify-between items-start gap-6 mt-4">
                {/* Calendar chính */}
                <div className="flex-1">
                    <MyCalendar
                        date={selectedDate}
                        onNavigate={(newDate) => setSelectedDate(newDate)}
                        events={events}
                        eventPropGetter={(event) => {
                            const statusClass = event.status ? event.status.toLowerCase() : "default";
                            return {
                                className: `rbc-event ${statusClass}`,
                            };
                        }}
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
                            setSlotInfo({
                                ...event,
                                start: toLocal(event.start),
                                end: toLocal(event.end),
                            });
                            setIsModalOpen(true);
                        }}
                        onDelete={(id) => handleDeleteEvent(id)}
                        theme={isDark ? "dark" : "light"}
                    />
                </div>

                {/* Mini calendar + danh sách nhân viên */}
                <div className="w-72 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col gap-3">
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        className={`custom-mini-calendar ${isDark ? "dark" : ""}`}
                    />

                    {/* Bộ chọn nhân viên */}
                    {!loadingUsers && employees.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mt-1 p-3 flex flex-col">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Danh sách nhân viên
                            </h3>

                            <div className="flex justify-between items-center mb-3">
                                <button
                                    className="text-sm text-blue-600 hover:underline"
                                    onClick={selectAll}
                                >
                                    Chọn tất cả
                                </button>
                                <button
                                    className="text-sm text-red-600 hover:underline"
                                    onClick={deselectAll}
                                >
                                    Bỏ chọn tất cả
                                </button>
                            </div>

                            <div className="max-h-48 overflow-y-auto space-y-2">
                                {employees.map((emp) => (
                                    <label
                                        key={emp.email}
                                        className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200"
                                    >
                                        <input
                                            type="checkbox"
                                            className="mt-1"
                                            checked={selectedEmails.includes(emp.email)}
                                            onChange={() => toggleEmail(emp.email)}
                                        />
                                        <div className="flex flex-col leading-tight">
                                            <span className="font-medium">{emp.fullName}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{emp.email}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <EventFormModal
                    isOpen={isModalOpen}
                    slotInfo={slotInfo}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleAddUpdateEvent}
                    isOrganizer={slotInfo?.isOrganizer}
                />
            )}
        </div>
    );
};

export default CalendarPage;
