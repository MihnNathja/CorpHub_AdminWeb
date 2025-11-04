import {
    X,
    Calendar,
    Users,
    Package,
    Home,
    Layers,
    ChevronDown,
    ChevronUp,
    Wrench,
    CheckCircle,
} from "lucide-react";
import dayjs from "dayjs";
import { useRoomRequirements } from "../hooks/useRoomRequirement";
import { useState } from "react";

const RoomRequirementModal = ({ onClose, requirement, allCategories = [] }) => {
    const {
        suitableRooms,
        loadingSuitable,
        approve,
    } = useRoomRequirements();

    const [expandedRoomId, setExpandedRoomId] = useState(null);

    if (!requirement) return null;

    /* -------------------- GIẢI NÉN -------------------- */
    const { capacity, assetCategories = [], start, end, roomId, roomName, status } =
        requirement;
    const formattedStart = dayjs(start).format("DD/MM/YYYY HH:mm");
    const formattedEnd = dayjs(end).format("DD/MM/YYYY HH:mm");

    const requiredCategoryIds = assetCategories || [];

    const statusColors = {
        PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
        ACCEPTED: "bg-green-100 text-green-700 border-green-300",
        REJECTED: "bg-red-100 text-red-700 border-red-300",
    };
    const statusClass =
        statusColors[status.toUpperCase()] || "bg-gray-100 text-gray-700 border-gray-300";

    /* -------------------- HÀNH ĐỘNG -------------------- */
    const handleAcceptRoom = async (room) => {

        try {
            await approve(requirement.id, room.id);
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    /* -------------------- UI -------------------- */
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl relative p-6 animate-fadeIn">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="mb-5 border-b border-gray-200 dark:border-gray-700 pb-2 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        Chi tiết yêu cầu đặt phòng
                    </h2>
                    <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${statusClass}`}
                    >
                        {status}
                    </span>
                </div>

                {/* Body */}
                <div className="space-y-4 text-sm text-gray-700 dark:text-gray-200 max-h-[70vh] overflow-y-auto">
                    {/* Tổng quan */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-indigo-500" />
                            <span>
                                <strong>Sức chứa:</strong> {capacity} người
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span>
                                <strong>Thời gian:</strong> {formattedStart} → {formattedEnd}
                            </span>
                        </div>

                        <div className="flex items-start gap-2 sm:col-span-2">
                            <Package className="w-4 h-4 text-teal-500 mt-0.5" />
                            <div>
                                <strong>Thiết bị yêu cầu:</strong>{" "}
                                {requiredCategoryIds.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {requiredCategoryIds.map((id, idx) => {
                                            const name =
                                                allCategories.find((a) => a.id === id)?.name ||
                                                "Không rõ";
                                            return (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                                                >
                                                    {name}
                                                </span>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <span className="text-gray-500">Không có</span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:col-span-2">
                            <Home className="w-4 h-4 text-orange-500" />
                            <span>
                                <strong>Phòng hiện tại:</strong>{" "}
                                {roomId ? (
                                    <span className="text-green-600 dark:text-green-400 font-medium">
                                        {roomName}
                                    </span>
                                ) : (
                                    <span className="text-red-500 dark:text-red-400 font-medium">
                                        Chưa gán
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Danh sách phòng phù hợp */}
                    {status !== "CLOSED" && (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-semibold mb-3 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-blue-500" />
                                Danh sách phòng phù hợp
                            </h3>
                            {loadingSuitable ? (
                                <p className="text-gray-500 dark:text-gray-400">Đang tải...</p>
                            ) : suitableRooms?.length > 0 ? (
                                <div className="space-y-3">
                                    {suitableRooms.map((room) => {
                                        const isOpen = expandedRoomId === room.id;
                                        return (
                                            <div
                                                key={room.id}
                                                className="border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:shadow transition"
                                            >
                                                {/* Header phòng */}
                                                <div
                                                    className="flex justify-between items-center p-3 cursor-pointer"
                                                    onClick={() =>
                                                        setExpandedRoomId(isOpen ? null : room.id)
                                                    }
                                                >
                                                    <div>
                                                        <p className="font-semibold text-gray-800 dark:text-gray-100">
                                                            {room.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {room.type.name} • {room.capacity} người •{" "}
                                                            {room.area} m²
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`text-xs px-2 py-1 rounded-full border ${room.status === "AVAILABLE"
                                                                ? "bg-green-100 text-green-700 border-green-300"
                                                                : "bg-red-100 text-red-600 border-red-300"
                                                                }`}
                                                        >
                                                            {room.status === "AVAILABLE"
                                                                ? "Sẵn sàng"
                                                                : "Đang bận"}
                                                        </span>
                                                        {isOpen ? (
                                                            <ChevronUp className="w-4 h-4 text-gray-500" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Nội dung chi tiết */}
                                                {isOpen && (
                                                    <div className="p-3 border-t border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 space-y-3">
                                                        {room.assets?.length > 0 ? (
                                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                {room.assets.map((asset) => {
                                                                    const isRequired =
                                                                        requiredCategoryIds.includes(
                                                                            asset.category?.id
                                                                        );
                                                                    return (
                                                                        <li
                                                                            key={asset.id}
                                                                            className={`text-xs rounded-lg p-2 border transition ${isRequired
                                                                                ? "bg-green-50 dark:bg-green-900/40 border-green-400"
                                                                                : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-80"
                                                                                }`}
                                                                        >
                                                                            <div className="flex justify-between items-center">
                                                                                <p className="font-medium text-gray-800 dark:text-gray-100">
                                                                                    {asset.name}
                                                                                </p>
                                                                                {isRequired && (
                                                                                    <span className="text-green-600 dark:text-green-400 text-xs font-semibold">
                                                                                        ✓ Phù hợp
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <p className="text-gray-500 dark:text-gray-400">
                                                                                {asset.category?.name}
                                                                            </p>
                                                                            <p className="text-gray-500 dark:text-gray-400">
                                                                                Trạng thái:{" "}
                                                                                <span
                                                                                    className={
                                                                                        asset.status ===
                                                                                            "USABLE"
                                                                                            ? "text-green-600 dark:text-green-400"
                                                                                            : "text-red-500 dark:text-red-400"
                                                                                    }
                                                                                >
                                                                                    {asset.status}
                                                                                </span>
                                                                            </p>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                Không có thiết bị nào trong phòng này.
                                                            </p>
                                                        )}

                                                        {/* 🟢 Nút chọn phòng */}
                                                        <div className="flex justify-end mt-3">
                                                            <button
                                                                onClick={() =>
                                                                    handleAcceptRoom(room)
                                                                }
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-medium transition"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                Chọn phòng này
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">
                                    Không tìm thấy phòng phù hợp.
                                </p>
                            )}
                        </div>)}
                </div>


                {/* Footer */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomRequirementModal;
