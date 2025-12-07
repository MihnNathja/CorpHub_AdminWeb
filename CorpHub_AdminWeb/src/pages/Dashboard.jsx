import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Sidebar - Fixed */}
      <Sidebar onToggle={setCollapsed} />

      {/* Main content wrapper with dynamic left margin */}
      <motion.div
        animate={{
          marginLeft: collapsed ? "80px" : "256px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 flex flex-col min-w-0 relative"
      >
        {/* Navbar - Fixed at top */}
        <Navbar user={user} collapsed={collapsed} />

        {/* Main content area with proper padding */}
        <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 pb-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
};

export default Dashboard;
