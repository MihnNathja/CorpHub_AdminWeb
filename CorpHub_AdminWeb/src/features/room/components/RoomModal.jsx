import React, { useCallback, useEffect, useMemo, useState } from "react";
import { X, Trash2, Users, Square, Package, Plus, Loader2 } from "lucide-react";
import TimelineTab from "./TimelineTab";
import EditButton from "../../global/components/button/EditButton";
import AssetSidePanel from "../../asset/components/AssetSidePanel";
import { useSelector } from "react-redux";
import { useRoomRequirements } from "../hooks/useRoomRequirement";

const statusColors = {
    AVAILABLE: "bg-green-100 text-green-700",
    BUSY: "bg-yellow-100 text-yellow-700",
    MAINTENANCE: "bg-red-100 text-red-700",
};

const RoomModal = ({ room, onClose, onEdit, onRemove, onAssignAssets, onRemoveAssetFromRoom }) => {
    if (!room) return null;

    // Redux rooms state
    const { rooms } = useSelector((state) => state.rooms);

    // Local state
    const [currentRoom, setCurrentRoom] = useState(room);
    const [showAssetPanel, setShowAssetPanel] = useState(false);

    // Đồng bộ lại room mỗi khi Redux cập nhật
    useEffect(() => {
        if (Array.isArray(rooms)) {
            const updated = rooms.find((r) => r.id === room.id);
            if (updated) {
                setCurrentRoom(updated);
            }
        }
    }, [rooms, room.id]);


    const statusClass =
        statusColors[currentRoom.status?.toUpperCase()] ||
        "bg-gray-100 text-gray-700";

    const assets = useMemo(() => currentRoom.assets || [], [currentRoom.assets]);
    const maxDisplay = 12;

    // Timeline hook
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

    // Khi Move tài sản xong → đóng panel
    const handleAssignAssets = async (payload) => {
        await onAssignAssets(payload);
        setShowAssetPanel(false);
    };

    const handleRemoveAssetFromRoom = async (assetId) => {
        try {
            // Gọi API hoặc callback từ props
            await onRemoveAssetFromRoom(assetId);
        } catch (err) {
            console.error("Lỗi khi gỡ tài sản:", err);
        }
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div
                className={`flex bg-white dark:bg-gray-800 rounded-2xl shadow-2xl 
        w-full transition-all duration-300 ease-in-out relative overflow-hidden max-h-[90vh]
        ${showAssetPanel ? "max-w-7xl" : "max-w-5xl"}`}
            >
                {/* LEFT: Main Content */}
                <div
                    className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${showAssetPanel ? "pr-6" : "pr-8"
                        }`}
                >
                    {/* Close */}
                    {!showAssetPanel && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 z-20"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    )}

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                        {currentRoom.name}
                    </h2>

                    {/* Info + Assets */}
                    <div className="grid grid-cols-[1fr_2fr] gap-6 mb-6">
                        {/* Info */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                                Thông tin cơ bản
                            </h3>
                            <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                                <div className="flex gap-2">
                                    <span className="font-medium min-w-[100px]">Loại:</span>
                                    <span>{currentRoom.type?.name}</span>
                                </div>

                                <div className="flex gap-2">
                                    <span className="font-medium min-w-[100px]">Sức chứa:</span>
                                    <span className="flex items-center gap-1">
                                        <Users className="w-4 h-4 text-indigo-500" />
                                        {currentRoom.capacity} chỗ
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <span className="font-medium min-w-[100px]">Diện tích:</span>
                                    <span className="flex items-center gap-1">
                                        <Square className="w-4 h-4 text-teal-500" />{" "}
                                        {currentRoom.area} m²
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <span className="font-medium min-w-[100px]">Trạng thái:</span>
                                    <span
                                        className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusClass}`}
                                    >
                                        {currentRoom.status}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <span className="font-medium min-w-[100px]">Phòng ban:</span>
                                    <span>{currentRoom.department?.name || "Phòng chung"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Assets */}
                        <div className="relative p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                                Tài sản trong phòng
                            </h3>

                            {/* Nút mở panel */}
                            <button
                                onClick={() => setShowAssetPanel(true)}
                                className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-md 
                    border border-blue-400 text-blue-600 dark:text-blue-400 
                    hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                                title="Thêm tài sản"
                            >
                                <Plus className="w-4 h-4" />
                            </button>

                            {/* Danh sách tài sản */}
                            <div className="flex flex-wrap gap-2">
                                {assets.length > 0 ? (
                                    assets.slice(0, maxDisplay).map((asset) => (
                                        <span
                                            key={asset.id}
                                            className="flex items-center gap-1 px-2 py-1 text-xs rounded-full 
      bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 
      border border-gray-300 dark:border-gray-600 group transition"
                                        >
                                            <Package className="w-3 h-3 text-blue-500" />
                                            {asset.name}
                                            <button
                                                onClick={() => handleRemoveAssetFromRoom(asset.id)}
                                                className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500"
                                                title="Gỡ khỏi phòng"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Chưa có tài sản nào trong phòng.
                                    </p>
                                )}
                                {assets.length > maxDisplay && (
                                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 border border-blue-300">
                                        +{assets.length - maxDisplay}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                            Lịch sử sử dụng
                        </h3>
                        <TimelineTab
                            roomRequirements={roomRequirements || []}
                            loading={loadingRoomReqsByRoom}
                            onDateChange={handleDateChange}
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 mt-6">
                        <EditButton
                            onClick={() => onEdit(currentRoom.id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-1 hover:bg-blue-600 transition"
                        />
                        <button
                            onClick={() => onRemove(currentRoom.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-1 hover:bg-red-600 transition"
                        >
                            <Trash2 className="w-4 h-4" /> Xóa
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
