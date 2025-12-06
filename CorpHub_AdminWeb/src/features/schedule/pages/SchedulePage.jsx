import React, { useState } from "react";
import ShiftTypeTable from "../components/ShiftTypeTable";
import { Calendar, Clock, Settings } from "lucide-react";
import ScheduleTimesheet from "../components/ScheduleTimeSheet";
import { useDepartment } from "../../department/hooks/useDepartment";

const SchedulePage = () => {
    const [tab, setTab] = useState("shift");
    const { departments } = useDepartment();

    const tabs = [
        {
            key: "shift",
            label: "Shift Types",
            description: "Manage work shifts and timings",
            icon: Clock,
        },
        {
            key: "work",
            label: "Work Schedule",
            description: "View and manage employee schedules",
            icon: Calendar,
        },
    ];

    const activeTab = tabs.find((t) => t.key === tab);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg border border-white/10">
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm">
                        <Settings className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-white/80 uppercase tracking-wide">Management</p>
                        <h1 className="text-3xl font-bold">Schedule Management</h1>
                    </div>
                </div>
                <p className="text-sm text-white/70 ml-16">
                    Organize shifts and work schedules for your organization
                </p>
            </div>

            {/* Tab Navigation Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
                    {tabs.map((t) => {
                        const Icon = t.icon;
                        const isActive = tab === t.key;

                        return (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`
                                    flex-1 px-6 py-4 text-left transition-all duration-200 border-b-2
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
                                    <div className="min-w-0">
                                        <p
                                            className={`font-semibold transition-colors ${isActive
                                                ? "text-blue-600 dark:text-blue-400"
                                                : "text-gray-700 dark:text-gray-300"
                                                }`}
                                        >
                                            {t.label}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            {t.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Active Tab Info Bar */}
                <div className="px-6 py-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {activeTab && (
                            <>
                                {React.createElement(activeTab.icon, {
                                    className: "w-4 h-4 text-blue-600 dark:text-blue-400",
                                })}
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {activeTab.label}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {tab === "shift" ? (
                        <ShiftTypeTable />
                    ) : (
                        <ScheduleTimesheet departments={departments} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SchedulePage;
