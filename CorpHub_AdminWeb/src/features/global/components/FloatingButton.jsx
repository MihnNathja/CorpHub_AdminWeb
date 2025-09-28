import React from "react";

const FloatingButton = ({ onClick, icon: Icon, tooltip, color = "green" }) => {
    const colorClasses = {
        green: "from-green-500 via-emerald-500 to-green-600 hover:from-green-400 hover:via-emerald-400 hover:to-green-500 focus:ring-green-300",
        blue: "from-blue-500 via-sky-500 to-blue-600 hover:from-blue-400 hover:via-sky-400 hover:to-blue-500 focus:ring-blue-300",
        red: "from-red-500 via-rose-500 to-red-600 hover:from-red-400 hover:via-rose-400 hover:to-red-500 focus:ring-red-300",
    };

    return (
        <div className="fixed bottom-8 right-8 group">
            <button
                onClick={onClick}
                className={`w-14 h-14 rounded-full 
          bg-gradient-to-tr ${colorClasses[color]}
          text-white shadow-xl flex items-center justify-center
          transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]
          focus:outline-none focus:ring-4`}
            >
                {Icon && <Icon className="w-6 h-6 transition-transform duration-200 group-hover:rotate-90" />}
            </button>

            {tooltip && (
                <span className="absolute bottom-20 right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity 
          bg-gray-700 text-white text-xs px-3 py-1 rounded-lg shadow-md">
                    {tooltip}
                </span>
            )}
        </div>
    );
};

export default FloatingButton;
