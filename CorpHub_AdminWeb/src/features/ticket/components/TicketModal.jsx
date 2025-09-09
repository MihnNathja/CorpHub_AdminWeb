import React from "react";

const TicketModal = ({ ticket, users, onClose, handleAssign }) => {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded-lg w-2/3 max-h-[80vh] overflow-y-auto shadow-lg transition-colors">
        <h2 className="text-lg font-bold mb-4">Ticket Details</h2>
        <div className="space-y-2">
          <p><b>ID:</b> {ticket.id}</p>
          <p><b>Title:</b> {ticket.title}</p>
          <p><b>Description:</b> {ticket.description}</p>
          <p><b>Category:</b> {ticket.category?.name || "N/A"}</p>
          <p><b>Requester:</b> {ticket.requester?.fullName || "Ẩn danh"}</p>

          <div className="mt-2">
            <label className="block font-semibold">Assignee</label>
            <select
              value={ticket.assignee?.id || ""}
              onChange={(e) => handleAssign(ticket.id, e.target.value)}
              className="border rounded p-1 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 transition-colors"
            >
              <option value="">Chưa phân công</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName}
                </option>
              ))}
            </select>
          </div>

          <p><b>Department:</b> {ticket.department?.name || "N/A"}</p>
          <p><b>Priority:</b> {ticket.priority}</p>
          <p><b>Status:</b> {ticket.status}</p>
          <p><b>Created At:</b> {new Date(ticket.createdAt).toLocaleString()}</p>
          <p><b>Updated At:</b> {new Date(ticket.updatedAt).toLocaleString()}</p>
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
