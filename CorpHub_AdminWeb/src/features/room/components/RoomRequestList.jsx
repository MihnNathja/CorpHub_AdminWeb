import React from "react";
import { useRoomRequirement } from "../hooks/useRoomRequirement";
import RoomRequirementCard from "../components/RoomRequirementCard";
import { useAssets } from "../../asset/hooks/useAssets";

export default function RoomRequestList() {
    const {
        requirements,
        loading,
        approve,
        reject,
        refresh,
    } = useRoomRequirement(true);

    const { categories } = useAssets();

    if (loading)
        return <p className="text-center text-gray-500">Đang tải yêu cầu đặt phòng...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Yêu cầu đặt phòng ({requirements.length})
                </h2>
                <button
                    onClick={refresh}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                >
                    Làm mới
                </button>
            </div>

            {requirements.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">
                    Không có yêu cầu đặt phòng nào.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requirements.map((r) => (
                        <RoomRequirementCard
                            key={r.id}
                            requirement={r}
                            allCategories={categories}
                            onApprove={() => approve(r.id)}
                            onReject={() => reject(r.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
