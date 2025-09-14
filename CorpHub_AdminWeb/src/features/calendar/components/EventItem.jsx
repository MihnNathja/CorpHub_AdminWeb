// components/EventItem.jsx
import React from "react";

const EventItem = ({ event, onClick }) => {
  return (
    <div
      className="bg-blue-500 text-white text-xs rounded px-2 py-1 cursor-pointer hover:bg-blue-600 truncate"
      onClick={onClick}
      title={event.title}
    >
      {event.title}
    </div>
  );
};

export default EventItem;
