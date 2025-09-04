// src/features/dashboard/Dashboard.jsx
import React from "react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
          {/* Content sẽ thay đổi dựa vào route */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
