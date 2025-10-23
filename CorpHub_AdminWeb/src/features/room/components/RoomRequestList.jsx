import React, { useState } from "react";
import { useRoomRequirement } from "../hooks/useRoomRequirement";
import RoomRequirementCard from "../components/RoomRequirementCard";
import RoomRequirementModal from "../components/RoomRequirementModal"; // 🧩 Thêm modal
import { useAssets } from "../../asset/hooks/useAssets";
import { RotateCcw } from "lucide-react";

export default function RoomRequestList() {
    const { requirements, loading, approve, reject, refresh } = useRoomRequirement(true);
    const { categories = [], loading: loadingCategories } = useAssets();

    const [selectedRequirement, setSelectedRequirement] = useState(null); // 🧠 state cho modal

    const isLoading = loading || loadingCategories;

    /* -------------------- UI Loading -------------------- */
    if (isLoading)
        return (
            <div className="flex flex-col justify-center items-center min-h-[200px] text-gray-500 dark:text-gray-300">
                <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mb-3"></div>
                <p>Đang tải yêu cầu đặt phòng...</p>
            </div>
        );

    /* -------------------- UI Empty -------------------- */
    if (!requirements || requirements.length === 0)
        return (
            <div className="text-center py-10">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    Yêu cầu đặt phòng
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                    Hiện chưa có yêu cầu đặt phòng nào.
                </p>
                <button
                    onClick={refresh}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                >
                    Làm mới
                </button>
            </div>
        );

    /* -------------------- UI Chính -------------------- */
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Yêu cầu đặt phòng ({requirements.length})
                </h2>
                <button
                    onClick={refresh}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    Làm mới
                </button>
            </div>

            {/* Danh sách yêu cầu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {requirements.map((req) => (
                    <RoomRequirementCard
                        key={req.id}
                        requirement={req}
                        allCategories={categories}
                        onClick={() => setSelectedRequirement(req)} // 🧠 mở modal khi click
                        onApprove={() => approve(req.id)}
                        onReject={() => reject(req.id)}
                    />
                ))}
            </div>

            {/* 🪟 Modal chi tiết */}
            <RoomRequirementModal
                open={!!selectedRequirement}
                requirement={selectedRequirement}
                allCategories={categories}
                onClose={() => setSelectedRequirement(null)}
            />
        </div>
    );
}
