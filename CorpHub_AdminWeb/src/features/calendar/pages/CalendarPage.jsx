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
import { Plus, Calendar as CalendarIcon, Users, Search, Check, X } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import FloatingButton from "../../global/components/FloatingButton";

const CalendarPage = () => {
  const { user, hasRole } = useAuth();
  const currentEmail = user?.email;
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [searchEmployee, setSearchEmployee] = useState("");

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
  const { list, loadingUsers, errorUsers } = useUser();

  const toggleEmail = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const selectAll = () => setSelectedEmails(list.map((e) => e.email));
  const deselectAll = () => setSelectedEmails([]);

  // Filter employees by search
  const filteredEmployees = useMemo(() => {
    if (!searchEmployee) return list;
    return list.filter(
      (emp) =>
        emp.fullName.toLowerCase().includes(searchEmployee.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchEmployee.toLowerCase())
    );
  }, [list, searchEmployee]);

  const events = useMemo(
    () =>
      (meetings || []).map((e) => {
        const currentAttendee = e.attendees?.find(
          (a) => a.email === currentEmail
        );

        const status =
          e.organizerEmail === currentEmail
            ? "ORGANIZER"
            : currentAttendee?.status || "PENDING";

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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg border border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-sm">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-white/80 uppercase tracking-wide">Schedule</p>
            <h1 className="text-3xl font-bold">Event Calendar</h1>
          </div>
        </div>
        <p className="text-sm text-white/70 mt-2 ml-13">
          View and manage your events and team schedules
        </p>
      </div>

      {!hasRole('ROLE_USER') && (
        <FloatingButton
          onClick={() => setIsModalOpen(true)}
          icon={Plus}
          tooltip="New event"
          color="green"
        />
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar - Main Content (3 columns) */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <MyCalendar
                date={selectedDate}
                onNavigate={(newDate) => setSelectedDate(newDate)}
                events={events}
                eventPropGetter={(event) => {
                  const statusClass = event.status
                    ? event.status.toLowerCase()
                    : "default";
                  return {
                    className: `rbc-event ${statusClass}`,
                  };
                }}
                onSelectSlot={!hasRole('ROLE_USER') ? ({ start, end }) => {
                  setSlotInfo({ start: toLocal(start), end: toLocal(end) });
                  setIsModalOpen(true);
                } : undefined}
                onEventDrop={!hasRole('ROLE_USER') ? ({ event, start, end }) => {
                  handleAddUpdateEvent({
                    ...event,
                    start,
                    end,
                  });
                } : undefined}
                onDoubleClickEvent={(event) => {
                  setSlotInfo({
                    ...event,
                    start: toLocal(event.start),
                    end: toLocal(event.end),
                  });
                  setIsModalOpen(true);
                }}
                onEditEvent={(event) => {
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
        </div>

        {/* Sidebar - Mini Calendar + Employees (1 column) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Mini Calendar Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className={`custom-mini-calendar ${isDark ? "dark" : ""}`}
            />
          </div>

          {/* Employees List Card */}
          {!loadingUsers && list.length > 0 && !hasRole('ROLE_USER') && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-4 py-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Employees
                  </h3>
                  <span className="ml-auto text-xs font-semibold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
                    {selectedEmails.length}/{list.length}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    className="flex-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                    onClick={selectAll}
                  >
                    <Check className="w-3 h-3" />
                    All
                  </button>
                  <button
                    className="flex-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                    onClick={deselectAll}
                  >
                    <X className="w-3 h-3" />
                    None
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchEmployee}
                    onChange={(e) => setSearchEmployee(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Employee List */}
              <div className="flex-1 overflow-y-auto max-h-[400px]">
                {filteredEmployees.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredEmployees.map((emp) => (
                      <label
                        key={emp.email}
                        className="flex items-center gap-2.5 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors group"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded cursor-pointer accent-blue-600 dark:accent-blue-400"
                          checked={selectedEmails.includes(emp.email)}
                          onChange={() => toggleEmail(emp.email)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {emp.fullName}
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                            {emp.email}
                          </p>
                        </div>
                        {selectedEmails.includes(emp.email) && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      No employees found
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Info */}
              {selectedEmails.length > 0 && (
                <div className="px-4 py-2.5 bg-blue-50/50 dark:bg-blue-900/10 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                    Viewing calendars of {selectedEmails.length} employee{selectedEmails.length !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
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
