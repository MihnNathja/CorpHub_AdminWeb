import React, { useEffect, useState } from "react";
import { Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";

// ✅ Helper: convert "HH:mm" -> total minutes
const toMinutes = (t) => {
    if (!t) return null;
    const [h, m] = t.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
};

export default function LiveClock({
    shiftStartTime,
    shiftEndTime,
    checkInTime,
    checkOutTime,
    shiftStatus,
    suggestedShift,
}) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // ✅ Current time in minutes
    const nowMinutes = time.getHours() * 60 + time.getMinutes();
    const startMinutes = toMinutes(shiftStartTime);
    const endMinutes = toMinutes(shiftEndTime);

    // --- LOGIC TRẠNG THÁI ---
    let state = "before"; // before shift
    if (checkOutTime) state = "checked_out";
    else if (checkInTime) state = "checked_in";
    else if (startMinutes != null && nowMinutes >= startMinutes)
        state = "need_checkin";

    // ✅ Late logic (phút)
    const isLate =
        !checkInTime && startMinutes != null && nowMinutes > startMinutes;
    const lateMinutes = isLate ? nowMinutes - startMinutes : 0;

    const stateConfig = {
        before: {
            gradient: "from-blue-500 to-cyan-500",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            border: "border-blue-200 dark:border-blue-800",
            text: "text-blue-700 dark:text-blue-300",
            badge:
                "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
            icon: Clock,
            label: "Chưa đến giờ làm",
            subtitle: "Đợi giờ bắt đầu ca làm",
        },
        need_checkin: {
            gradient: isLate
                ? "from-red-500 to-orange-500"
                : "from-amber-500 to-orange-500",
            bg: isLate
                ? "bg-red-50 dark:bg-red-900/20"
                : "bg-amber-50 dark:bg-amber-900/20",
            border: isLate
                ? "border-red-200 dark:border-red-800"
                : "border-amber-200 dark:border-amber-800",
            text: isLate
                ? "text-red-700 dark:text-red-300"
                : "text-amber-700 dark:text-amber-300",
            badge: isLate
                ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
            icon: isLate ? AlertCircle : Clock,
            label: isLate ? "⚠️ Đang trễ!" : "✓ Đã đến giờ",
            subtitle: isLate
                ? "Bạn đã trễ, hãy check-in ngay"
                : "Hãy check-in để bắt đầu ca",
        },
        checked_in: {
            gradient: "from-emerald-500 to-teal-500",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            border: "border-emerald-200 dark:border-emerald-800",
            text: "text-emerald-700 dark:text-emerald-300",
            badge:
                "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
            icon: CheckCircle2,
            label: "✓ Đã check-in",
            subtitle: "Bạn đang trong ca làm",
        },
        checked_out: {
            gradient: "from-gray-400 to-slate-500",
            bg: "bg-gray-50 dark:bg-gray-900/20",
            border: "border-gray-200 dark:border-gray-800",
            text: "text-gray-700 dark:text-gray-300",
            badge:
                "bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800",
            icon: XCircle,
            label: "✓ Đã check-out",
            subtitle: "Ca làm đã kết thúc",
        },
    }[state];

    const StateIcon = stateConfig.icon;

    // ✅ Time Remaining chuẩn theo phút
    let timeRemaining = null;
    if (endMinutes != null && nowMinutes < endMinutes) {
        const diff = endMinutes - nowMinutes;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        timeRemaining = `${h}h ${m}m`;
    }

    return (
        <div className="w-full space-y-4">
            {/* Main Clock Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`
          relative overflow-hidden rounded-2xl shadow-lg border-2
          ${stateConfig.bg} ${stateConfig.border}
        `}
            >
                <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stateConfig.gradient}`}
                />

                <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                                animate={
                                    state === "need_checkin" ? { scale: [1, 1.05, 1] } : {}
                                }
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <StateIcon className={`w-6 h-6 ${stateConfig.text}`} />
                            </motion.div>
                            <div>
                                <p
                                    className={`text-xs font-semibold uppercase tracking-wider ${stateConfig.text} opacity-75`}
                                >
                                    Trạng thái
                                </p>
                                <p className={`text-lg font-bold ${stateConfig.text}`}>
                                    {stateConfig.label}
                                </p>
                            </div>
                        </div>

                        <div
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${stateConfig.badge}`}
                        >
                            {state === "checked_in"
                                ? "Đang làm việc"
                                : state === "checked_out"
                                    ? "Kết thúc"
                                    : "Chờ"}
                        </div>
                    </div>

                    <p className={`text-sm ${stateConfig.text} opacity-75`}>
                        {stateConfig.subtitle}
                    </p>

                    {/* Clock */}
                    <div className="flex items-end gap-2">
                        <motion.div
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`text-5xl font-black tracking-tighter ${stateConfig.text}`}
                        >
                            {time
                                .toLocaleTimeString("vi-VN", { hour12: false })
                                .substring(0, 5)}
                        </motion.div>
                        <p className={`text-xl font-semibold ${stateConfig.text} opacity-60 mb-1`}>
                            {time
                                .toLocaleTimeString("vi-VN", { hour12: false })
                                .substring(6, 8)}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Shift Info */}
            <div className="grid grid-cols-2 gap-3">
                <div className={`p-4 rounded-xl border-2 text-center ${stateConfig.bg} ${stateConfig.border}`}>
                    <p className={`text-xs font-semibold ${stateConfig.text} opacity-75`}>
                        Giờ vào
                    </p>
                    <p className={`text-2xl font-bold ${stateConfig.text}`}>
                        {shiftStartTime || "--:--"}
                    </p>
                    {checkInTime && (
                        <p className="text-xs text-emerald-600 font-semibold mt-1">
                            ✓ {dayjs(checkInTime).format("HH:mm")}
                        </p>
                    )}
                </div>

                <div className={`p-4 rounded-xl border-2 text-center ${stateConfig.bg} ${stateConfig.border}`}>
                    <p className={`text-xs font-semibold ${stateConfig.text} opacity-75`}>
                        Giờ ra
                    </p>
                    <p className={`text-2xl font-bold ${stateConfig.text}`}>
                        {shiftEndTime || "--:--"}
                    </p>
                    {checkOutTime && (
                        <p className="text-xs text-emerald-600 font-semibold mt-1">
                            ✓ {dayjs(checkOutTime).format("HH:mm")}
                        </p>
                    )}
                </div>
            </div>

            {/* Time Remaining / Late Indicator */}
            {timeRemaining && state === "checked_in" && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 text-center"
                >
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                        ⏱️ Thời gian còn lại: <span className="font-bold text-sm">{timeRemaining}</span>
                    </p>
                </motion.div>
            )}

            {/* ✅ Late Warning */}
            {isLate && state === "need_checkin" && (
                <div className="p-3 rounded-lg bg-gradient-to-r from-red-100 to-orange-100 text-center border">
                    ⚠️ Bạn đã trễ {lateMinutes} phút
                </div>
            )}
        </div>
    );
}
