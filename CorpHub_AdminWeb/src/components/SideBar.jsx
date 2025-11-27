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
  ArchiveBoxIcon,
  DocumentIcon,
  ClipboardDocumentCheckIcon,
  FingerPrintIcon
} from "@heroicons/react/24/outline";
import { UserIcon, Building2Icon, ShieldCheckIcon, PlayCircleIcon } from "lucide-react";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";

// -------- GROUPED MENU --------
const groupedMenu = [

  // ========== GENERAL ==========
  {
    title: "General",
    items: [
      {
        name: "Dashboard",
        path: "",
        icon: HomeIcon,
        roles: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_USER", "ROLE_HR"],
      },
      {
        name: "Attendance",
        path: "attendance",
        icon: FingerPrintIcon,
        roles: ["ROLE_HR", "ROLE_MANAGER", "ROLE_ADMIN"],
      },
      {
        name: "Calendar",
        path: "calendar",
        icon: CalendarIcon,
        roles: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_USER", "ROLE_HR"],
      },
    ],
  },

  // ========== MY WORKSPACE ==========
  {
    title: "My Workspace",
    items: [
      {
        name: "My Attendance",
        path: "attendance",
        icon: FingerPrintIcon,
        roles: ["ROLE_USER"], // nhân viên
      },
      {
        name: "My Absence",
        path: "my-absence",
        icon: ClipboardDocumentCheckIcon,
        roles: ["ROLE_USER"],
      },
      {
        name: "My Tickets",
        path: "my-tickets",
        icon: TicketIcon,
        roles: ["ROLE_USER"],
      },
    ],
  },

  // ========== PEOPLE & HR ==========
  {
    title: "People & HR",
    items: [
      {
        name: "Employees",
        path: "employees",
        icon: UserIcon,
        roles: ["ROLE_MANAGER", "ROLE_ADMIN", "ROLE_HR"],
      },
      {
        name: "Departments",
        path: "departments",
        icon: BuildingOfficeIcon,
        roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
      },
      {
        name: "Absence Management",
        path: "absence",
        icon: ClipboardDocumentCheckIcon,
        roles: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_HR"],
      },
      {
        name: "Work Schedule",
        path: "schedule",
        icon: CalendarDaysIcon,
        roles: ["ROLE_ADMIN", "ROLE_HR"],
      },

    ],
  },

  // ========== ASSETS ==========
  {
    title: "Assets & Facilities",
    items: [
      {
        name: "Assets",
        path: "assets",
        icon: ArchiveBoxIcon,
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
    ],
  },

  // ========== HELPDESK ==========
  {
    title: "Helpdesk",
    items: [
      {
        name: "Tickets",
        path: "tickets",
        icon: TicketIcon,
        roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
      },
    ],
  },

  // ========== WORKFLOW ==========
  {
    title: "Workflow",
    items: [
      {
        name: "Workflow Builder",
        path: "workflow",
        icon: PlayCircleIcon,
        roles: ["ROLE_ADMIN"],
      },
    ],
  },

  // ========== SYSTEM ==========
  {
    title: "System Settings",
    items: [
      {
        name: "Users",
        path: "users",
        icon: UsersIcon,
        roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
      },
      {
        name: "Roles & Permissions",
        path: "roles",
        icon: ShieldCheckIcon,
        roles: ["ROLE_ADMIN"],
      },
      {
        name: "Settings",
        path: "settings",
        icon: Cog6ToothIcon,
        roles: ["ROLE_ADMIN"],
      },
    ],
  },
];



const ROLE_PANEL = {
  ROLE_ADMIN: "Admin",
  ROLE_MANAGER: "Manager",
  ROLE_USER: "Employee",
  ROLE_HR: "HR",
};

const ArrowIcon = ({ open }) => (
  <ChevronDoubleRightIcon
    className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""
      }`}
  />
);


const Sidebar = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  // ---- GROUP COLLAPSE STATE ----
  const allGroupTitles = groupedMenu.map((g) => g.title);

  const [openGroups, setOpenGroups] = useState(
    Object.fromEntries(allGroupTitles.map((title) => [title, false])) // 👈 mặc định đóng hết
  );

  const toggleGroup = (title) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };


  const user = useSelector((state) => state.auth.user);

  // Nếu chưa login, không render sidebar
  if (!user) return null;

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (onToggle) onToggle(next); // 👉 báo ra ngoài
  };

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-64"}
      bg-white dark:bg-gray-800 shadow-md dark:shadow-lg
      flex flex-col transition-all duration-300`}
    >

      {/* ---------------- HEADER ---------------- */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {ROLE_PANEL[user.role]} Workspace
          </h2>
        )}

        <button
          onClick={handleToggle}
          className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {collapsed ? (
            <ChevronDoubleRightIcon className="h-7 w-7 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronDoubleLeftIcon className="h-7 w-7 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* ---------------- NAVIGATION ---------------- */}
      <nav className="flex-1 flex flex-col px-2 py-4">

        {/* ------ COLLAPSED MODE (ICON ONLY) ------ */}
        {collapsed && (
          <div className="flex flex-col gap-2">
            {groupedMenu
              .flatMap((g) => g.items)
              .filter((item) => item.roles.includes(user.role))
              .map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex justify-center items-center p-3 rounded-lg transition-all
                  ${isActive
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  <item.icon className="h-6 w-6" />
                </NavLink>
              ))}
          </div>
        )}

        {/* ------ EXPANDED MODE (GROUP + ITEMS) ------ */}
        {!collapsed && (
          <div className="flex flex-col gap-2">
            {groupedMenu.map((group) => {
              const visibleItems = group.items.filter((i) =>
                i.roles.includes(user.role)
              );
              if (visibleItems.length === 0) return null;

              const isOpen = openGroups[group.title];

              return (
                <div key={group.title}>
                  {/* GROUP HEADER */}
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    {group.title}
                    <ArrowIcon open={isOpen} />
                  </button>

                  {/* GROUP ITEMS */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"
                      }`}
                  >
                    {visibleItems.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        end
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2 ml-2 rounded-lg transition-all 
                        ${isActive
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm">{item.name}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </nav>

      {/* ---------------- FOOTER ---------------- */}
      {!collapsed && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500">
          © 2025 Admin Panel
        </div>
      )}
    </aside>
  );

};

export default Sidebar;
