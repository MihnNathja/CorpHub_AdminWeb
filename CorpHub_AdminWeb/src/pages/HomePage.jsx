import React, { useMemo } from "react";
import {
  UserGroupIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useTickets } from "../features/ticket/hooks/useTickets";
// import { useAttendances } from "../features/attendance/hooks/useAttendances";
import { useCalendar } from "../features/calendar/hooks/useCalendar";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition">
    <div className={`p-3 rounded-xl ${color} bg-opacity-10 flex items-center justify-center`}>
      <Icon className={`h-7 w-7 ${color.replace("bg", "text")}`} />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        {value}
      </p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const colors =
    status === "OPEN"
      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
      : status === "REJECTED"
        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
        : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400";

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors}`}>
      {status}
    </span>
  );
};

const HomePage = () => {
  // Tickets
  const { rawTickets: receivedTickets } = useTickets("received");
  const { rawTickets: sentTickets } = useTickets("sent");
  const allTickets = [...(receivedTickets || []), ...(sentTickets || [])];

  // Attendance (tạm thời comment vì chưa có dữ liệu)
  // const { requests: attendanceRequests } = useAttendances();
  // const pendingLeaves = attendanceRequests?.filter((r) => r.status === "PENDING") || [];

  // Meetings
  const emptyEmails = useMemo(() => [], []);
  const { meetings } = useCalendar(emptyEmails);
  const upcomingMeetings = useMemo(() => {
    const now = new Date();
    return (meetings || [])
      .filter((m) => new Date(m.startTime) >= now)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 5);
  }, [meetings]);

  // Chart tickets
  const chartData = useMemo(() => {
    const countsByDate = allTickets.reduce((acc, t) => {
      const dateKey = new Date(t.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
      });
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(countsByDate).map(([date, count]) => ({
      date,
      tickets: count,
    }));
  }, [allTickets]);

  const recentTickets = useMemo(() => {
    return allTickets
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [allTickets]);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Tickets from my department"
          value={sentTickets?.length ?? 0}
          icon={ExclamationCircleIcon}
          color="bg-red-500"
        />
        <StatCard
          title="Tickets to my department"
          value={receivedTickets?.length ?? 0}
          icon={CheckCircleIcon}
          color="bg-green-500"
        />
        {/* Tạm comment attendance */}
        {/* <StatCard
          title="Pending Leave Requests"
          value={pendingLeaves.length}
          icon={ClockIcon}
          color="bg-yellow-500"
        /> */}
        <StatCard
          title="Upcoming Meetings"
          value={upcomingMeetings.length}
          icon={CalendarDaysIcon}
          color="bg-indigo-500"
        />
      </div>

      {/* Tickets Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Tickets Over Last Week
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="tickets" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Recent Tickets
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Assignee</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-2">{ticket.id}</td>
                  <td className="px-4 py-2">{ticket.title}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-4 py-2">{ticket.assignee?.name || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      Upcoming Meetings
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Upcoming Meetings
        </h3>
        <ul className="space-y-2">
          {upcomingMeetings.map((m) => (
            <li key={m.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 flex justify-between">
              <div>
                <p className="font-medium">{m.title}</p>
                <p className="text-sm text-gray-500">
                  {new Date(m.startTime).toLocaleString()}
                </p>
              </div>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                {m.attendees?.length || 0} Attendees
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
