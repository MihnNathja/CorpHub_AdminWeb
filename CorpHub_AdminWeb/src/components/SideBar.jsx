// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const menu = [
    { name: "Dashboard", path: "" },  
    { name: "Tickets", path: "tickets" },
    { name: "Users", path: "users" },
    { name: "Settings", path: "settings" },
    ];


  return (
    <aside className="w-64 bg-white shadow-md flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `py-2 px-4 rounded hover:bg-gray-100 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
