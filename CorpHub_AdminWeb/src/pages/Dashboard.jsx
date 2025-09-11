// src/features/dashboard/Dashboard.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-200 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto text-gray-900 dark:text-gray-100 dark:bg-gray-900 transition-colors">
          {/* Content sẽ thay đổi dựa vào route */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
