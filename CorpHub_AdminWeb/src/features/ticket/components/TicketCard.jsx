import { CalendarDaysIcon, UserIcon, ClockIcon } from "@heroicons/react/24/outline";
import { priorityColors } from "../../global/const/priorityColors";
import { statusColors } from "../../global/const/statusColors";

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

    return (
        <div onClick={() => setSelectedTicket(ticket)} className="flex bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden">
            {/* Thanh màu bên trái */}
            <div className={`${statusBgOnly} w-4 rounded-l-2xl`} />

            {/* Nội dung */}
            <div className="flex-1 p-5 flex flex-col">
                {/* Badge trạng thái + ưu tiên */}
                <div className="flex gap-2 flex-wrap mb-3">
                    {statusKey && (
                        <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[statusKey] || "bg-gray-200 text-gray-700"
                                }`}
                        >
                            {statusKey}
                        </span>
                    )}
                    {priorityKey && (
                        <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${priorityColors[priorityKey] || "bg-gray-100 text-gray-600"
                                }`}
                        >
                            Ưu tiên: {priorityKey}
                        </span>
                    )}
                </div>

                {/* Tiêu đề + mô tả */}
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        {ticket.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {ticket.description}
                    </p>
                </div>

                {/* Assignee + Due date */}
                <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                        <UserIcon className="h-4 w-4" />
                        {typeof ticket.assignee === "object" && ticket.assignee !== null
                            ? ticket.assignee.fullName
                            : ticket.assignee || "Chưa phân công"}
                    </span>
                    {ticket.dueDate && (
                        <span className="flex items-center gap-1">
                            <CalendarDaysIcon className="h-4 w-4" /> {ticket.dueDate}
                        </span>
                    )}
                </div>

                {/* Ngày cập nhật */}
                {ticket.updatedAt && (
                    <div className="mt-2 flex items-center text-xs text-gray-400 dark:text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        Cập nhật lần cuối: {formatDate(ticket.updatedAt)}
                    </div>
                )}

            </div>
        </div>
    );
};

export default TicketCard;
