import React, { useState } from "react";
import { useRoomRequirements } from "../hooks/useRoomRequirement";
import RoomRequirementCard from "../components/RoomRequirementCard";
import RoomRequirementModal from "../components/RoomRequirementModal";
import { useAssets } from "../../asset/hooks/useAssets";
import Pagination from "../../global/components/Pagination";
import { Sparkles, CalendarCheck, AlertCircle } from "lucide-react";

export const RoomRequestList = () => {
    const { requirements, meta, page, status, setStatus, totalPages, setPage, approve, reject, suggest, clearSuggestion, selected, setSelected, allocationSuggestion, suitableRooms, loadingSuitable } = useRoomRequirements();
    const { categories = [] } = useAssets();

    const statusOptions = [
        { value: null, label: "All Status" },
        { value: "PENDING", label: "Pending" },
        { value: "ACCEPTED", label: "Accepted" },
        { value: "REJECTED", label: "Rejected" },
        { value: "CLOSED", label: "Closed" },
    ];

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
                            <p className="text-sm text-white/80">Room booking requests</p>
                            <h2 className="text-xl font-semibold">0 requests</h2>
                        </div>
                    </div>
                </div>

                {/* Status filter */}
                <div className="flex justify-end gap-3 mb-5">
                    <select
                        value={status || ""}
                        onChange={(e) => setStatus(e.target.value || null)}
                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm font-medium rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value || "all"} value={option.value || ""}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-10 bg-gray-50 dark:bg-gray-800">
                    <AlertCircle className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        No room booking requests yet
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        New requests will appear here.
                    </p>
                </div>
            </div>
        );

    /* -------------------- Main UI -------------------- */
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
                            <p className="text-sm text-white/80">Room booking requests</p>
                            <h2 className="text-xl font-semibold">
                                {meta.totalElements} requests
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status filter and Suggest button */}
            <div className="flex justify-end gap-3">
                <select
                    value={status || ""}
                    onChange={(e) => setStatus(e.target.value || null)}
                    className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm font-medium rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                >
                    {statusOptions.map((option) => (
                        <option key={option.value || "all"} value={option.value || ""}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {(
                    <button
                        onClick={() =>
                            suggest(requirements
                                .filter(r => !r.roomId)
                                .map(r => r.id))
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
                    >
                        <Sparkles className="w-4 h-4" />
                        Suggest room allocation
                    </button>
                )}
            </div>

            {/* Request list */}
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
            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                />
            )}
            {selected && (
                <RoomRequirementModal
                    requirement={selected}
                    allCategories={categories}
                    suitableRooms={suitableRooms}
                    loadingSuitable={loadingSuitable}
                    onApprove={approve}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
}
