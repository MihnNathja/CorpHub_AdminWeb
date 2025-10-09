import React, { useState } from "react";
import FloatingButton from "../../global/components/FloatingButton";
import Pagination from "../../global/components/Pagination";
import { PlusIcon } from "lucide-react";
import RoomCard from "../components/RoomCard";
import RoomModal from "../components/RoomModal";
import AddRoomModal from "../components/AddRoomModal";
import { useRooms } from "../hooks/useRooms";
import RoomRequestList from "../components/RoomRequestList";

const RoomPage = () => {
    const [activeTab, setActiveTab] = useState("rooms"); // "rooms" | "requests"
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);

    const {
        loading,
        page,
        totalPages,
        setPage,
        statusFilter,
        setStatusFilter,
        statusCounts,
        paginatedRooms,
        rooms,
        selectedRoom,
        setSelectedRoom,
        handleCreateOrUpdate,
        handleRemove,
    } = useRooms();

    const statusTabs = ["ALL", "AVAILABLE", "BUSY", "MAINTENANCE"];

    // ✅ Loading
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <p className="text-gray-500 dark:text-gray-300">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner p-6 relative">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Room Management
            </h2>

            {/* 🔹 Floating Button */}
            {activeTab === "rooms" && (
                <FloatingButton
                    onClick={() => setIsAddModalOpen(true)}
                    icon={PlusIcon}
                    tooltip="New room"
                    color="blue"
                />
            )}

            {/* 🔹 Tabs chính */}
            <div className="flex gap-4 mb-6 border-b border-gray-300 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab("rooms")}
                    className={`px-4 py-2 font-medium ${activeTab === "rooms"
                        ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                        : "text-gray-500 hover:text-blue-500"
                        }`}
                >
                    Room List
                </button>

                <button
                    onClick={() => setActiveTab("requests")}
                    className={`px-4 py-2 font-medium ${activeTab === "requests"
                        ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                        : "text-gray-500 hover:text-blue-500"
                        }`}
                >
                    Room Requests
                </button>
            </div>

            {/* 🔹 Nội dung tab */}
            {activeTab === "rooms" && (
                <>
                    {/* Bộ lọc trạng thái */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {statusTabs.map((status) => {
                            const active = statusFilter === status;
                            const count =
                                status === "ALL"
                                    ? rooms.length
                                    : statusCounts?.[status] || 0;

                            return (
                                <button
                                    key={status}
                                    onClick={() => {
                                        setStatusFilter(status);
                                        setPage(0); // ✅ backend page bắt đầu từ 0
                                    }}
                                    className={`px-3 py-1 text-sm rounded-full border flex items-center gap-1 transition-colors ${active
                                        ? "bg-blue-500 text-white border-transparent"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600"
                                        }`}
                                >
                                    <span>
                                        {status === "ALL" ? "Tất cả" : status}
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full ${active
                                            ? "bg-white/30"
                                            : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
                                            }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Danh sách phòng */}
                    {paginatedRooms?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedRooms.map((room) => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    onClick={() => setSelectedRoom(room)}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
                            Không tìm thấy phòng với trạng thái {statusFilter}.
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
                </>
            )}

            {activeTab === "requests" && <RoomRequestList />}
        </div>
    );
};

export default RoomPage;
