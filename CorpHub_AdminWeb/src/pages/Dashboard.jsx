// src/features/dashboard/Dashboard.jsx
import React from "react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="flex h-screen bg-gray-200 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Navbar user={user} />
        <main className="flex-1 p-6 overflow-auto text-gray-900 dark:text-gray-100 dark:bg-gray-900 transition-colors">
          {/* Content sẽ thay đổi dựa vào route */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
