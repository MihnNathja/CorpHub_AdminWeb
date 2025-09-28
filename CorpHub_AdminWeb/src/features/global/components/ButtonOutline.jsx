import React from "react";

const ButtonOutline = ({ children, onClick, color = "blue", icon: Icon }) => {
  const base =
    "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:shadow-md hover:scale-[1.02]";

  const colors = {
    green:
      "text-green-600 border-green-500 dark:text-green-400 dark:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 focus:ring-green-300",
    red:
      "text-red-600 border-red-500 dark:text-red-400 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 focus:ring-red-300",
    blue:
      "text-blue-600 border-blue-500 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:ring-blue-300",
    gray:
      "text-gray-600 border-gray-400 dark:text-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-300",
  };

  return (
    <button onClick={onClick} className={`${base} ${colors[color]}`}>
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
    </button>
  );
};

export default ButtonOutline;
