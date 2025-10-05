import React from "react";

export default function MeetingRoomRequirementSection({
    assetCates = [],
    selectedAssetCates = [],
    onToggle,
    capacity,
    disabled,
    onCapacityChange,
    bookingTime,
    onBookingTimeChange,
}) {
    console.log(assetCates);
    console.log(selectedAssetCates);
    return (
        <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700 space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Yêu cầu phòng họp
            </h4>

            {/* Chọn sức chứa */}
            <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">
                    Sức chứa mong muốn
                </label>
                <input
                    type="number"
                    min="1"
                    disabled={disabled}
                    value={capacity}
                    onChange={(e) => onCapacityChange(Number(e.target.value))}
                    className="w-32 rounded-md border border-gray-300 dark:border-gray-600 p-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                    placeholder="VD: 20"
                />
            </div>

            {/* Chọn thời gian mượn phòng */}
            <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">
                    Thời gian mượn phòng
                </label>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <span className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Bắt đầu</span>
                        <input
                            type="datetime-local"
                            value={bookingTime.start}
                            onChange={(e) =>
                                onBookingTimeChange({ ...bookingTime, start: e.target.value })
                            }
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                        />
                    </div>
                    <div className="flex-1">
                        <span className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Kết thúc</span>
                        <input
                            type="datetime-local"
                            value={bookingTime.end}
                            onChange={(e) =>
                                onBookingTimeChange({ ...bookingTime, end: e.target.value })
                            }
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                        />
                    </div>
                </div>
            </div>

            {/* Các loại tài sản */}
            <div>
                <span className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">
                    Chọn tài sản kèm theo
                </span>
                <div className="grid grid-cols-2 gap-2">
                    {assetCates.map((assetCate) => (
                        <label
                            key={assetCate.id}
                            className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-100"
                        >
                            <input
                                type="checkbox"
                                disabled={disabled}
                                checked={selectedAssetCates.includes(assetCate.id)}
                                onChange={() => onToggle(assetCate)}
                                className="accent-blue-500"
                            />
                            {assetCate.name}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
