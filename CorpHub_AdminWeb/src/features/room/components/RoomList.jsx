import React, { useState } from "react";
import { PlusIcon, Search, Filter, Sparkles, Building2, Users, Square } from "lucide-react";
import FloatingButton from "../../global/components/FloatingButton";
import Pagination from "../../global/components/Pagination";
import RoomCard from "./RoomCard";
import RoomModal from "./RoomModal";
import AddRoomModal from "./AddRoomModal";
import { useRooms } from "../hooks/useRooms";
import { useAssets } from "../../asset/hooks/useAssets";

const statusQuick = [
    { value: "", label: "All" },
    { value: "AVAILABLE", label: "Available" },
    { value: "RESERVED", label: "In use" },
    { value: "MAINTENANCE", label: "Maintenance" },
];

const RoomList = ({ departments, roomTypes }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);

    const {
        rooms,
        page,
        meta,
        totalPages,
        setPage,
        keywords,
        setKeywords,
        filters,
        updateFilters,
        clearFilters,
        selectedRoom,
        setSelectedRoom,
        handleCreateOrUpdate,
        handleRemove,
        handleAssignAssets,
        handleRemoveAssetFromRoom,
    } = useRooms();

    const handleFilterChange = (name, value) => updateFilters({ [name]: value });

    const activeFilters = [
        filters.typeId && roomTypes.find((t) => t.id === filters.typeId)?.name,
        filters.departmentId && departments.find((d) => d.id === filters.departmentId)?.name,
        filters.minCapacity && `≥ ${filters.minCapacity} people`,
        filters.minArea && `≥ ${filters.minArea} m²`,
        filters.status && statusQuick.find((s) => s.value === filters.status)?.label,
    ].filter(Boolean);

    return (
        <div className="relative space-y-4">
            <FloatingButton
                onClick={() => setIsAddModalOpen(true)}
                icon={PlusIcon}
                tooltip="Add new room"
                color="blue"
            />

            {/* Header summary */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-5 shadow-lg border border-white/10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/15">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-white/80">Room management</p>
                            <h2 className="text-xl font-semibold">
                                {meta?.totalElements ?? 0} rooms found
                            </h2>
                        </div>
                    </div>
                    <div className="flex gap-3 text-sm">
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
                            <Building2 className="w-4 h-4" />
                            <span>{roomTypes.length} room types</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
                            <Users className="w-4 h-4" />
                            <span>{departments.length} departments</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
                            <Square className="w-4 h-4" />
                            <span>Classification & area</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search + Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:w-1/3">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="Search room by name..."
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:justify-end w-full sm:w-auto">
                        <select
                            name="typeId"
                            value={filters.typeId}
                            onChange={(e) => handleFilterChange("typeId", e.target.value)}
                            className="w-full sm:w-auto max-w-[180px] h-[40px] px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none truncate"
                        >
                            <option value="">All room types</option>
                            {roomTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>

                        <select
                            name="departmentId"
                            value={filters.departmentId}
                            onChange={(e) => handleFilterChange("departmentId", e.target.value)}
                            className="w-full sm:w-auto max-w-[200px] h-[40px] px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none truncate"
                        >
                            <option value="">All departments</option>
                            {departments.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            name="minCapacity"
                            value={filters.minCapacity}
                            onChange={(e) => handleFilterChange("minCapacity", e.target.value)}
                            placeholder="Min capacity"
                            className="w-full sm:w-auto max-w-[140px] h-[40px] px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />

                        <input
                            type="number"
                            step="0.1"
                            name="minArea"
                            value={filters.minArea}
                            onChange={(e) => handleFilterChange("minArea", e.target.value)}
                            placeholder="Min area (m²)"
                            className="w-full sm:w-auto max-w-[160px] h-[40px] px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />

                        <select
                            name="status"
                            value={filters.status}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                            className="w-full sm:w-auto max-w-[160px] h-[40px] px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none truncate"
                        >
                            <option value="">Status</option>
                            {statusQuick
                                .filter((s) => s.value !== "")
                                .map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                        </select>

                        <button
                            onClick={clearFilters}
                            className="w-full sm:w-auto max-w-[120px] h-[40px] flex items-center justify-center gap-1 text-sm rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            <Filter className="w-4 h-4" />
                            Clear filters
                        </button>
                    </div>
                </div>

                {/* Quick status chips */}
                <div className="flex flex-wrap gap-2">
                    {statusQuick.map((s) => {
                        const active = filters.status === s.value || (!filters.status && s.value === "");
                        return (
                            <button
                                key={s.value}
                                onClick={() => handleFilterChange("status", s.value)}
                                className={`px-3 py-1 text-xs font-medium rounded-full border transition ${active
                                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                    : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    }`}
                            >
                                {s.label}
                            </button>
                        );
                    })}
                </div>

                {/* Active filters */}
                {activeFilters.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <span className="font-semibold">Filtering:</span>
                        {activeFilters.map((f, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-800"
                            >
                                {f}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* List */}
            {rooms?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <RoomCard key={room.id} room={room} onClick={() => setSelectedRoom(room)} />
                    ))}
                </div>
            ) : (
                <div className="text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-10 bg-gray-50 dark:bg-gray-800">
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        No suitable rooms found
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Please adjust the filters or add a new room.
                    </p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add room
                    </button>
                </div>
            )}

            <Pagination page={page} setPage={setPage} totalPages={totalPages} />

            <RoomModal
                room={selectedRoom}
                onClose={() => setSelectedRoom(null)}
                onEdit={(room) => {
                    setEditingRoom(room);
                    setIsAddModalOpen(true);
                    setSelectedRoom(null);
                }}
                onRemove={async (roomId) => {
                    await handleRemove(roomId);
                    setSelectedRoom(null);
                }}
                onAssignAssets={handleAssignAssets}
                onRemoveAssetFromRoom={handleRemoveAssetFromRoom}
            />

            <AddRoomModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingRoom(null);
                }}
                room={editingRoom}
                departments={departments}
                roomTypes={roomTypes}
                onSubmit={async (formData) => {
                    await handleCreateOrUpdate(
                        editingRoom ? { ...formData, id: editingRoom.id } : formData
                    );
                    setIsAddModalOpen(false);
                    setEditingRoom(null);
                }}
            />
        </div>
    );
};

export default RoomList;
