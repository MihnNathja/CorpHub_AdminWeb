import React, { useState } from "react";

const TicketFilter = ({ name, filter, setFilter, colors }) => {
  const [open, setOpen] = useState(false);

  // Lấy danh sách các giá trị từ đối tượng màu
  const values = Object.keys(colors);

  return (
    <div className="mb-4 relative">
      <label className="block mb-2 text-gray-900 dark:text-gray-100">
        {name}
      </label>

      {/* Nút mở dropdown */}
      <button
        onClick={() => setOpen(!open)}
        className="w-48 flex justify-between items-center border rounded p-1 dark:bg-gray-900 dark:border-gray-700"
      >
        {filter ? (
          <span
            className={`flex-1 px-2 py-1 text-sm rounded-md font-medium ${colors[filter] || "bg-gray-200 text-gray-800"
              }`}
          >
            {filter}
          </span>
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
            className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
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
              className={`cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center gap-2`}
            >
              <span
                className={`inline-block w-3 h-3 rounded-full ${colors[value]?.split(" ")[0] || "bg-gray-400"
                  }`}
              ></span>
              {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketFilter;
