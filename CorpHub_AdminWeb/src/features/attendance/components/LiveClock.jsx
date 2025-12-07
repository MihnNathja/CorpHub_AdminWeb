import React, { useEffect, useState } from "react";
import { Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";

const hhmm = (t) => t?.substring(0, 5);

export default function LiveClock({
    shiftStartTime,
    shiftEndTime,
    checkInTime,
    checkOutTime,
    shiftStatus,
    suggestedShift
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

    const stateConfig = {
        before: {
            gradient: "from-blue-500 to-cyan-500",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            border: "border-blue-200 dark:border-blue-800",
            text: "text-blue-700 dark:text-blue-300",
            badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
            icon: Clock,
            label: "Chưa đến giờ làm",
            subtitle: "Đợi giờ bắt đầu ca làm",
        },
        need_checkin: {
            gradient: isLate ? "from-red-500 to-orange-500" : "from-amber-500 to-orange-500",
            bg: isLate ? "bg-red-50 dark:bg-red-900/20" : "bg-amber-50 dark:bg-amber-900/20",
            border: isLate ? "border-red-200 dark:border-red-800" : "border-amber-200 dark:border-amber-800",
            text: isLate ? "text-red-700 dark:text-red-300" : "text-amber-700 dark:text-amber-300",
            badge: isLate
                ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
            icon: isLate ? AlertCircle : Clock,
            label: isLate ? "⚠️ Đang trễ!" : "✓ Đã đến giờ",
            subtitle: isLate ? "Bạn đã trễ, hãy check-in ngay" : "Hãy check-in để bắt đầu ca",
        },
        checked_in: {
            gradient: "from-emerald-500 to-teal-500",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            border: "border-emerald-200 dark:border-emerald-800",
            text: "text-emerald-700 dark:text-emerald-300",
            badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
            icon: CheckCircle2,
            label: "✓ Đã check-in",
            subtitle: "Bạn đang trong ca làm",
        },
        checked_out: {
            gradient: "from-gray-400 to-slate-500",
            bg: "bg-gray-50 dark:bg-gray-900/20",
            border: "border-gray-200 dark:border-gray-800",
            text: "text-gray-700 dark:text-gray-300",
            badge: "bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800",
            icon: XCircle,
            label: "✓ Đã check-out",
            subtitle: "Ca làm đã kết thúc",
        }
    }[state];

    const StateIcon = stateConfig.icon;

    // Calculate time remaining
    const timeRemaining = endNum && nowNum < endNum
        ? `${Math.floor((endNum - nowNum) / 100)}h ${(endNum - nowNum) % 100}m`
        : null;

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
                    transition-all duration-300
                `}
            >
                {/* Gradient Background Line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stateConfig.gradient}`} />

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <motion.div
                                className={`p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20`}
                                animate={state === "need_checkin" ? { scale: [1, 1.05, 1] } : {}}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <StateIcon className={`w-6 h-6 ${stateConfig.text}`} />
                            </motion.div>
                            <div>
                                <p className={`text-xs font-semibold uppercase tracking-wider ${stateConfig.text} opacity-75`}>
                                    Trạng thái
                                </p>
                                <p className={`text-lg font-bold ${stateConfig.text}`}>
                                    {stateConfig.label}
                                </p>
                            </div>
                        </div>

                        {/* Time Badge */}
                        <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${stateConfig.badge}`}>
                            {state === "checked_in" ? "Đang làm việc" : state === "checked_out" ? "Kết thúc" : "Chờ"}
                        </div>
                    </div>

                    {/* Subtitle */}
                    <p className={`text-sm ${stateConfig.text} opacity-75`}>
                        {stateConfig.subtitle}
                    </p>

                    {/* Main Clock Display */}
                    <div className="flex items-end gap-2">
                        <motion.div
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`text-5xl font-black tracking-tighter ${stateConfig.text}`}
                        >
                            {time.toLocaleTimeString("vi-VN", { hour12: false }).substring(0, 5)}
                        </motion.div>
                        <motion.div
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className={`text-5xl font-black ${stateConfig.text} opacity-30`}
                        >
                            :
                        </motion.div>
                        <p className={`text-xl font-semibold ${stateConfig.text} opacity-60 mb-1`}>
                            {time.toLocaleTimeString("vi-VN", { hour12: false }).substring(6, 8)}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Shift Info Cards */}
            <div className="grid grid-cols-2 gap-3">
                {/* Start Time */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`
                        p-4 rounded-xl border-2 text-center
                        ${stateConfig.bg} ${stateConfig.border}
                        transition-all duration-300
                    `}
                >
                    <p className={`text-xs font-semibold uppercase tracking-wide ${stateConfig.text} opacity-75 mb-1`}>
                        Giờ vào
                    </p>
                    <p className={`text-2xl font-bold ${stateConfig.text}`}>
                        {shiftStartTime || "--:--"}
                    </p>
                    {checkInTime && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                            ✓ {dayjs(checkInTime).format("HH:mm")}
                        </p>
                    )}
                </motion.div>

                {/* End Time */}
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`
                        p-4 rounded-xl border-2 text-center
                        ${stateConfig.bg} ${stateConfig.border}
                        transition-all duration-300
                    `}
                >
                    <p className={`text-xs font-semibold uppercase tracking-wide ${stateConfig.text} opacity-75 mb-1`}>
                        Giờ ra
                    </p>
                    <p className={`text-2xl font-bold ${stateConfig.text}`}>
                        {shiftEndTime || "--:--"}
                    </p>
                    {checkOutTime && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                            ✓ {dayjs(checkOutTime).format("HH:mm")}
                        </p>
                    )}
                </motion.div>
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

            {isLate && state === "need_checkin" && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 border border-red-200 dark:border-red-800 text-center"
                >
                    <p className="text-xs text-red-700 dark:text-red-300 font-semibold">
                        ⚠️ Bạn đã trễ {nowNum - startNum < 100 ? (nowNum - startNum) : (Math.floor((nowNum - startNum) / 100) * 60 + ((nowNum - startNum) % 100))} phút
                    </p>
                </motion.div>
            )}
        </div>
    );
}
