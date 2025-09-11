import React, { useState } from "react";
import StatCard from "../../global/components/StatCard";

const TicketFilter = ({name, filter, counts, setFilter, colors }) => {
  const [open, setOpen] = useState(false);

  const values = Object.keys(colors);

  return (
    <div className="mb-4 relative">
      <label className="block mb-2 text-gray-900 dark:text-gray-100">{name}</label>

      {/* Nút bấm để mở dropdown */}
      <button
        onClick={() => setOpen(!open)}
        className="w-48 flex justify-between items-center border rounded p-1 dark:bg-gray-900 dark:border-gray-700"
      >
        {filter ? (
          <StatCard label={filter} count={counts[filter] || 0} colors={colors} />
        ) : (
          <span className="text-gray-500 dark:text-gray-400">All</span>
        )}
        <span className="ml-2">▾</span>
      </button>

      {/* Dropdown list */}
      {open && (
        <div className="absolute mt-1 w-48 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded shadow-lg z-10">
          <div
            onClick={() => {
              setFilter("");
              setOpen(false);
            }}
            className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            All
          </div>
          {values.map((value) => (
            <div
              key={value}
              onClick={() => {
                setFilter(value);
                setOpen(false);
              }}
              className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <StatCard label={value} count={counts[value] || 0} colors={colors} />
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default TicketFilter;
