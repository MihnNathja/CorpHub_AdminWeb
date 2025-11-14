import React, { useState } from "react";
import ShiftTable from "../components/ShiftTable";
import { Calendar, Clock } from "lucide-react";
import ScheduleTimesheet from "../components/ScheduleTimeSheet";
import { useDepartment } from "../../department/hooks/useDepartment";

const SchedulePage = () => {
    const [tab, setTab] = useState("shift");
    const { departments } = useDepartment();

    const tabs = [
        { key: "shift", label: "Ca làm", icon: <Clock className="w-4 h-4" /> },
        { key: "work", label: "Lịch làm việc", icon: <Calendar className="w-4 h-4" /> },
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner p-6 relative w-full">

            <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                Quản lý Lịch làm việc
            </h2>

            <div className="flex gap-2 mb-4 border-b border-gray-300 dark:border-gray-700">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition ${tab === t.key
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-b-2 border-blue-500"
                            : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
                            }`}
                    >
                        {t.icon}
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="">

                {/* ✅ Lớp này đảm bảo nội dung bên trong không giãn vượt container */}
                {tab === "shift" ? (
                    <ShiftTable />
                ) : (
                    <ScheduleTimesheet
                        departments={departments}
                    />
                )}

            </div>
        </div>
    );
};

export default SchedulePage;
