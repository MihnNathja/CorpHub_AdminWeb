// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import Notifications from "./Notifications";
import UserProfile from "./UserProfile";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline"; // cần cài heroicons

const Navbar = ({ user }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // Cập nhật class dark vào html
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="h-20 flex justify-between items-center  bg-gray-50 dark:bg-gray-800  shadow px-6 py-4 transition-colors duration-200">
      <SearchBar />

      <div className="flex items-center gap-6">
        {/* Nút toggle theme */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          {theme === "light" ? (
            <MoonIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
          ) : (
            <SunIcon className="h-5 w-5 text-yellow-400" />
          )}
        </button>

        <Notifications />
        <UserProfile user={user} />
      </div>
    </header>
  );
};

export default Navbar;
