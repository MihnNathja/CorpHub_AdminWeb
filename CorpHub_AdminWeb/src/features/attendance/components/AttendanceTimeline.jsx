import {
    ClockIcon,
    ArrowDownCircleIcon,
    ArrowUpCircleIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const ICONS = {
    shift_start: ClockIcon,
    checkin: ArrowDownCircleIcon,
    checkout: ArrowUpCircleIcon,
    shift_end: ClockIcon,
};

const toMinutes = (t) => {
    if (!t || t === "--:--") return Infinity;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
};

export default function AttendanceTimeline({ events = [] }) {
    const [currentIndex, setCurrentIndex] = useState(-1);

    // 🔥 Auto xác định mốc hiện tại
    useEffect(() => {
        if (!events || events.length === 0) {
            setCurrentIndex(-1);
            return;
        }

        // 1. Nếu đã có CHECKOUT → mốc là CHECKOUT
        const checkoutIdx = events.findIndex(
            (e) => e.type === "checkout" && e.time && e.time !== "--:--"
        );
        if (checkoutIdx !== -1) {
            setCurrentIndex(checkoutIdx);
            return;
        }

        // 2. Nếu chưa checkout mà đã checkin → mốc là CHECKIN
        const checkinIdx = events.findIndex(
            (e) => e.type === "checkin" && e.time && e.time !== "--:--"
        );
        if (checkinIdx !== -1) {
            setCurrentIndex(checkinIdx);
            return;
        }

        // 3. Nếu chưa có cả 2, dùng thời gian hiện tại để suy ra đã qua mốc nào
        const nowHM = new Date().toTimeString().substring(0, 5);
        const nowMin = toMinutes(nowHM);

        let idxByTime = -1;
        events.forEach((e, idx) => {
            if (!e.time || e.time === "--:--") return;
            if (toMinutes(e.time) <= nowMin) {
                idxByTime = idx;
            }
        });

        setCurrentIndex(idxByTime);
    }, [events]);

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-6 tracking-tight">Timeline</h2>

            <div className="grid grid-cols-[40px_1fr] gap-4">

                {/* LEFT SIDE: line + icons */}
                <div className="relative flex flex-col items-center py-2">
                    {events.map((e, idx) => {
                        const Icon = ICONS[e.type] || ClockIcon;

                        return (
                            <div key={idx} className="flex flex-col items-center">

                                {/* DOT ICON */}
                                <div className="relative z-20 w-8 h-8 flex items-center justify-center">
                                    <Icon
                                        className={`w-5 h-5 
                                            ${idx <= currentIndex
                                                ? "text-blue-500 dark:text-purple-400"
                                                : "text-gray-500 dark:text-gray-400"
                                            }
                                        `}
                                    />
                                </div>

                                {/* LINE SEGMENT */}
                                {idx < events.length - 1 && (
                                    <div
                                        className={`w-[2px] h-12 
                                            ${idx < currentIndex
                                                ? "bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500"
                                                : "bg-gray-300 dark:bg-gray-600"
                                            }
                                        `}
                                    ></div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* RIGHT SIDE: content */}
                <div className="space-y-8">
                    {events.map((e, idx) => (
                        <div key={idx}>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{e.label}</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {e.time || "--"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
