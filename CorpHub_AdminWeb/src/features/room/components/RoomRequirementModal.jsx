import React, { useState } from "react";
import {
    X,
    Calendar,
    Users,
    Package,
    Home,
    Layers,
    ChevronDown,
    ChevronUp,
    Loader,
    CheckCircle2,
    AlertCircle,
    Zap,
    Square,
    Clock,
} from "lucide-react";
import dayjs from "dayjs";
import { useRoomRequirements } from "../hooks/useRoomRequirement";

const statusColors = {
    PENDING: {
        bg: "bg-amber-50 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-200 dark:border-amber-800",
        dot: "bg-amber-500",
        label: "Pending Review",
    },
    ACCEPTED: {
        bg: "bg-emerald-50 dark:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-200 dark:border-emerald-800",
        dot: "bg-emerald-500",
        label: "Approved",
    },
    REJECTED: {
        bg: "bg-rose-50 dark:bg-rose-900/30",
        text: "text-rose-700 dark:text-rose-300",
        border: "border-rose-200 dark:border-rose-800",
        dot: "bg-rose-500",
        label: "Rejected",
    },
};

const RoomRequirementModal = ({ onClose, onApprove, requirement, allCategories = [] }) => {
    const { suitableRooms, loadingSuitable } = useRoomRequirements();
    const [expandedRoomId, setExpandedRoomId] = useState(null);

    if (!requirement) return null;

    const { capacity, assetCategories = [], start, end, roomId, roomName, status } = requirement;
    const formattedStart = dayjs(start).format("DD/MM/YYYY HH:mm");
    const formattedEnd = dayjs(end).format("DD/MM/YYYY HH:mm");
    const formattedDate = dayjs(start).format("DD/MM/YYYY");
    const formattedTime = `${dayjs(start).format("HH:mm")} - ${dayjs(end).format("HH:mm")}`;

    const requiredCategoryIds = assetCategories || [];
    const statusConfig = statusColors[status?.toUpperCase()] || {
        bg: "bg-gray-50 dark:bg-gray-900/30",
        text: "text-gray-700 dark:text-gray-300",
        border: "border-gray-200 dark:border-gray-800",
        dot: "bg-gray-500",
        label: status || "Unknown",
    };

    const handleAcceptRoom = async (room) => {
        try {
            await onApprove(requirement.id, room.id);
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-800 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                            Room Booking Details
                        </p>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Request #{requirement.id?.slice(0, 12)}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-semibold border ${statusConfig.border} ${statusConfig.text} ${statusConfig.bg}`}>
                            <div className={`w-2.5 h-2.5 rounded-full ${statusConfig.dot} animate-pulse`} />
                            {statusConfig.label}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                    {/* Request Overview */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            Request Overview
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {/* Capacity */}
                            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                        Capacity
                                    </p>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {capacity}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">people required</p>
                            </div>

                            {/* Date */}
                            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                        Date
                                    </p>
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    {formattedDate}
                                </p>
                            </div>

                            {/* Time */}
                            <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 border border-cyan-200 dark:border-cyan-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                        Time
                                    </p>
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    {formattedTime}
                                </p>
                            </div>

                            {/* Assets Count */}
                            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                        Assets
                                    </p>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {requiredCategoryIds.length}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">required</p>
                            </div>
                        </div>
                    </div>

                    {/* Required Assets */}
                    {requiredCategoryIds.length > 0 && (
                        <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                    Required Equipment
                                </h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {requiredCategoryIds.map((id, idx) => {
                                    const name = allCategories.find((a) => a.id === id)?.name || "Unknown";
                                    return (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-sm"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            {name}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Current Room */}
                    <div className={`p-4 rounded-xl border-2 flex items-center justify-between ${roomId
                        ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                        : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                        }`}>
                        <div className="flex items-center gap-3">
                            <Home className={`w-5 h-5 ${roomId
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-orange-600 dark:text-orange-400"
                                }`} />
                            <div>
                                <p className={`text-xs font-semibold uppercase tracking-wide ${roomId
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-orange-600 dark:text-orange-400"
                                    }`}>
                                    Assigned Room
                                </p>
                                <p className={`text-base font-bold mt-0.5 ${roomId
                                    ? "text-emerald-900 dark:text-emerald-100"
                                    : "text-orange-900 dark:text-orange-100"
                                    }`}>
                                    {roomId ? roomName : "Not Assigned Yet"}
                                </p>
                            </div>
                        </div>
                        {!roomId && (
                            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        )}
                    </div>

                    {/* Available Rooms */}
                    {status !== "CLOSED" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                        Available Rooms
                                    </h3>
                                </div>
                                {loadingSuitable && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                        <Loader className="w-3.5 h-3.5 animate-spin" />
                                        Loading...
                                    </div>
                                )}
                            </div>

                            {loadingSuitable ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Searching suitable rooms...
                                        </p>
                                    </div>
                                </div>
                            ) : suitableRooms?.length > 0 ? (
                                <div className="space-y-3">
                                    {suitableRooms.map((room) => {
                                        const isOpen = expandedRoomId === room.id;
                                        const isAvailable = room.status === "AVAILABLE";

                                        return (
                                            <div
                                                key={room.id}
                                                className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800/50 hover:shadow-lg transition-all duration-200"
                                            >
                                                {/* Room Header */}
                                                <button
                                                    onClick={() => setExpandedRoomId(isOpen ? null : room.id)}
                                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors text-left"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <h4 className="text-base font-bold text-gray-900 dark:text-white truncate">
                                                                {room.name}
                                                            </h4>
                                                            {isAvailable && (
                                                                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex-shrink-0">
                                                                    Available
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                                                            <div className="flex items-center gap-1">
                                                                <Users className="w-3.5 h-3.5" />
                                                                {room.capacity} people
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Square className="w-3.5 h-3.5" />
                                                                {room.area} m²
                                                            </div>
                                                            <span className="text-gray-500">
                                                                {room.type?.name}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="ml-4 flex-shrink-0">
                                                        {isOpen ? (
                                                            <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                                        )}
                                                    </div>
                                                </button>

                                                {/* Room Details */}
                                                {isOpen && (
                                                    <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-b from-gray-50 dark:from-gray-800/30 to-white dark:to-gray-800/50 space-y-4">
                                                        {/* Assets */}
                                                        {room.assets?.length > 0 ? (
                                                            <div className="space-y-2">
                                                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                                                    Equipment Available
                                                                </p>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                    {room.assets.map((asset) => {
                                                                        const isRequired = requiredCategoryIds.includes(
                                                                            asset.category?.id
                                                                        );
                                                                        const isUsable = asset.status === "USABLE";

                                                                        return (
                                                                            <div
                                                                                key={asset.id}
                                                                                className={`p-3 rounded-lg border text-xs transition-all ${isRequired
                                                                                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                                                                                    : "bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 opacity-75"
                                                                                    }`}
                                                                            >
                                                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                                                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate flex-1">
                                                                                        {asset.name}
                                                                                    </p>
                                                                                    {isRequired && (
                                                                                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-600 text-white whitespace-nowrap flex-shrink-0">
                                                                                            Required ✓
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                <p className="text-gray-600 dark:text-gray-400">
                                                                                    {asset.category?.name}
                                                                                </p>
                                                                                <p className={`mt-1 text-[10px] font-semibold ${isUsable
                                                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                                                    : "text-rose-600 dark:text-rose-400"
                                                                                    }`}>
                                                                                    {asset.status}
                                                                                </p>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                                <span>No equipment in this room</span>
                                                            </div>
                                                        )}

                                                        {/* Action Button */}
                                                        <button
                                                            onClick={() => handleAcceptRoom(room)}
                                                            className="w-full px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Assign This Room
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-12 px-4">
                                    <div className="text-center space-y-2">
                                        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            No suitable rooms found
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Try adjusting your requirements
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomRequirementModal;
