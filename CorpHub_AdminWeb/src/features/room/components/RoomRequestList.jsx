import React, { useState } from "react";
import { useRoomRequirements } from "../hooks/useRoomRequirement";
import RoomRequirementCard from "../components/RoomRequirementCard";
import RoomRequirementModal from "../components/RoomRequirementModal";
import { useAssets } from "../../asset/hooks/useAssets";
import { Sparkles, CalendarCheck, AlertCircle } from "lucide-react";

export const RoomRequestList = () => {
    const { requirements, page, size, approve, reject, suggest, clearSuggestion, selected, setSelected, allocationSuggestion } = useRoomRequirements();
    const { categories = [] } = useAssets();

    const pendingCount = requirements?.filter(r => !r.roomId).length || 0;

    /* -------------------- UI Empty -------------------- */
    if (!requirements || requirements.length === 0)
        return (
            <div className="animate-fade-in">
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-5 shadow-lg border border-white/10 mb-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/15">
                            <CalendarCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-white/80">Yêu cầu đặt phòng</p>
                            <h2 className="text-xl font-semibold">0 yêu cầu</h2>
                        </div>
                    </div>
                </div>

                <div className="text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-10 bg-gray-50 dark:bg-gray-800">
                    <AlertCircle className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Hiện chưa có yêu cầu đặt phòng nào
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Các yêu cầu mới sẽ hiển thị ở đây.
                    </p>
                </div>
            </div>
        );

    /* -------------------- UI Chính -------------------- */
    return (
        <div className="animate-fade-in space-y-5">
            {/* Header summary */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-5 shadow-lg border border-white/10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/15">
                            <CalendarCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-white/80">Yêu cầu đặt phòng</p>
                            <h2 className="text-xl font-semibold">
                                {requirements.length} yêu cầu
                            </h2>
                        </div>
                    </div>
                    <div className="flex gap-3 text-sm">
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            <span>{pendingCount} chờ phân bổ</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span>{requirements.length - pendingCount} đã gán</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Suggest button */}
            {pendingCount > 0 && (
                <div className="flex justify-end">
                    <button
                        onClick={() =>
                            suggest(requirements
                                .filter(r => !r.roomId)
                                .map(r => r.id))
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
                    >
                        <Sparkles className="w-4 h-4" />
                        Gợi ý phân bổ phòng
                    </button>
                </div>
            )}

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
