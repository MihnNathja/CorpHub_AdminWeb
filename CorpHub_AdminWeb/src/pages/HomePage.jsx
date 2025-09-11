// src/features/dashboard/components/HomePage.jsx
import React from "react";
import {
  UserGroupIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
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

// Demo data
const statsData = {
  totalUsers: 120,
  openTickets: 35,
  closedTickets: 85,
};

const chartData = [
  { date: "Mon", tickets: 5 },
  { date: "Tue", tickets: 10 },
  { date: "Wed", tickets: 7 },
  { date: "Thu", tickets: 12 },
  { date: "Fri", tickets: 6 },
  { date: "Sat", tickets: 9 },
  { date: "Sun", tickets: 8 },
];

const recentTickets = [
  { id: 1, title: "Cannot login", status: "Open", assignee: "John" },
  { id: 2, title: "Page not loading", status: "Closed", assignee: "Mary" },
  { id: 3, title: "Error 500 on submit", status: "Open", assignee: "Alice" },
];

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition">
    <div
      className={`p-3 rounded-xl ${color} bg-opacity-10 flex items-center justify-center`}
    >
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
    status === "Open"
      ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
      : "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400";
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${colors}`}
    >
      {status}
    </span>
  );
};

const HomePage = () => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={statsData.totalUsers}
          icon={UserGroupIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="Open Tickets"
          value={statsData.openTickets}
          icon={ExclamationCircleIcon}
          color="bg-red-500"
        />
        <StatCard
          title="Closed Tickets"
          value={statsData.closedTickets}
          icon={CheckCircleIcon}
          color="bg-green-500"
        />
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Tickets Over Last Week
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-gray-200 dark:text-gray-700"
            />
            <XAxis dataKey="date" stroke="currentColor" className="text-gray-500 dark:text-gray-400" />
            <YAxis stroke="currentColor" className="text-gray-500 dark:text-gray-400" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--tw-prose-body, #1f2937)",
                color: "#fff",
                borderRadius: "0.5rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="tickets"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Tickets Table */}
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
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.id}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.title}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{ticket.assignee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
