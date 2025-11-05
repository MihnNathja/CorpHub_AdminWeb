import React, { useState } from "react";
import { useRoomRequirements } from "../hooks/useRoomRequirement";
import RoomRequirementCard from "../components/RoomRequirementCard";
import RoomRequirementModal from "../components/RoomRequirementModal"; // 🧩 Thêm modal
import { useAssets } from "../../asset/hooks/useAssets";

export const RoomRequestList = () => {
    const { requirements, page, size, approve, reject, suggest, clearSuggestion, selected, setSelected, allocationSuggestion } = useRoomRequirements();
    const { categories = [] } = useAssets();

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
            </div>
        );

    /* -------------------- UI Chính -------------------- */
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Yêu cầu đặt phòng ({requirements.length})
                </h2>
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() =>
                            suggest(requirements
                                .filter(r => !r.roomId)
                                .map(r => r.id))
                        }

                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
                    >
                        Gợi ý phân bố phòng
                    </button>
                </div>

            </div>

            {/* Danh sách yêu cầu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {requirements.map((req) => {
                    const suggestion = allocationSuggestion?.find(
                        (s) => s.requirementId === req.id
                    );

                    return (
                        <RoomRequirementCard
                            key={req.id}
                            requirement={req}
                            allCategories={categories}
                            suggestion={suggestion}
                            onApprove={approve}
                            clearSuggestion={clearSuggestion}
                            onClick={() => setSelected(req)}
                        />
                    );
                })}

            </div>

            {selected && (
                <RoomRequirementModal
                    requirement={selected}
                    allCategories={categories}
                    onApprove={approve}
                    onClose={() => setSelected(null)}
                />
            )}

        </div>
    );
}
