import React from "react";
import { X, Trash2, Pencil, Users, Square, Package } from "lucide-react";
import TimelineTab from "./TimelineTab";

const statusColors = {
    AVAILABLE: "bg-green-100 text-green-700",
    BUSY: "bg-yellow-100 text-yellow-700",
    MAINTENANCE: "bg-red-100 text-red-700",
};

const RoomModal = ({ room, onClose, onEdit, onRemove }) => {
    if (!room) return null;

    const statusClass =
        statusColors[room.status?.toUpperCase()] || "bg-gray-100 text-gray-700";

    const assets = room.assets || [];
    const maxDisplay = 12;

    const isMeetingRoom =
        room.type?.toLowerCase().includes("họp") ||
        room.category?.toLowerCase().includes("họp");

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full p-6 relative animate-fadeIn overflow-y-auto max-h-[90vh]">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    {room.name}
                </h2>

                {/* Section 1 & 2: Info + Assets side by side */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Info */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                            Thông tin cơ bản
                        </h3>
                        <div className="space-y-3 text-gray-700 dark:text-gray-300">
                            <div className="flex justify-between">
                                <span className="font-medium">Loại:</span>
                                <span>{room.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Sức chứa:</span>
                                <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4 text-indigo-500" />
                                    {room.capacity} chỗ
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Diện tích:</span>
                                <span className="flex items-center gap-1">
                                    <Square className="w-4 h-4 text-teal-500" /> {room.area} m²
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Trạng thái:</span>
                                <span
                                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusClass}`}
                                >
                                    {room.status}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Phòng ban:</span>
                                <span>{room.department?.name || "Phòng chung"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Assets */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                            Tài sản trong phòng
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {assets.length > 0 ? (
                                assets.slice(0, maxDisplay).map((asset) => (
                                    <span
                                        key={asset.id}
                                        className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 flex items-center gap-1"
                                    >
                                        <Package className="w-3 h-3 text-blue-500" />
                                        {asset.name}
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

                {/* Section 3: Timeline - chỉ hiện nếu là phòng họp */}
                {isMeetingRoom && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                            Lịch sử dụng
                        </h3>
                        <TimelineTab />
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => onEdit(room)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-1 hover:bg-blue-600 transition"
                    >
                        <Pencil className="w-4 h-4" /> Sửa
                    </button>
                    <button
                        onClick={() => onRemove(room.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-1 hover:bg-red-600 transition"
                    >
                        <Trash2 className="w-4 h-4" /> Xóa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomModal;
