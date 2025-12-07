import React, { useEffect, useState, useRef } from "react";
import {
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";
import NotificationDropdown from "../features/notification/components/NotificationDropdown";
import UserProfile from "./UserProfile";
import SearchBar from "./SearchBar";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ user, collapsed, onToggleSidebar }) => {
  const { isDark, toggleTheme } = useTheme();
  const [hidden, setHidden] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const searchRef = useRef(null);

  // Ẩn navbar khi cuộn xuống
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Đóng search khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const leftOffset = collapsed ? "left-20" : "left-64";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 ${leftOffset} right-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80
      border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/20 dark:shadow-gray-950/40
      flex items-center justify-between transition-[left] duration-300 px-6 h-16`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 pointer-events-none" />

      {/* LEFT: Mobile menu toggle + Search */}
      <div className="relative flex items-center gap-3 z-10">
        {/* Mobile menu toggle */}
        {onToggleSidebar && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle menu"
          >
            <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </motion.button>
        )}

        {/* Search */}
        <div ref={searchRef} className="flex items-center">
          <AnimatePresence mode="wait">
            {!showSearch ? (
              <motion.button
                key="search-button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSearch(true)}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm"
                title="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </motion.button>
            ) : (
              <motion.div
                key="search-bar"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "20rem" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <SearchBar onClose={() => setShowSearch(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Breadcrumb or page title (optional) */}
        <div className="hidden md:flex items-center gap-2 ml-4">
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Welcome back,
            </p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {user?.fullName || "User"}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: Theme + Notifications + User */}
      <div className="relative flex items-center gap-2 z-10">
        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm"
          title={isDark ? "Light mode" : "Dark mode"}
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="sun"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 180, scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SunIcon className="h-5 w-5 text-yellow-500" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: -180, scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MoonIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Divider */}
        <div className="hidden sm:block h-8 w-px bg-gray-300 dark:bg-gray-700" />

        {/* Notifications */}
        <NotificationDropdown />

        {/* Divider */}
        <div className="hidden sm:block h-8 w-px bg-gray-300 dark:bg-gray-700" />

        {/* User Profile */}
        <UserProfile user={user} />
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </motion.header>
  );
};

export default Navbar;
