import { CalendarDaysIcon, UserIcon, ClockIcon, ChevronRightIcon, CheckCircleIcon, EllipsisHorizontalIcon, SparklesIcon, FireIcon } from "@heroicons/react/24/outline";
import { priorityColors } from "../../global/const/priorityColors";
import { statusColors } from "../../global/const/statusColors";
import { motion } from "framer-motion";

const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const TicketCard = ({ ticket, setSelectedTicket }) => {
    const statusKey = ticket.status?.toUpperCase();
    const priorityKey = ticket.priority?.toUpperCase();

    const statusClass = statusColors[statusKey] || "bg-gray-200";
    const statusBgOnly =
        statusClass.split(" ").find((cls) => cls.startsWith("bg-")) || "bg-gray-200";

    const priorityClass = priorityColors[priorityKey] || "bg-gray-100 text-gray-600";

    const priorityIcons = {
        LOW: CheckCircleIcon,
        MEDIUM: EllipsisHorizontalIcon,
        HIGH: SparklesIcon,
        URGENT: FireIcon,
    };

    const PriorityIcon = priorityIcons[priorityKey];

    return (
        <motion.div
            whileHover={{ scale: 1.02, translateY: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTicket(ticket)}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer"
        >
            {/* Animated gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />

            {/* Left accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusBgOnly} rounded-l-2xl`} />

            {/* Content */}
            <div className="relative p-5 flex flex-col h-full">
                {/* Header: Status + Priority badges */}
                <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex gap-2 flex-wrap flex-1">
                        {/* Status Badge */}
                        {statusKey && (
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg ${statusClass} shadow-sm inline-flex items-center gap-1`}
                            >
                                <span className="w-2 h-2 rounded-full bg-current opacity-60" />
                                {statusKey}
                            </motion.span>
                        )}

                        {/* Priority Badge */}
                        {priorityKey && PriorityIcon && (
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg ${priorityClass} shadow-sm inline-flex items-center gap-1.5`}
                            >
                                <PriorityIcon className="w-4 h-4" />
                                {priorityKey}
                            </motion.span>
                        )}
                    </div>

                    {/* Hover indicator */}
                    <ChevronRightIcon className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {ticket.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                    {ticket.description || "No description provided"}
                </p>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-3" />

                {/* Footer: Assignee + Due Date */}
                <div className="space-y-2 mb-3">
                    {/* Assignee */}
                    <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                            <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {typeof ticket.assignee === "object" && ticket.assignee !== null
                                ? ticket.assignee.fullName
                                : ticket.assignee || "Unassigned"}
                        </span>
                    </div>

                    {/* Due Date */}
                    {ticket.dueDate && (
                        <div className="flex items-center gap-2 text-sm">
                            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/30">
                                <CalendarDaysIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                                {ticket.dueDate}
                            </span>
                        </div>
                    )}
                </div>

                {/* Updated timestamp */}
                {ticket.updatedAt && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                        <ClockIcon className="h-3.5 w-3.5" />
                        <span>Updated {formatDate(ticket.updatedAt)}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TicketCard;
