import React from "react";
import { Calendar, Users, Package, Home, Cpu } from "lucide-react";
import dayjs from "dayjs";

// Màu trạng thái
const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    ACCEPTED: "bg-green-100 text-green-700 border border-green-300",
    REJECTED: "bg-red-100 text-red-700 border border-red-300",
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

    const { id, capacity, assetCategories, start, end, roomId, roomName, status } =
        requirement;

    const formattedStart = dayjs(start).format("DD/MM/YYYY HH:mm");
    const formattedEnd = dayjs(end).format("DD/MM/YYYY HH:mm");

    const assets =
        assetCategories
            ?.map((id) => allCategories.find((a) => a.id === id)?.name)
            ?.filter(Boolean) || [];

    const displayAssets = assets.slice(0, 3);
    const remainingAssets = assets.slice(3);

    const statusClass =
        statusColors[status.toUpperCase()] ||
        "bg-gray-200 text-gray-700 border border-gray-300";

    const handleAcceptRoom = async (roomId) => {

        try {
            await onApprove(requirement.id, roomId);
            clearSuggestion(requirement.id);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div
            onClick={onClick}
            className="relative group p-5 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 cursor-pointer overflow-hidden"
        >
            {/* Highlight effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100/40 to-transparent dark:from-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Yêu cầu đặt phòng
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        #{id?.slice(0, 8)}
                    </p>
                </div>
                <span
                    className={`px-2.5 py-0.5 text-xs rounded-full font-medium flex items-center gap-1 ${statusClass}`}
                >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {status}
                </span>
            </div>

            {/* Nội dung */}
            <div className="space-y-2 text-sm relative z-10">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Users className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                    <span className="font-medium">Sức chứa:</span> {capacity} người
                </div>

                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Package className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                    <span className="font-medium">Thiết bị:</span>{" "}
                    {assets.length === 0 && "Không có"}
                </div>

                {assets.length > 0 && (
                    <div className="flex flex-wrap gap-2 ml-6">
                        {displayAssets.map((name, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
                            >
                                {name}
                            </span>
                        ))}
                        {remainingAssets.length > 0 && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 border border-blue-300">
                                +{remainingAssets.length}
                            </span>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                    <span>
                        <span className="font-medium">Thời gian:</span> {formattedStart} →{" "}
                        {formattedEnd}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Home className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                    <span>
                        <span className="font-medium">Phòng:</span>{" "}
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

            {suggestion && (
                <div className="mt-2 ml-6 relative group flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800 transition-all duration-200 hover:bg-blue-100/70 dark:hover:bg-blue-900/40">
                    <span className="text-blue-700 dark:text-blue-300 font-medium flex items-center gap-1">
                        Gợi ý: {suggestion.roomName || "Không có phòng phù hợp"}
                        {suggestion.matchScore !== undefined && (
                            <span className="text-xs text-gray-500">
                                ({(suggestion.matchScore).toFixed(0)}%)
                            </span>
                        )}
                    </span>

                    {/* ✅ Nút check chỉ hiện khi có phòng phù hợp */}
                    {suggestion.roomName && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAcceptRoom(suggestion.roomId);
                            }}
                            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-green-500 hover:bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm"
                            title="Chốt gợi ý"
                        >
                            ✓
                        </button>
                    )}
                </div>
            )}

        </div>
    );
};

export default RoomRequirementCard;
