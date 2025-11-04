import React, { useState } from "react";
import RoomList from "../components/RoomList";
import { useDepartment } from "../../department/hooks/useDepartment";
import { useRoomTypes } from "../hooks/useRoomTypes";
import { RoomRequestList } from "../components/RoomRequestList";

const RoomPage = () => {
    const [activeTab, setActiveTab] = useState("rooms"); // "rooms" | "requests"

    const {
        departments,
    } = useDepartment();

    const {
        roomTypes,
    } = useRoomTypes();

    return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner p-6 relative">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Room Management
            </h2>

            {/* Tabs chính */}
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

            {/* Nội dung tab */}
            {activeTab === "rooms" && <RoomList departments={departments} roomTypes={roomTypes} />}
            {activeTab === "requests" && <RoomRequestList />}
        </div>
    );
};

export default RoomPage;
