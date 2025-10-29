import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors overflow-hidden">
      {/* Sidebar */}
      <Sidebar onToggle={setCollapsed} />

      {/* Main content */}
      <div className="flex-1 flex flex-col relative">
        <Navbar user={user} collapsed={collapsed} />

        <main className="flex-1 overflow-auto pt-14 px-6 text-gray-900 dark:text-gray-100 transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
