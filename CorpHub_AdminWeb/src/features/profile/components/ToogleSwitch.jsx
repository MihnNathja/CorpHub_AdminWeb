import React from "react";

const ToggleSwitch = ({ enabled, onToggle, size = "md" }) => {
  const sizes = {
    sm: { w: "w-10", h: "h-5", dot: "w-4 h-4", translate: "translate-x-5" },
    md: { w: "w-12", h: "h-6", dot: "w-5 h-5", translate: "translate-x-6" },
    lg: { w: "w-14", h: "h-7", dot: "w-6 h-6", translate: "translate-x-7" },
  };

  const s = sizes[size] || sizes.md;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative ${s.w} ${
        s.h
      } flex items-center rounded-full transition-colors duration-300 ease-in-out 
        ${
          enabled
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-300 hover:bg-gray-400"
        }`}
    >
      <span
        className={`absolute left-1 flex items-center justify-center bg-white ${
          s.dot
        } rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${
          enabled ? s.translate : ""
        }`}
      />
      {/* Glow effect */}
      {enabled && (
        <span className="absolute inset-0 rounded-full bg-green-400/40 blur-sm opacity-40 pointer-events-none"></span>
      )}
    </button>
  );
};

export default ToggleSwitch;
