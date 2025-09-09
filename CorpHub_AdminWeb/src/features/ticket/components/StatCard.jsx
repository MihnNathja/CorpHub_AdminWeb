export const statusColors = {
    OPEN: "bg-blue-300",
    WAITING: "bg-yellow-500",
    ACCEPTED: "bg-green-500",
    REJECTED: "bg-red-500",
    IN_PROGRESS: "bg-purple-500",
    DONE: "bg-green-500",
};

const StatCard = ({ status, count, className = "" }) => {
    return (
        <div className={`flex flex-col items-center justify-center p-2 rounded-2xl shadow-md ${statusColors[status]} text-white ${className}`}>
            <span className="text-xs font-semibold">{status.replace("_", " ")}</span>
            {count && <span className="text-lg font-bold">{count}</span>}
        </div>
    );
};

export default StatCard;
