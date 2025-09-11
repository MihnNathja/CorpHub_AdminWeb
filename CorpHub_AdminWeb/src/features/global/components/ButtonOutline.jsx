import React from "react";

const ButtonOutline = ({ children, onClick, color }) => {
  const base = "px-2 py-1 rounded-md text-sm font-semibold border-2 transition-colors min-w-[70px]";

  const colors = {
    green: "text-green-600 border-green-600 dark:text-green-400 dark:border-green-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-500 dark:hover:text-white",
    red: "text-red-600 border-red-600 dark:text-red-400 dark:border-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white",
    blue: "text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white",
  };

  return (
    <button onClick={onClick} className={`${base} ${colors[color]}`}>
      {children}
    </button>
  );
};

export default ButtonOutline;
