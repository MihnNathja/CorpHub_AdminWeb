// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HomeIcon,
  TicketIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { UserIcon, Building2Icon } from "lucide-react";

// Thêm roles cho từng item (có thể mở rộng sau này)
const menu = [
  {
    name: "Dashboard",
    path: "",
    icon: HomeIcon,
    roles: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_USER", "ROLE_HR"], // HR cũng vào dashboard
  },
  {
    name: "Tickets",
    path: "tickets",
    icon: TicketIcon,
    roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
  },
  {
    name: "Tickets",
    path: "my-tickets",
    icon: TicketIcon,
    roles: ["ROLE_USER"],
  },
  {
    name: "Users",
    path: "users",
    icon: UsersIcon,
    roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
  },
  {
    name: "Departments",
    path: "departments",
    icon: BuildingOfficeIcon,
    roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
  },
  {
    name: "Rooms",
    path: "rooms",
    icon: Building2Icon,
    roles: ["ROLE_ADMIN"],
  },
  {
    name: "Projects",
    path: "projects",
    icon: ClipboardDocumentListIcon,
    roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
  },
  {
    name: "Employees",
    path: "employees",
    icon: UserIcon,
    roles: ["ROLE_MANAGER", "ROLE_ADMIN", "ROLE_HR"],
  },
  {
    name: "Calendar",
    path: "calendar",
    icon: CalendarIcon,
    roles: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_USER", "ROLE_HR"],
  },
  {
    name: "Settings",
    path: "settings",
    icon: Cog6ToothIcon,
    roles: ["ROLE_ADMIN"],
  },
];

const ROLE_PANEL = {
  ROLE_ADMIN: "Admin",
  ROLE_MANAGER: "Manager",
  ROLE_USER: "Employee",
  ROLE_HR: "HR",
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector((state) => state.auth.user);

  // Nếu chưa login, không render sidebar
  if (!user) return null;

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-64"
        } bg-white dark:bg-gray-800 shadow-md dark:shadow-lg flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {ROLE_PANEL[user.role]} Workspace
          </h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {collapsed ? (
            <ChevronDoubleRightIcon className="h-7 w-7 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronDoubleLeftIcon className="h-7 w-7 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-6">
        {menu
          .filter((item) => item.roles.includes(user.role)) // lọc theo role
          .map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center ${collapsed ? "justify-center" : "gap-3"}
                 px-4 py-2 rounded-lg transition-all 
                 ${isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium border-l-4 border-blue-600 dark:border-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`
              }
            >
              <item.icon className="h-6 w-6" />
              {!collapsed && <span className="text-base">{item.name}</span>}
            </NavLink>
          ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500">
          © 2025 Admin Panel
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
