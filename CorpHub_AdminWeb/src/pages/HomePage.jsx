// src/features/dashboard/components/HomePage.jsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

const HomePage = () => {
  return (
    <div className="space-y-6">
      {/* 3 Cards tổng quan */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold">{statsData.totalUsers}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm text-gray-500">Open Tickets</h3>
          <p className="text-2xl font-bold">{statsData.openTickets}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm text-gray-500">Closed Tickets</h3>
          <p className="text-2xl font-bold">{statsData.closedTickets}</p>
        </div>
      </div>

      {/* Biểu đồ ticket theo ngày */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-4">Tickets Over Last Week</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="tickets" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bảng recent tickets */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-4">Recent Tickets</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Assignee</th>
            </tr>
          </thead>
          <tbody>
            {recentTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{ticket.id}</td>
                <td className="border border-gray-300 p-2">{ticket.title}</td>
                <td className="border border-gray-300 p-2">{ticket.status}</td>
                <td className="border border-gray-300 p-2">{ticket.assignee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomePage;
