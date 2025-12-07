import React, { useEffect, useState } from "react";
import { Clock, LogIn, LogOut, CheckCircle2, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ICONS = {
    shift_start: Clock,
    checkin: LogIn,
    checkout: LogOut,
    shift_end: Clock,
};

const COLORS = {
    shift_start: {
        icon: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-900/30",
        border: "border-blue-300 dark:border-blue-700",
        glow: "shadow-blue-400/50",
    },
    checkin: {
        icon: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        border: "border-emerald-300 dark:border-emerald-700",
        glow: "shadow-emerald-400/50",
    },
    checkout: {
        icon: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-100 dark:bg-purple-900/30",
        border: "border-purple-300 dark:border-purple-700",
        glow: "shadow-purple-400/50",
    },
    shift_end: {
        icon: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-100 dark:bg-indigo-900/30",
        border: "border-indigo-300 dark:border-indigo-700",
        glow: "shadow-indigo-400/50",
    },
};

const toMinutes = (t) => {
    if (!t || t === "--:--") return Infinity;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
};

export default function AttendanceTimeline({ events = [] }) {
    const [currentIndex, setCurrentIndex] = useState(-1);

    // 🔥 Auto determine current milestone
    useEffect(() => {
        if (!events || events.length === 0) {
            setCurrentIndex(-1);
            return;
        }

        // 1. If checkout exists → milestone is checkout
        const checkoutIdx = events.findIndex(
            (e) => e.type === "checkout" && e.time && e.time !== "--:--"
        );
        if (checkoutIdx !== -1) {
            setCurrentIndex(checkoutIdx);
            return;
        }

        // 2. If checkin exists (no checkout yet) → milestone is checkin
        const checkinIdx = events.findIndex(
            (e) => e.type === "checkin" && e.time && e.time !== "--:--"
        );
        if (checkinIdx !== -1) {
            setCurrentIndex(checkinIdx);
            return;
        }

        // 3. Use current time to determine which milestone has passed
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

    if (!events || events.length === 0) {
        return (
            <div className="p-8 text-center space-y-2">
                <Circle className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No timeline events
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            <AnimatePresence mode="popLayout">
                {events.map((e, idx) => {
                    const Icon = ICONS[e.type] || Clock;
                    const colors = COLORS[e.type] || COLORS.shift_start;
                    const isPast = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;
                    const isLast = idx === events.length - 1;

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative"
                        >
                            <div className="flex items-start gap-3">
                                {/* Icon Column */}
                                <div className="relative flex flex-col items-center">
                                    {/* Icon Circle */}
                                    <motion.div
                                        animate={
                                            isCurrent
                                                ? {
                                                    scale: [1, 1.1, 1],
                                                    boxShadow: [
                                                        "0 0 0 0px rgba(59, 130, 246, 0.4)",
                                                        "0 0 0 6px rgba(59, 130, 246, 0)",
                                                    ],
                                                }
                                                : {}
                                        }
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                        }}
                                        className={`
                                            relative z-10 p-2.5 rounded-full border-2
                                            transition-all duration-300
                                            ${isPast ? colors.bg : "bg-gray-100 dark:bg-gray-800"}
                                            ${isPast ? colors.border : "border-gray-300 dark:border-gray-600"}
                                            ${isCurrent ? `shadow-lg ${colors.glow}` : ""}
                                        `}
                                    >
                                        <Icon
                                            className={`w-4 h-4 ${isPast ? colors.icon : "text-gray-400 dark:text-gray-600"
                                                }`}
                                        />

                                        {/* Current Indicator Pulse */}
                                        {isCurrent && (
                                            <motion.div
                                                className="absolute inset-0 rounded-full border-2 border-blue-400"
                                                animate={{
                                                    scale: [1, 1.5],
                                                    opacity: [0.6, 0],
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                }}
                                            />
                                        )}
                                    </motion.div>

                                    {/* Connecting Line */}
                                    {!isLast && (
                                        <div
                                            className={`
                                                w-0.5 h-12 transition-all duration-500
                                                ${isPast
                                                    ? "bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500"
                                                    : "bg-gray-300 dark:bg-gray-700"
                                                }
                                            `}
                                        />
                                    )}
                                </div>

                                {/* Content Column */}
                                <div className="flex-1 pb-8 pt-1">
                                    <div
                                        className={`
                                            p-3 rounded-xl border transition-all duration-300
                                            ${isPast
                                                ? "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700"
                                                : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                            }
                                            ${isCurrent ? "ring-2 ring-blue-500/50 shadow-lg" : ""}
                                        `}
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <p
                                                className={`text-xs font-semibold uppercase tracking-wide ${isPast
                                                        ? "text-gray-700 dark:text-gray-300"
                                                        : "text-gray-500 dark:text-gray-500"
                                                    }`}
                                            >
                                                {e.label}
                                            </p>

                                            {/* Status Badge */}
                                            {isPast && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isCurrent
                                                            ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                                                            : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                                                        }`}
                                                >
                                                    {isCurrent ? "HIỆN TẠI" : "HOÀN THÀNH"}
                                                </motion.div>
                                            )}
                                        </div>

                                        <div className="flex items-baseline gap-2">
                                            <p
                                                className={`text-xl font-bold ${isPast
                                                        ? "text-gray-900 dark:text-white"
                                                        : "text-gray-400 dark:text-gray-600"
                                                    }`}
                                            >
                                                {e.time || "--:--"}
                                            </p>

                                            {isCurrent && (
                                                <motion.div
                                                    animate={{ opacity: [1, 0.3, 1] }}
                                                    transition={{
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                    }}
                                                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                                                    Đang diễn ra
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
