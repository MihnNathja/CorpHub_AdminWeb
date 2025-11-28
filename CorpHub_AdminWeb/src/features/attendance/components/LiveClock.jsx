import React, { useEffect, useState } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";

const hhmm = (t) => t?.substring(0, 5);

export default function LiveClock({
    shiftStartTime,
    shiftEndTime,
    checkInTime,
    checkOutTime
}) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const now = time.toLocaleTimeString("vi-VN", { hour12: false }).substring(0, 5);

    const nowNum = +now.replace(":", "");
    const startNum = shiftStartTime ? +shiftStartTime.replace(":", "") : null;
    const endNum = shiftEndTime ? +shiftEndTime.replace(":", "") : null;

    // --- LOGIC TRẠNG THÁI ---
    let state = "before"; // before shift
    if (checkOutTime) state = "checked_out";
    else if (checkInTime) state = "checked_in";
    else if (startNum && nowNum >= startNum) state = "need_checkin";

    // Late?
    const isLate = !checkInTime && startNum && nowNum > startNum;

    const visual = {
        before: {
            bg: "bg-blue-100 dark:bg-blue-900/40",
            text: "text-blue-600 dark:text-blue-300",
            label: "Chưa đến giờ làm"
        },
        need_checkin: {
            bg: isLate
                ? "bg-red-100 dark:bg-red-900/40"
                : "bg-yellow-100 dark:bg-yellow-900/40",
            text: isLate
                ? "text-red-600 dark:text-red-400"
                : "text-yellow-600 dark:text-yellow-400",
            label: isLate ? "Đang trễ! Chưa check-in" : "Đã đến giờ làm"
        },
        checked_in: {
            bg: "bg-green-100 dark:bg-green-900/40",
            text: "text-green-600 dark:text-green-400",
            label: "Đã check-in"
        },
        checked_out: {
            bg: "bg-gray-200 dark:bg-gray-700/50",
            text: "text-gray-500 dark:text-gray-300",
            label: "Đã check-out"
        }
    }[state];

    return (
        <div
            className="
                relative overflow-hidden p-5 rounded-2xl shadow-md
                bg-white/80 dark:bg-gray-800/70
                border border-gray-200 dark:border-gray-700
                transition-all duration-300
            "
        >
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 
                bg-gradient-to-r from-blue-400 to-purple-400 opacity-60"></div>

            <div className="flex items-center justify-between">

                {/* LEFT: Clock */}
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${visual.bg}`}>
                        <ClockIcon className={`w-7 h-7 ${visual.text}`} />
                    </div>

                    <div>
                        <p className="text-sm opacity-70 font-medium">{visual.label}</p>

                        <p className={`text-3xl font-bold tracking-tight ${visual.text}`}>
                            {time.toLocaleTimeString("vi-VN")}
                        </p>
                    </div>
                </div>

                {/* RIGHT: Shift info */}
                <div className="text-right">
                    <p className="text-sm opacity-70 font-medium">Giờ vào</p>
                    <p className="text-xl font-semibold tracking-tight">
                        {shiftStartTime || "--:--"}
                    </p>

                    <p className="text-sm opacity-70 font-medium mt-1">Giờ ra</p>
                    <p className="text-lg font-semibold tracking-tight">
                        {shiftEndTime || "--:--"}
                    </p>
                </div>

            </div>
        </div>
    );
}
