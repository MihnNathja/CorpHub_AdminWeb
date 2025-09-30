import React from "react";
import { Pencil, X } from "lucide-react";

const AssigneeSelect = ({ 
  ticket, 
  users, 
  editingId, 
  setEditingId, 
  handleAssign, 
  setIsReasonFormOpen,
  setSelectedTicket
}) => {
  // Các trạng thái không cho chỉnh sửa
  if (["IN_PROGRESS", "DONE", "REJECTED", "ASSIGNING"].includes(ticket.status)) {
    return (
      <div className="text-gray-500 dark:text-gray-400">
        {ticket.assignee?.fullName || "Chưa phân công"}
      </div>
    );
  }

  // Nếu đang edit
  if (editingId === ticket.id) {
    return (
      <select
        value={ticket.assignee?.id || ""}
        onChange={(e) => {
          handleAssign(ticket.id, e.target.value);
          setEditingId(null); // sau khi chọn thì thoát chế độ edit
        }}
        className="w-full p-1 rounded bg-gray-50 dark:bg-gray-800 
                   text-gray-800 dark:text-gray-100 transition-colors"
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

  // Trạng thái bình thường: chỉ có 2 nút Edit và Reject
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setEditingId(ticket.id)}
        className="p-1 rounded text-blue-500 hover:bg-blue-100 
                   dark:hover:bg-blue-900 transition-colors"
      >
        <Pencil className="w-4 h-4" />
      </button>

      <button
        onClick={() => 
            {
                setSelectedTicket(ticket)
                setIsReasonFormOpen(true)
            }}
        className="p-1 rounded text-red-500 hover:bg-red-100 
                   dark:hover:bg-red-900 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AssigneeSelect;
