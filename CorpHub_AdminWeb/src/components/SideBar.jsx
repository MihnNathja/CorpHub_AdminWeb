// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  TicketIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const menu = [
  { name: "Dashboard", path: "", icon: HomeIcon },
  { name: "Tickets", path: "tickets", icon: TicketIcon },
  { name: "Users", path: "users", icon: UsersIcon },
  { name: "Departments", path: "departments", icon: BuildingOfficeIcon },
  { name: "Projects", path: "projects", icon: ClipboardDocumentListIcon },
  { name: "Calendar", path: "calendar", icon: CalendarIcon },
  { name: "Settings", path: "settings", icon: Cog6ToothIcon },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-md dark:shadow-lg flex flex-col">
      {/* Header */}
      <div className="h-20 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Admin Panel
        </h2>
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-1 px-4 py-6">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all 
              ${isActive
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium border-l-4 border-blue-600 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500">
        © 2025 Admin Panel
      </div>
    </aside>
  );
};

export default Sidebar;
