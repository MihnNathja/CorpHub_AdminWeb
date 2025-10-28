import React from "react";
import { Building2, Users, Square } from "lucide-react";

const statusColors = {
    AVAILABLE: "bg-green-100 text-green-700 border border-green-300",
    BUSY: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    MAINTENANCE: "bg-red-100 text-red-700 border border-red-300",
};

const RoomCard = ({ room, onClick }) => {
    const statusClass =
        statusColors[room.status?.toUpperCase()] || "bg-gray-200 text-gray-700";

    const assets = room.assets || [];
    const maxDisplay = 3;
    const displayAssets = assets.slice(0, maxDisplay);
    const remainingAssets = assets.slice(maxDisplay);

    return (
        <div
            onClick={onClick}
            className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer border border-gray-100 dark:border-gray-700"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {room.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {room.department?.name || "Phòng chung"}
                    </p>
                </div>
                <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium flex items-center gap-1 ${statusClass}`}
                >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {room.status}
                </span>
            </div>

            {/* Info */}
            <div className="space-y-2 text-sm mb-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Building2 className="w-4 h-4 text-blue-500" />
                    <span>{room.type}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Users className="w-4 h-4 text-indigo-500" />
                    <span>{room.capacity} chỗ</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Square className="w-4 h-4 text-teal-500" />
                    <span>{room.area} m²</span>
                </div>
            </div>

            {/* Assets */}
            {assets.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 relative">
                    {displayAssets.map((asset) => (
                        <span
                            key={asset.id}
                            className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                        >
                            {asset.name}
                        </span>
                    ))}

                    {remainingAssets.length > 0 && (
                        <div className="relative group">
                            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 border border-blue-300">
                                +{remainingAssets.length}
                            </span>

                            {/* Tooltip */}
                            <div className="absolute z-20 hidden group-hover:block top-full left-0 mt-1 w-max max-w-xs p-2 rounded-lg bg-gray-800 text-white text-xs shadow-lg">
                                {remainingAssets.map((asset) => (
                                    <div key={asset.id} className="truncate">
                                        • {asset.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RoomCard;
