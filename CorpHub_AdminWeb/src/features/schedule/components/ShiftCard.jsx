import dayjs from "dayjs";
import "dayjs/locale/vi";
import { motion } from "framer-motion";
import {
    Clock,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Calendar,
    LogIn,
    LogOut,
    FileText
} from "lucide-react";

const STATUS_STYLE = {
    SCHEDULED: {
        bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30",
        border: "border-blue-300 dark:border-blue-700",
        text: "text-blue-700 dark:text-blue-300",
        icon: Calendar,
        iconBg: "bg-blue-500",
    },
    IN_PROGRESS: {
        bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30",
        border: "border-purple-400 dark:border-purple-700",
        text: "text-purple-700 dark:text-purple-300",
        icon: Clock,
        iconBg: "bg-purple-500",
    },
    COMPLETED: {
        bg: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/30",
        border: "border-emerald-300 dark:border-emerald-700",
        text: "text-emerald-700 dark:text-emerald-300",
        icon: CheckCircle,
        iconBg: "bg-emerald-500",
    },
    MISSED: {
        bg: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30",
        border: "border-red-300 dark:border-red-700",
        text: "text-red-700 dark:text-red-300",
        icon: XCircle,
        iconBg: "bg-red-500",
    },
    CANCELLED: {
        bg: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/30",
        border: "border-gray-300 dark:border-gray-700",
        text: "text-gray-500 dark:text-gray-400",
        icon: XCircle,
        iconBg: "bg-gray-500",
    },
    ABSENCE: {
        bg: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/30",
        border: "border-amber-300 dark:border-amber-700",
        text: "text-amber-700 dark:text-amber-300",
        icon: AlertTriangle,
        iconBg: "bg-amber-500",
    },
};

const ShiftCard = ({ shift }) => {
    const style = STATUS_STYLE[shift.status] || STATUS_STYLE.SCHEDULED;
    const StatusIcon = style.icon;

    const checkIn = shift.checkInTime ? dayjs(shift.checkInTime) : null;
    const checkOut = shift.checkOutTime ? dayjs(shift.checkOutTime) : null;

    const plannedStart = dayjs(shift.start);
    const plannedEnd = dayjs(shift.end);

    const isLate = checkIn && checkIn.isAfter(plannedStart);
    const isEarly = checkOut && checkOut.isBefore(plannedEnd);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full border-2 ${style.border} ${style.bg} ${style.text} rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group`}
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 dark:bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

            {/* Header with icon and title */}
            <div className="relative flex items-start gap-2 mb-2">
                <div className={`${style.iconBg} p-1.5 rounded-lg shadow-sm`}>
                    <StatusIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs truncate leading-tight">
                        {shift.title}
                    </div>
                    <div className="text-[10px] opacity-75 mt-0.5">
                        {shift.status === "SCHEDULED" && "Đã lên lịch"}
                        {shift.status === "IN_PROGRESS" && "Đang diễn ra"}
                        {shift.status === "COMPLETED" && "Đã hoàn thành"}
                        {shift.status === "MISSED" && "Vắng mặt"}
                        {shift.status === "CANCELLED" && "Đã hủy"}
                        {shift.status === "ABSENCE" && "Nghỉ phép"}
                    </div>
                </div>
            </div>

            {/* Planned time */}
            <div className="relative flex items-center gap-1.5 mb-2 text-[10px] bg-white/30 dark:bg-black/20 rounded-lg px-2 py-1.5">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span className="font-semibold">
                    {plannedStart.format("HH:mm")} – {plannedEnd.format("HH:mm")}
                </span>
            </div>

            {/* Check-in/out display */}
            {(checkIn || checkOut) && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative space-y-1.5 text-[10px]"
                >
                    {checkIn && (
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${isLate
                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                : "bg-white/40 dark:bg-black/20"
                            }`}>
                            <LogIn className="w-3 h-3 flex-shrink-0" />
                            <span className="font-semibold">Check-in:</span>
                            <span className={isLate ? "font-bold" : ""}>
                                {checkIn.format("HH:mm")}
                            </span>
                            {isLate && (
                                <motion.span
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                    className="ml-auto"
                                >
                                    <AlertTriangle className="w-3 h-3" />
                                </motion.span>
                            )}
                        </div>
                    )}

                    {checkOut && (
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${isEarly
                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                : "bg-white/40 dark:bg-black/20"
                            }`}>
                            <LogOut className="w-3 h-3 flex-shrink-0" />
                            <span className="font-semibold">Check-out:</span>
                            <span className={isEarly ? "font-bold" : ""}>
                                {checkOut.format("HH:mm")}
                            </span>
                            {isEarly && (
                                <motion.span
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                    className="ml-auto"
                                >
                                    <AlertTriangle className="w-3 h-3" />
                                </motion.span>
                            )}
                        </div>
                    )}
                </motion.div>
            )}

            {/* Notes */}
            {shift.notes && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative mt-2 pt-2 border-t border-current/20"
                >
                    <div className="flex items-start gap-1.5 text-[10px]">
                        <FileText className="w-3 h-3 flex-shrink-0 mt-0.5 opacity-60" />
                        <p className="italic opacity-80 line-clamp-2 leading-relaxed">
                            {shift.notes}
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Status indicator dot */}
            <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute top-2 right-2 w-2 h-2 ${style.iconBg} rounded-full shadow-lg`}
            />
        </motion.div>
    );
};

export default ShiftCard;
