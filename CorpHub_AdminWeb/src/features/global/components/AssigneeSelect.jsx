import React from "react";

const AssigneeSelect = ({ ticket, users, editingId, setEditingId, handleAssign }) => {
    // Nếu ticket đang IN_PROGRESS thì chỉ hiển thị tên, không cho chỉnh
    if (ticket.status === "IN_PROGRESS" || ticket.status === "DONE" || ticket.status == "REJECTED") {
        return (
            <div className="text-gray-500 dark:text-gray-400">
                {ticket.assignee?.fullName || "Chưa phân công"}
            </div>
        );
    }

    // Nếu đang chỉnh sửa (editingId trùng ticket.id)
    if (editingId === ticket.id) {
        return (
            <select
                value={ticket.assignee?.id || ""}
                onChange={(e) => handleAssign(ticket.id, e.target.value)}
                className="w-full p-1 rounded bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors"
            >
                <option value="">Chưa phân công</option>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>
                        {user.fullName}
                    </option>
                ))}
            </select>
        );
    }

    // Hiển thị tên assignee và nút ✏️
    return (
        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <span>{ticket.assignee?.fullName || "Chưa phân công"}</span>
            <button
                onClick={() => setEditingId(ticket.id)}
                className="text-blue-500 dark:text-blue-400 hover:dark:text-blue-300 transition-colors"
            >
                ✏️
            </button>
        </div>
    );
};

export default AssigneeSelect;