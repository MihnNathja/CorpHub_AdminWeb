import React from "react";
import { Calendar, Users, Package, Home, Zap, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import dayjs from "dayjs";

const statusStyles = {
    PENDING: {
        bg: "bg-amber-50 dark:bg-amber-900/20",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-200 dark:border-amber-800",
        dot: "bg-amber-500",
        icon: Clock,
    },
    ACCEPTED: {
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        text: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-200 dark:border-emerald-800",
        dot: "bg-emerald-500",
        icon: CheckCircle2,
    },
    REJECTED: {
        bg: "bg-rose-50 dark:bg-rose-900/20",
        text: "text-rose-700 dark:text-rose-300",
        border: "border-rose-200 dark:border-rose-800",
        dot: "bg-rose-500",
        icon: AlertCircle,
    },
};

const RoomRequirementCard = ({
    requirement,
    allCategories = [],
    suggestion,
    clearSuggestion,
    onApprove,
    onClick,
}) => {
    if (!requirement) return null;

    const { id, capacity, assetCategories, start, end, roomId, roomName, status } = requirement;

    const formattedStart = dayjs(start).format("DD/MM/YYYY HH:mm");
    const formattedEnd = dayjs(end).format("DD/MM/YYYY HH:mm");
    const formattedDate = dayjs(start).format("DD/MM/YYYY");
    const formattedStartTime = dayjs(start).format("HH:mm");
    const formattedEndTime = dayjs(end).format("HH:mm");

    const assets =
        assetCategories
            ?.map((cid) => allCategories.find((a) => a.id === cid)?.name)
            ?.filter(Boolean) || [];

    const displayAssets = assets.slice(0, 2);
    const remainingAssets = assets.slice(2);

    const statusConfig = statusStyles[status?.toUpperCase()] || {
        bg: "bg-gray-50 dark:bg-gray-900/20",
        text: "text-gray-700 dark:text-gray-300",
        border: "border-gray-200 dark:border-gray-800",
        dot: "bg-gray-500",
        icon: Clock,
    };

    const StatusIcon = statusConfig.icon;

    const handleAcceptRoom = async (rid) => {
        try {
            await onApprove(requirement.id, rid);
            clearSuggestion(requirement.id);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div
            onClick={onClick}
            className={`
                relative group cursor-pointer rounded-2xl transition-all duration-300
                overflow-hidden border-2
                hover:-translate-y-1 hover:shadow-xl
                ${statusConfig.bg} ${statusConfig.border}
                bg-gradient-to-br from-white/95 to-gray-50/95
                dark:from-gray-900/95 dark:to-gray-800/95
            `}
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30 dark:from-blue-900/10 dark:via-transparent dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                            Room Request
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                            ID: {id?.slice(0, 12)}
                        </p>
                    </div>

                    {/* Status Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border ${statusConfig.border} ${statusConfig.text} ${statusConfig.bg}`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${statusConfig.dot} animate-pulse`} />
                        {status}
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Capacity */}
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-center gap-2 mb-1.5">
                            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                Capacity
                            </span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {capacity}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">people</p>
                    </div>

                    {/* Assets Count */}
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2 mb-1.5">
                            <Package className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                Assets
                            </span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {assets.length}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">required</p>
                    </div>
                </div>

                {/* Assets List */}
                {assets.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {displayAssets.map((name, idx) => (
                            <span
                                key={idx}
                                className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-medium shadow-sm"
                            >
                                {name}
                            </span>
                        ))}
                        {remainingAssets.length > 0 && (
                            <span className="px-2.5 py-1.5 text-xs rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold">
                                +{remainingAssets.length}
                            </span>
                        )}
                    </div>
                )}

                {/* Time */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 space-y-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Date
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formattedDate}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Time
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formattedStartTime} - {formattedEndTime}
                        </span>
                    </div>
                </div>

                {/* Room Status */}
                <div className={`
                    p-3 rounded-xl border-2 flex items-center justify-between
                    ${roomId
                        ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                        : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                    }
                `}>
                    <div className="flex items-center gap-2.5">
                        <Home className={`
                            w-4 h-4
                            ${roomId
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-orange-600 dark:text-orange-400"
                            }
                        `} />
                        <div>
                            <p className={`
                                text-xs font-semibold uppercase tracking-wide
                                ${roomId
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-orange-600 dark:text-orange-400"
                                }
                            `}>
                                Room
                            </p>
                            <p className={`
                                text-sm font-bold mt-0.5
                                ${roomId
                                    ? "text-emerald-900 dark:text-emerald-100"
                                    : "text-orange-900 dark:text-orange-100"
                                }
                            `}>
                                {roomId ? roomName : "Not Assigned"}
                            </p>
                        </div>
                    </div>
                    {!roomId && (
                        <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    )}
                </div>

                {/* Suggestion */}
                {suggestion && (
                    <div className="p-3 rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 space-y-2">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                                AI Suggestion
                            </span>
                            {suggestion.matchScore !== undefined && (
                                <span className="ml-auto text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                                    {suggestion.matchScore.toFixed(0)}% Match
                                </span>
                            )}
                        </div>

                        {suggestion.roomName ? (
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    → {suggestion.roomName}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAcceptRoom(suggestion.roomId);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                                    title="Accept suggestion"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Accept
                                </button>
                            </div>
                        ) : (
                            <p className="text-sm text-blue-700 dark:text-blue-300 italic">
                                No suitable room found
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomRequirementCard;
