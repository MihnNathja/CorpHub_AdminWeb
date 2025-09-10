import React from "react";

const StatCard = ({ label, count, colors, className = "" }) => {
    return (
        <div
            className={`flex items-center justify-center gap-1 px-2 py-1 rounded-2xl shadow-md ${colors[label]} ${className}`}
        >
            <span className="text-xs font-semibold">
                {label}{count !== undefined && ` (${count})`}
            </span>
        </div>
    );
};

export default StatCard;
