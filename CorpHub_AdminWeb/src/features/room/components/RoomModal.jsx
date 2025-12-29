import React, { useCallback, useEffect, useMemo, useState } from "react";
import { X, Trash2, Users, Square, Package, Plus, Loader2, MapPin, Tag, Calendar } from "lucide-react";
import TimelineTab from "./TimelineTab";
import EditButton from "../../global/components/button/EditButton";
import AssetSidePanel from "../../asset/components/AssetSidePanel";
import { useSelector } from "react-redux";
import { useRoomRequirements } from "../hooks/useRoomRequirement";

const statusColors = {
    AVAILABLE: {
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-200 dark:border-emerald-800",
        dot: "bg-emerald-500",
    },
    BUSY: {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-200 dark:border-amber-800",
        dot: "bg-amber-500",
    },
    MAINTENANCE: {
        bg: "bg-rose-100 dark:bg-rose-900/30",
        text: "text-rose-700 dark:text-rose-300",
        border: "border-rose-200 dark:border-rose-800",
        dot: "bg-rose-500",
    },
};

const RoomModal = ({ room, onClose, onEdit, onRemove, onAssignAssets, onRemoveAssetFromRoom }) => {
    if (!room) return null;

    const { rooms } = useSelector((state) => state.rooms);
    const [currentRoom, setCurrentRoom] = useState(room);
    const [showAssetPanel, setShowAssetPanel] = useState(false);

    useEffect(() => {
        if (Array.isArray(rooms)) {
            const updated = rooms.find((r) => r.id === room.id);
            if (updated) {
                setCurrentRoom(updated);
            }
        }
    }, [rooms, room.id]);

    const statusStyle = statusColors[currentRoom.status?.toUpperCase()] || statusColors.AVAILABLE;
    const assets = useMemo(() => currentRoom.assets || [], [currentRoom.assets]);
    const maxDisplay = 12;

    const today = new Date().toISOString().split("T")[0];
    const {
        roomRequirements,
        loadRoomRequirements,
        loadingRoomReqsByRoom,
    } = useRoomRequirements(false);

    useEffect(() => {
        if (currentRoom?.id) loadRoomRequirements(currentRoom.id, today);
    }, [currentRoom?.id, loadRoomRequirements]);

    const handleDateChange = useCallback(
        (date) => {
            loadRoomRequirements(currentRoom.id, date);
        },
        [currentRoom?.id, loadRoomRequirements]
    );

    const handleAssignAssets = async (payload) => {
        await onAssignAssets(payload);
        setShowAssetPanel(false);
    };

    const handleRemoveAssetFromRoom = async (assetId) => {
        try {
            await onRemoveAssetFromRoom(assetId);
        } catch (err) {
            console.error("Error removing asset:", err);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
            <div
                className={`flex bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800
                    w-full transition-all duration-300 ease-in-out relative overflow-hidden max-h-[90vh]
                    ${showAssetPanel ? "max-w-7xl" : "max-w-5xl"}`}
            >
                {/* LEFT: Main Content */}
                <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300`}>
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                                    {currentRoom.name}
                                </h2>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusStyle.border} ${statusStyle.bg}`}>
                                    <div className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                                    <span className={`text-xs font-semibold ${statusStyle.text}`}>
                                        {currentRoom.status}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Room Management & Asset Tracking
                            </p>
                        </div>

                        {!showAssetPanel && (
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                        {/* Info Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {/* Capacity */}
                            <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                        Capacity
                                    </p>
                                </div>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {currentRoom.capacity}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">people</p>
                            </div>

                            {/* Area */}
                            <div className="p-3 rounded-lg bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border border-teal-200 dark:border-teal-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <Square className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                        Area
                                    </p>
                                </div>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {currentRoom.area}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">m²</p>
                            </div>

                            {/* Type */}
                            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                        Type
                                    </p>
                                </div>
                                <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                    {currentRoom.type?.name || "N/A"}
                                </p>
                            </div>

                            {/* Department */}
                            <div className="p-3 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                        Dept
                                    </p>
                                </div>
                                <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                    {currentRoom.department?.name || "Shared"}
                                </p>
                            </div>
                        </div>

                        {/* Assets Section */}
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                        Assets in Room
                                    </h3>
                                    {assets.length > 0 && (
                                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                            {assets.length}
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() => setShowAssetPanel(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Asset
                                </button>
                            </div>

                            {/* Asset List */}
                            <div className="flex flex-wrap gap-2">
                                {assets.length > 0 ? (
                                    assets.slice(0, maxDisplay).map((asset) => (
                                        <div
                                            key={asset.id}
                                            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all"
                                        >
                                            <Package className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                                                {asset.name}
                                            </span>
                                            <button
                                                onClick={() => handleRemoveAssetFromRoom(asset.id)}
                                                className="ml-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-500 transition-all"
                                                title="Remove asset"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 italic py-2">
                                        No assets assigned yet
                                    </p>
                                )}
                                {assets.length > maxDisplay && (
                                    <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                        +{assets.length - maxDisplay} more
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Timeline Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                    Usage Timeline
                                </h3>
                            </div>
                            <TimelineTab
                                roomRequirements={roomRequirements || []}
                                loading={loadingRoomReqsByRoom}
                                onDateChange={handleDateChange}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 text-sm font-semibold transition-colors"
                        >
                            Close
                        </button>

                        <EditButton
                            onClick={() => onEdit(currentRoom)}
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 font-semibold transition-colors"
                        />

                        <button
                            onClick={() => onRemove(currentRoom.id)}
                            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center gap-2 font-semibold transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>

                {/* RIGHT: Asset Side Panel */}
                {showAssetPanel && (
                    <AssetSidePanel
                        roomId={currentRoom.id}
                        existedAssetIds={assets.map((a) => a.id)}
                        onClose={() => setShowAssetPanel(false)}
                        onAssignAssets={handleAssignAssets}
                    />
                )}
            </div>
        </div>
    );
};

export default RoomModal;
