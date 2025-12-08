import React, { useState, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom"; // ← add useNavigate
import { useAuth } from "../features/auth/hooks/useAuth";
import { useSchedule } from "../features/schedule/hooks/useSchedule";
import { useCalendar } from "../features/calendar/hooks/useCalendar";
import { useTickets } from "../features/ticket/hooks/useTickets";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  ClockIcon,
  ClipboardListIcon,
  CheckCircleIcon,
  Loader2,
} from "lucide-react";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // ← init navigate
  const [collapsed, setCollapsed] = useState(false);

  const memoEmails = useMemo(() => [], []);
  const { schedules, loading: scheduleLoading } = useSchedule();
  const { meetings, loading: calendarLoading } = useCalendar(memoEmails);
  const { tickets, loading: ticketsLoading } = useTickets("my");

  // Stats calculation
  const stats = {
    todayShifts: schedules?.length || 0,
    upcomingMeetings:
      meetings?.filter((m) => new Date(m.start) > new Date()).length || 0,
    openTickets: tickets?.filter((t) => t.status === "OPEN").length || 0,
    completedTickets: tickets?.filter((t) => t.status === "DONE").length || 0,
  };

  const isLoading = scheduleLoading || calendarLoading || ticketsLoading;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Main content */}
      <div className="flex-1 flex flex-col relative min-w-0">
        <Navbar user={user} collapsed={collapsed} />

        <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 pb-8 overflow-y-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-8 shadow-lg border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    Welcome back, {user?.fullName || "User"}! 👋
                  </h1>
                  <p className="text-white/80">
                    Here's your daily overview and upcoming tasks
                  </p>
                </div>
                <div className="hidden sm:block text-6xl opacity-20">📊</div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {/* Today's Shifts */}
            <StatCard
              icon={ClockIcon}
              label="Today's Shifts"
              value={stats.todayShifts}
              color="blue"
              loading={scheduleLoading}
              action={() => navigate("/schedule")} // ← smoother nav
            />

            {/* Upcoming Meetings */}
            <StatCard
              icon={CalendarIcon}
              label="Upcoming Meetings"
              value={stats.upcomingMeetings}
              color="emerald"
              loading={calendarLoading}
              action={() => navigate("/calendar")} // ← smoother nav
            />

            {/* Open Tickets */}
            <StatCard
              icon={CheckCircleIcon}
              label="Open Tickets"
              value={stats.openTickets}
              color="amber"
              loading={ticketsLoading}
              action={() => navigate("/tickets")} // ← smoother nav
            />

            {/* Completed Tickets */}
            <StatCard
              icon={CheckCircleIcon}
              label="Completed Tickets"
              value={stats.completedTickets}
              color="purple"
              loading={ticketsLoading}
              action={() => navigate("/tickets")} // ← smoother nav
            />
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Schedules & Meetings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Schedules */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                      <ClockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Today's Shifts
                    </h2>
                  </div>
                </div>

                <div className="p-6">
                  {scheduleLoading ? (
                    <LoadingState />
                  ) : schedules?.length > 0 ? (
                    <div className="space-y-3">
                      {schedules.slice(0, 5).map((schedule, idx) => (
                        <motion.div
                          key={schedule.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {schedule.shiftName || `Shift ${idx + 1}`}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {schedule.startTime} - {schedule.endTime}
                            </p>
                          </div>
                          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                            Active
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState icon={ClockIcon} message="No shifts today" />
                  )}
                </div>
              </motion.div>

              {/* Upcoming Meetings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                      <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Upcoming Meetings
                    </h2>
                  </div>
                </div>

                <div className="p-6">
                  {calendarLoading ? (
                    <LoadingState />
                  ) : meetings?.length > 0 ? (
                    <div className="space-y-3">
                      {meetings.slice(0, 5).map((meeting, idx) => (
                        <motion.div
                          key={meeting.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                            {new Date(meeting.start).toLocaleString("vi-VN", {
                              day: "2-digit",
                            })}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {meeting.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(meeting.start).toLocaleString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          {meeting.meetingRoom && (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                              Room
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={CalendarIcon}
                      message="No upcoming meetings"
                    />
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Recent Tickets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden h-fit"
            >
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40">
                    <ClipboardListIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Recent Tickets
                  </h2>
                </div>
              </div>

              <div className="p-6">
                {ticketsLoading ? (
                  <LoadingState />
                ) : tickets?.length > 0 ? (
                  <div className="space-y-2">
                    {tickets.slice(0, 5).map((ticket, idx) => {
                      const statusColors = {
                        OPEN: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
                        IN_PROGRESS:
                          "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
                        DONE: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
                        REJECTED:
                          "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
                      };

                      return (
                        <motion.div
                          key={ticket.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 flex-1">
                              {ticket.title}
                            </p>
                          </div>
                          <span
                            className={`inline-block px-2.5 py-1 text-xs font-bold rounded ${
                              statusColors[ticket.status] || statusColors.OPEN
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState icon={ClipboardListIcon} message="No tickets" />
                )}
              </div>
            </motion.div>
          </div>

          {/* Page outlet for nested routes */}
          <div className="mt-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, loading, action }) => {
  const colorClasses = {
    blue: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800",
    emerald:
      "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800",
    amber:
      "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800",
    purple:
      "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800",
  };

  const iconColorClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
    purple: "text-purple-600 dark:text-purple-400",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, translateY: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={action}
      className={`relative bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6 text-left transition-all overflow-hidden group`}
    >
      <div className="absolute inset-0 bg-white dark:bg-gray-800 opacity-0 group-hover:opacity-5 transition-opacity" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm`}
          >
            <Icon className={`w-6 h-6 ${iconColorClasses[color]}`} />
          </div>
          <span className="text-2xl">→</span>
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {label}
        </p>
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        ) : (
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        )}
      </div>
    </motion.button>
  );
};

// Loading State Component
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-8">
    <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mb-2" />
    <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
  </div>
);

// Empty State Component
const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <Icon className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-2" />
    <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
  </div>
);

export default HomePage;
