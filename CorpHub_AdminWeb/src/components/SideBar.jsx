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
  ClipboardDocumentCheckIcon,
  FingerPrintIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  UserIcon,
  Building2Icon,
  ShieldCheckIcon,
  PlayCircleIcon,
  Sparkles,
} from "lucide-react";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

// -------- GROUPED MENU --------
const groupedMenu = [
  // ========== GENERAL ==========
  {
    title: "General",
    icon: HomeIcon,
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
    icon: UserIcon,
    items: [
      {
        name: "My Attendance",
        path: "attendance",
        icon: FingerPrintIcon,
        roles: ["ROLE_USER"],
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
    icon: UsersIcon,
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
        roles: ["ROLE_ADMIN"],
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
    icon: ArchiveBoxIcon,
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
    icon: TicketIcon,
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
    icon: PlayCircleIcon,
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
    icon: Cog6ToothIcon,
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

const ROLE_COLORS = {
  ROLE_ADMIN: "from-red-500 to-rose-600",
  ROLE_MANAGER: "from-blue-500 to-indigo-600",
  ROLE_USER: "from-emerald-500 to-teal-600",
  ROLE_HR: "from-purple-500 to-pink-600",
};

const Sidebar = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const allGroupTitles = groupedMenu.map((g) => g.title);
  const [openGroups, setOpenGroups] = useState(
    Object.fromEntries(allGroupTitles.map((title) => [title, true])) // Default open
  );

  const toggleGroup = (title) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const user = useSelector((state) => state.auth.user);

  if (!user) return null;

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (onToggle) onToggle(next);
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0, width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 shadow-2xl border-r border-gray-200 dark:border-gray-800 flex flex-col z-50 overflow-hidden"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 pointer-events-none" />

      {/* ---------------- HEADER ---------------- */}
      <div className="relative h-20 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                  ROLE_COLORS[user.role]
                } flex items-center justify-center shadow-lg`}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-800 dark:text-white">
                  CorpHub
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {ROLE_PANEL[user.role]} Panel
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggle}
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronDoubleRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronDoubleLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          )}
        </motion.button>
      </div>

      {/* ---------------- NAVIGATION ---------------- */}
      <nav className="relative flex-1 flex flex-col px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {/* ------ COLLAPSED MODE (ICON ONLY) ------ */}
        {collapsed && (
          <div className="flex flex-col gap-2">
            {groupedMenu
              .flatMap((g) => g.items)
              .filter((item) => item.roles.includes(user.role))
              .map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <NavLink
                    to={item.path}
                    end
                    title={item.name}
                    className={({ isActive }) =>
                      `group flex justify-center items-center p-3 rounded-xl transition-all relative
                      ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className="h-6 w-6" />
                      </>
                    )}
                  </NavLink>
                </motion.div>
              ))}
          </div>
        )}

        {/* ------ EXPANDED MODE (GROUP + ITEMS) ------ */}
        {!collapsed && (
          <div className="flex flex-col gap-1">
            {groupedMenu.map((group, groupIdx) => {
              const visibleItems = group.items.filter((i) =>
                i.roles.includes(user.role)
              );
              if (visibleItems.length === 0) return null;

              const isOpen = openGroups[group.title];
              const GroupIcon = group.icon;

              return (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIdx * 0.1 }}
                  className="mb-2"
                >
                  {/* GROUP HEADER */}
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={() => toggleGroup(group.title)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-all group"
                  >
                    <GroupIcon className="w-4 h-4" />
                    <span className="flex-1 text-left">{group.title}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </motion.div>
                  </motion.button>

                  {/* GROUP ITEMS */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 space-y-1">
                          {visibleItems.map((item, idx) => (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <NavLink
                                to={item.path}
                                end
                                className={({ isActive }) =>
                                  `group flex items-center gap-3 px-4 py-2.5 ml-2 rounded-xl transition-all relative
                                  ${
                                    isActive
                                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20"
                                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:translate-x-1"
                                  }`
                                }
                              >
                                {({ isActive }) => (
                                  <>
                                    {/* {isActive && (
                                      <motion.div
                                        layoutId="activeIndicatorExpanded"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r"
                                      />
                                    )} */}
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    <span className="text-sm font-medium">
                                      {item.name}
                                    </span>
                                  </>
                                )}
                              </NavLink>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </nav>

      {/* ---------------- FOOTER ---------------- */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative px-4 py-4 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  CorpHub v2.0
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-500">
                  Enterprise Edition
                </p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center">
              © 2024 CorpHub. All rights reserved.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};

export default Sidebar;
