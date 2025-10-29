import React, { useEffect, useState, useRef } from "react";
import {
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";
import NotificationDropdown from "../features/notification/components/NotificationDropdown";
import UserProfile from "./UserProfile";
import SearchBar from "./SearchBar";

const Navbar = ({ user, collapsed }) => {
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
    <header
      className={`fixed top-0 ${leftOffset} right-0 z-40 backdrop-blur-md bg-white/70 dark:bg-gray-900/70
      shadow-sm flex items-center justify-between transition-all duration-300 px-4
      ${hidden ? "-translate-y-full" : "translate-y-0"} h-14`}
    >
      {/* LEFT: Search toggle */}
      <div ref={searchRef} className="flex items-center gap-2">
        {!showSearch ? (
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
          </button>
        ) : (
          <div
            className="transition-all duration-300 ease-in-out"
            style={{ width: "18rem" }} // ~288px
          >
            <SearchBar onClose={() => setShowSearch(false)} />
          </div>
        )}
      </div>

      {/* RIGHT: theme + notifications + user */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
