import React, { useState } from "react";
import RoomList from "../components/RoomList";
import { useDepartment } from "../../department/hooks/useDepartment";
import { useRoomTypes } from "../hooks/useRoomTypes";
import { RoomRequestList } from "../components/RoomRequestList";
import { Building2, ClipboardList, Settings } from "lucide-react";

const RoomPage = () => {
    const [activeTab, setActiveTab] = useState("rooms"); // "rooms" | "requests"

    const {
        departments,
    } = useDepartment();

    const {
        roomTypes,
    } = useRoomTypes();

    const tabs = [
        {
            key: "rooms",
            label: "Room List",
            description: "Manage and organize facilities",
            icon: Building2,
            count: null, // Can be updated with actual count
        },
        {
            key: "requests",
            label: "Room Requests",
            description: "Review booking requirements",
            icon: ClipboardList,
            count: null, // Can be updated with actual count
        },
    ];

    const activeTabConfig = tabs.find((t) => t.key === activeTab);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg border border-white/10">
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-white/80 uppercase tracking-wide">Facilities</p>
                        <h1 className="text-3xl font-bold">Room Management</h1>
                    </div>
                </div>
                <p className="text-sm text-white/70 ml-16">
                    Manage conference rooms, facilities, and booking requests
                </p>
            </div>

            {/* Tab Navigation Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Tab Buttons */}
                <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;

                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`
                                    flex-1 px-6 py-4 text-left transition-all duration-200 border-b-2 relative
                                    ${isActive
                                        ? "border-b-blue-600 dark:border-b-blue-400 bg-blue-50/40 dark:bg-blue-900/20"
                                        : "border-b-transparent hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                                    }
                                `}
                            >
                                <div className="flex items-start gap-3">
                                    <Icon
                                        className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors ${isActive
                                                ? "text-blue-600 dark:text-blue-400"
                                                : "text-gray-400 dark:text-gray-600"
                                            }`}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className={`font-semibold transition-colors ${isActive
                                                    ? "text-blue-600 dark:text-blue-400"
                                                    : "text-gray-700 dark:text-gray-300"
                                                }`}
                                        >
                                            {tab.label}
                                            {tab.count !== null && (
                                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${isActive
                                                        ? "bg-blue-200 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                                                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                                    }`}>
                                                    {tab.count}
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            {tab.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Active Tab Indicator Bar */}
                <div className="px-6 py-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        {activeTabConfig && (
                            <>
                                {React.createElement(activeTabConfig.icon, {
                                    className: "w-4 h-4 text-blue-600 dark:text-blue-400",
                                })}
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {activeTabConfig.label}
                                </p>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {activeTabConfig.description}
                                </span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Settings className="w-3.5 h-3.5" />
                        <span>Click to manage</span>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    <div className="space-y-4">
                        {/* Content Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {activeTabConfig?.label}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {activeTabConfig?.description}
                                </p>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="transition-all duration-300 ease-in-out">
                            {activeTab === "rooms" && (
                                <div key="rooms" className="animate-fade-in">
                                    <RoomList departments={departments} roomTypes={roomTypes} />
                                </div>
                            )}
                            {activeTab === "requests" && (
                                <div key="requests" className="animate-fade-in">
                                    <RoomRequestList />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomPage;
