// src/components/Navbar.jsx
import React from "react";
import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Navbar = ({ user }) => {
  return (
    <header className="flex justify-between items-center bg-white shadow px-6 py-4">
      {/* Search */}
      <div className="relative w-1/3">
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      {/* Right info */}
      <div className="flex items-center gap-6">
        <button className="relative">
          <BellIcon className="h-6 w-6 text-gray-600" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-2">
          <img
            src={user?.avatar || "./assets/defaultAvatar.jpg"}
            alt="User Avatar"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="font-medium text-gray-800">{user?.name || "User"}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
