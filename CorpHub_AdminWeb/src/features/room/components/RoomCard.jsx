import React from "react";
import { Building2, Users, Square, Info } from "lucide-react";

const statusConfigs = {
    AVAILABLE: {
        className:
            "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-100 dark:border-emerald-800",
        dot: "bg-emerald-500",
        label: "Available",
    },
    BUSY: {
        className:
            "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-800",
        dot: "bg-amber-500",
        label: "Busy",
    },
    MAINTENANCE: {
        className:
            "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-100 dark:border-rose-800",
        dot: "bg-rose-500",
        label: "Maintenance",
    },
};

const StatItem = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center gap-3">
        <span
            className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-${color}-50 text-${color}-600 dark:bg-${color}-900/30 dark:text-${color}-100`}
        >
            <Icon className="w-5 h-5" />
        </span>
        <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {label}
            </p>
            <p className="font-semibold text-gray-800 dark:text-gray-100">
                {value}
            </p>
        </div>
    </div>
);

const RoomCard = ({ room, onClick }) => {
    const statusKey = room.status?.toUpperCase();
    const status = statusConfigs[statusKey] || {
        className:
            "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800/60 dark:text-gray-200 dark:border-gray-700",
        dot: "bg-gray-400",
        label: room.status || "Unknown",
    };

    const assets = room.assets || [];
    const maxDisplay = 3;
    const displayAssets = assets.slice(0, maxDisplay);
    const remainingAssets = assets.slice(maxDisplay);

    return (
        <div
            onClick={onClick}
            className="p-5 bg-white dark:bg-gray-900 rounded-2xl shadow-[0_10px_30px_-12px_rgba(0,0,0,0.2)] hover:shadow-[0_16px_40px_-12px_rgba(59,130,246,0.3)] hover:border-blue-200 dark:hover:border-blue-500/50 border border-gray-100 dark:border-gray-800 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {room.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {room.department?.name || "Common room"}
                    </p>
                </div>
                <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold inline-flex items-center gap-2 ${status.className}`}
                >
                    <span className={`w-2.5 h-2.5 rounded-full ${status.dot}`} />
                    {status.label}
                </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <StatItem
                    icon={Building2}
                    label="Room type"
                    value={room.type?.name || "—"}
                    color="blue"
                />
                <StatItem
                    icon={Users}
                    label="Capacity"
                    value={`${room.capacity ?? "—"} people`}
                    color="indigo"
                />
                <StatItem
                    icon={Square}
                    label="Area"
                    value={`${room.area ?? "—"} m²`}
                    color="teal"
                />
            </div>

            {/* Assets */}
            {assets.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {displayAssets.map((asset) => (
                        <span
                            key={asset.id}
                            className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        >
                            {asset.name}
                        </span>
                    ))}

                    {remainingAssets.length > 0 && (
                        <div className="relative group">
                            <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-800">
                                +{remainingAssets.length} equipment
                            </span>
                            <div className="absolute z-20 hidden group-hover:block top-full left-0 mt-2 w-60 p-3 rounded-xl bg-gray-900 text-white text-xs shadow-2xl border border-gray-700">
                                <div className="flex items-center gap-2 mb-2 text-gray-200">
                                    <Info className="w-4 h-4" />
                                    <span>Other equipment</span>
                                </div>
                                <div className="space-y-1 max-h-40 overflow-auto pr-1">
                                    {remainingAssets.map((asset) => (
                                        <div key={asset.id} className="truncate">
                                            • {asset.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    No equipment registered.
                </p>
            )}
        </div>
    );
};

export default RoomCard;
