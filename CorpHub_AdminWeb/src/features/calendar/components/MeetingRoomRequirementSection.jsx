import React from "react";
import { Users, Clock, Package } from "lucide-react";

export default function MeetingRoomRequirementSection({
    assetCates = [],
    errors,
    selectedAssetCates = [],
    onToggle,
    capacity,
    disabled,
    onCapacityChange,
    bookingTime,
    onBookingTimeChange,
}) {
    return (
        <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/15 dark:to-indigo-900/15 border border-blue-200 dark:border-blue-800/50">
            {/* Section Header */}
            <div className="flex items-center gap-2.5 pb-3 border-b border-blue-200 dark:border-blue-800/50">
                <div className="p-2 rounded-lg bg-blue-600 text-white">
                    <Package className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">
                    Meeting Room Requirements
                </h4>
            </div>

            {/* Content Grid */}
            <div className="space-y-4">
                {/* Capacity Field */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                        <Users className="w-4 h-4 text-blue-600" />
                        Desired Capacity
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            min="1"
                            disabled={disabled}
                            value={capacity}
                            onChange={(e) => onCapacityChange(Number(e.target.value))}
                            placeholder="E.g., 20"
                            className="w-32 px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium"
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-400">people</span>
                    </div>
                    {errors["roomRequirement.capacity"] && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <span>⚠</span> {errors["roomRequirement.capacity"]}
                        </p>
                    )}
                </div>

                {/* Booking Time Fields */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                        <Clock className="w-4 h-4 text-blue-600" />
                        Room Booking Time
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Start Time */}
                        <div className="space-y-1">
                            <span className="block text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                Start
                            </span>
                            <input
                                type="datetime-local"
                                value={bookingTime.start}
                                onChange={(e) =>
                                    onBookingTimeChange({ ...bookingTime, start: e.target.value })
                                }
                                disabled={disabled}
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                            {errors["roomRequirement.start"] && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <span>⚠</span> {errors["roomRequirement.start"]}
                                </p>
                            )}
                        </div>

                        {/* End Time */}
                        <div className="space-y-1">
                            <span className="block text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                End
                            </span>
                            <input
                                type="datetime-local"
                                value={bookingTime.end}
                                onChange={(e) =>
                                    onBookingTimeChange({ ...bookingTime, end: e.target.value })
                                }
                                disabled={disabled}
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                            {errors["roomRequirement.end"] && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <span>⚠</span> {errors["roomRequirement.end"]}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Assets Selection */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                        <Package className="w-4 h-4 text-blue-600" />
                        Required Assets
                    </label>

                    {assetCates.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {assetCates.map((assetCate) => (
                                <label
                                    key={assetCate.id}
                                    className={`
                                        relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg border-2 cursor-pointer
                                        transition-all duration-200
                                        ${selectedAssetCates.includes(assetCate.id)
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                                        }
                                        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                                    `}
                                >
                                    <input
                                        type="checkbox"
                                        disabled={disabled}
                                        checked={selectedAssetCates.includes(assetCate.id)}
                                        onChange={() => onToggle(assetCate)}
                                        className="w-4 h-4 rounded cursor-pointer accent-blue-600 dark:accent-blue-400"
                                    />
                                    <span className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {assetCate.name}
                                    </span>
                                    {selectedAssetCates.includes(assetCate.id) && (
                                        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                                    )}
                                </label>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic py-2">
                            No assets available
                        </p>
                    )}

                    {errors["roomRequirement.assetCategories"] && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <span>⚠</span> {errors["roomRequirement.assetCategories"]}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
