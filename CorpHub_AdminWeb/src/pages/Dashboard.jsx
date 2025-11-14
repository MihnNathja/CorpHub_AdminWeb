import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">

      {/* Sidebar */}
      <Sidebar onToggle={setCollapsed} />

      {/* Main content */}
      <div className="flex-1 flex flex-col relative min-w-0">

        <Navbar user={user} collapsed={collapsed} />

        <main className="flex-1 pt-14 px-6 text-gray-900 dark:text-gray-100 transition-colors min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
