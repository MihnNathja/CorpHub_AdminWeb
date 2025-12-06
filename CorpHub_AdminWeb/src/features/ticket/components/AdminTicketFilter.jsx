import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

const TicketFilter = ({ name, filter, setFilter, colors }) => {
  const [open, setOpen] = useState(false);

  // Lấy danh sách các giá trị từ đối tượng màu
  const values = Object.keys(colors);

  // Extract background color from Tailwind class
  const getColorClass = (colorClass) => {
    if (!colorClass) return "bg-gray-300";
    const bgMatch = colorClass.match(/bg-\S+/);
    return bgMatch ? bgMatch[0] : "bg-gray-300";
  };

  return (
    <div className="relative">

      {/* Dropdown button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm transition-all duration-200"
      >
        <span className="flex items-center gap-2">
          {filter ? (
            <>
              <span
                className={`w-2.5 h-2.5 rounded-full ${getColorClass(colors[filter])}`}
              />
              <span className="font-medium">{filter}</span>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">All {name}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* Dropdown list */}
      {open && (
        <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
          {/* All option */}
          <button
            onClick={() => {
              setFilter("");
              setOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors duration-150 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              {filter === "" && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
            </span>
            All {name}
          </button>

          {/* Filter options */}
          {values.map((value) => (
            <button
              key={value}
              onClick={() => {
                setFilter(value);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm transition-colors duration-150 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
            >
              <span className="flex items-center justify-center w-4 h-4">
                {filter === value ? (
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                ) : (
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${getColorClass(colors[value])}`}
                  />
                )}
              </span>
              <span className="font-medium">{value}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketFilter;
