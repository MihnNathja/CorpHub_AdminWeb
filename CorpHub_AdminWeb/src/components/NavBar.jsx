import React from "react";
import SearchBar from "./SearchBar";
import UserProfile from "./UserProfile";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext"; // import context
import NotificationDropdown from "../features/notification/components/NotificationDropdown";

const Navbar = ({ user }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="h-14 flex justify-between items-center bg-gray-50 dark:bg-gray-800 shadow-sm px-4 py-2 transition-colors duration-200">
      <SearchBar />

      <div className="flex items-center gap-6">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          {isDark ? (
            <SunIcon className="h-5 w-5 text-yellow-400" />
          ) : (
            <MoonIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
          )}
        </button>

        <NotificationDropdown />
        <UserProfile user={user} />
      </div>
    </header>
  );
};

export default Navbar;
