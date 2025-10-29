// src/components/SearchBar.jsx
import React from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const SearchBar = ({ onClose }) => {
  return (
    <div className="relative w-full">
      {/* Icon search */}
      <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-300" />

      {/* Input */}
      <input
        type="text"
        placeholder="Search..."
        autoFocus
        className="w-full pl-10 pr-10 py-2 border rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          bg-white text-gray-900 border-gray-300
          dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 
          transition"
      />

      {/* Icon đóng */}
      {onClose && (
        <XMarkIcon
          onClick={onClose}
          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 cursor-pointer transition"
        />
      )}
    </div>
  );
};

export default SearchBar;
