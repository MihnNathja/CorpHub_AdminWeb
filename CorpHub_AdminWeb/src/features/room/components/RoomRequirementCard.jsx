import React from "react";
import { Calendar, Users, Package, Home, Clock } from "lucide-react";
import dayjs from "dayjs";

// Định nghĩa màu trạng thái yêu cầu
const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    APPROVED: "bg-green-100 text-green-700 border border-green-300",
    REJECTED: "bg-red-100 text-red-700 border border-red-300",
};

const RoomRequirementCard = ({
    requirement,
    allCategories = [],
    onClick,
    onApprove,
    onReject,
}) => {
    if (!requirement) return null;

    const {
        id,
        capacity,
        assetCategories,
        start,
        end,
        roomId,
        status = "PENDING",
    } = requirement;

    const formattedStart = dayjs(start).format("DD/MM/YYYY HH:mm");
    const formattedEnd = dayjs(end).format("DD/MM/YYYY HH:mm");

    // Lấy tên thiết bị theo assetCateIds
    const assets =
        assetCategories?.map(
            (id) => allCategories.find((a) => a.id === id)?.name
        )?.filter(Boolean) || [];

    const maxDisplay = 3;
    const displayAssets = assets.slice(0, maxDisplay);
    const remainingAssets = assets.slice(maxDisplay);
    const statusClass =
        statusColors[status.toUpperCase()] ||
        "bg-gray-200 text-gray-700 border border-gray-300";

    return (
        <div
            onClick={onClick}
            className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer border border-gray-100 dark:border-gray-700"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        Yêu cầu đặt phòng
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        #{id?.slice(0, 8)}
                    </p>
                </div>
                <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium flex items-center gap-1 ${statusClass}`}
                >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {status === "PENDING"
                        ? "Đang chờ duyệt"
                        : status === "APPROVED"
                            ? "Đã phê duyệt"
                            : "Đã từ chối"}
                </span>
            </div>

            {/* Info */}
            <div className="space-y-2 text-sm mb-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Users className="w-4 h-4 text-indigo-500" />
                    <span>Sức chứa: {capacity} người</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Package className="w-4 h-4 text-teal-500" />
                    <span>Thiết bị: {assets.length > 0 ? "" : "Không có"}</span>
                </div>

                {assets.length > 0 && (
                    <div className="flex flex-wrap gap-2 ml-6">
                        {displayAssets.map((name, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            >
                                {name}
                            </span>
                        ))}

                        {remainingAssets.length > 0 && (
                            <div className="relative group">
                                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 border border-blue-300">
                                    +{remainingAssets.length}
                                </span>

                                {/* Tooltip */}
                                <div className="absolute z-20 hidden group-hover:block top-full left-0 mt-1 w-max max-w-xs p-2 rounded-lg bg-gray-800 text-white text-xs shadow-lg">
                                    {remainingAssets.map((name, idx) => (
                                        <div key={idx} className="truncate">
                                            • {name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>
                        {formattedStart} → {formattedEnd}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Home className="w-4 h-4 text-orange-500" />
                    <span>
                        Phòng:{" "}
                        {roomId ? (
                            <span className="text-green-600 dark:text-green-400 font-medium">
                                Đã gán
                            </span>
                        ) : (
                            <span className="text-red-500 dark:text-red-400 font-medium">
                                Chưa gán
                            </span>
                        )}
                    </span>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-3 flex justify-end gap-2">
                {status === "PENDING" && (
                    <>
                        {onApprove && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onApprove(requirement);
                                }}
                                className="px-3 py-1 text-xs rounded-lg bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 transition"
                            >
                                Phê duyệt
                            </button>
                        )}
                        {onReject && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onReject(requirement);
                                }}
                                className="px-3 py-1 text-xs rounded-lg bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 transition"
                            >
                                Từ chối
                            </button>
                        )}
                    </>
                )}
                <button
                    className="px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                    Chi tiết →
                </button>
            </div>
        </div>
    );
};

export default RoomRequirementCard;
