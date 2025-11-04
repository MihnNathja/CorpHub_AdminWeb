import React, { use, useState } from "react";
import { PlusIcon, Search, Filter } from "lucide-react";
import FloatingButton from "../../global/components/FloatingButton";
import Pagination from "../../global/components/Pagination";
import RoomCard from "./RoomCard";
import RoomModal from "./RoomModal";
import AddRoomModal from "./AddRoomModal";
import { useRooms } from "../hooks/useRooms";
import { useAssets } from "../../asset/hooks/useAssets";

const RoomList = ({ departments, roomTypes }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);

    const {
        rooms,
        page,
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

    const handleFilterChange = (name, value) => {
        updateFilters({ [name]: value });
    };

    return (
        <div className="relative">
            {/* Floating button thêm phòng */}
            <FloatingButton
                onClick={() => setIsAddModalOpen(true)}
                icon={PlusIcon}
                tooltip="New room"
                color="blue"
            />

            {/* 🔹 Thanh tìm kiếm + Bộ lọc */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Search bar */}
                    <div className="relative w-full sm:w-1/3">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="Search room name..."
                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    {/* Bộ lọc dropdown */}
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end w-full sm:w-auto">
                        {/* Type */}
                        <select
                            name="typeId"
                            value={filters.type}
                            onChange={(e) => handleFilterChange("typeId", e.target.value)}
                            className="w-full sm:w-auto max-w-[180px] h-[40px] px-3 py-2 text-sm rounded-lg border 
               border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white 
               focus:ring-2 focus:ring-blue-400 focus:outline-none truncate"
                        >
                            <option value="">All types</option>
                            {roomTypes.map((type) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>

                        {/* Department */}
                        <select
                            name="departmentId"
                            value={filters.departmentId}
                            onChange={(e) => handleFilterChange("departmentId", e.target.value)}
                            className="w-full sm:w-auto max-w-[200px] h-[40px] px-3 py-2 text-sm rounded-lg border 
               border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white 
               focus:ring-2 focus:ring-blue-400 focus:outline-none truncate"
                        >
                            <option value="">All departments</option>
                            {departments.map((department) => (
                                <option key={department.departmentId} value={department.departmentId}>
                                    {department.departmentName}
                                </option>
                            ))}
                        </select>

                        {/* Capacity */}
                        <input
                            type="number"
                            name="minCapacity"
                            value={filters.minCapacity}
                            onChange={(e) => handleFilterChange("minCapacity", e.target.value)}
                            placeholder="Min capacity"
                            className="w-full sm:w-auto max-w-[100px] h-[40px] px-3 py-2 text-sm rounded-lg border 
               border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white 
               focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />

                        {/* Area */}
                        <input
                            type="number"
                            step="0.1"
                            name="minArea"
                            value={filters.minArea}
                            onChange={(e) => handleFilterChange("minArea", e.target.value)}
                            placeholder="Min area (m²)"
                            className="w-full sm:w-auto max-w-[100px] h-[40px] px-3 py-2 text-sm rounded-lg border 
               border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white 
               focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />

                        {/* Status */}
                        <select
                            name="status"
                            value={filters.status}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                            className="w-full sm:w-auto max-w-[160px] h-[40px] px-3 py-2 text-sm rounded-lg border 
               border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white 
               focus:ring-2 focus:ring-blue-400 focus:outline-none truncate"
                        >
                            <option value="">All status</option>
                            <option value="AVAILABLE">Available</option>
                            <option value="BUSY">Busy</option>
                            <option value="MAINTENANCE">Maintenance</option>
                        </select>

                        {/* Clear */}
                        <button
                            onClick={clearFilters}
                            className="w-full sm:w-auto max-w-[110px] h-[40px] flex items-center justify-center gap-1 
               text-sm rounded-lg border border-gray-300 dark:border-gray-600 
               text-gray-700 dark:text-gray-300 
               hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            <Filter className="w-4 h-4" />
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* Danh sách phòng */}
            {rooms?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <RoomCard key={room.id} room={room} onClick={() => setSelectedRoom(room)} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
                    Không tìm thấy phòng phù hợp.
                </p>
            )}

            {/* Phân trang */}
            <Pagination page={page} setPage={setPage} totalPages={totalPages} />

            {/* Modal Chi tiết */}
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

            {/* Modal Thêm/Sửa */}
            <AddRoomModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingRoom(null);
                }}
                room={editingRoom}
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
