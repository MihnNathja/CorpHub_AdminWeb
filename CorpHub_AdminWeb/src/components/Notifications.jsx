import React from "react";
import { BellIcon } from "@heroicons/react/24/outline";

const Notifications = () => {
  return (
    <button className="relative">
      <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-300 transition-colors" />
      <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
    </button>
  );
};

export default Notifications;
