import React from "react";

const TicketRow = ({
  ticket,
  users,
  editingId,
  setEditingId,
  handleAssign,
  handleConfirmSend,
  setSelectedTicket,
  mode
}) => {
  return (
    <tr key={ticket.id} className="hover:bg-gray-100">
      <td className="border px-4 py-2">{ticket.id.slice(0, 8)}...</td>
      <td className="border px-4 py-2">{ticket.title}</td>
      <td className="border px-4 py-2">{ticket.status}</td>
      <td className="border px-4 py-2">{ticket.priority}</td>

      {/* Received = chọn assignee; Sent = hiển thị requester */}
      <td className="border px-4 py-2">
        {mode === "received" ? (
          editingId === ticket.id ? (
            <select
              value={ticket.assignee?.id || ""}
              onChange={(e) => handleAssign(ticket.id, e.target.value)}
              className="border rounded p-1"
            >
              <option value="">Chưa phân công</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center gap-2">
              <span>{ticket.assignee?.fullName || "Chưa phân công"}</span>
              <button
                onClick={() => setEditingId(ticket.id)}
                className="text-blue-500"
              >
                ✏️
              </button>
            </div>
          )
        ) : (
          <span>{ticket.requester?.fullName || "Ẩn danh"}</span>
        )}
      </td>

      <td className="border px-4 py-2">
        {new Date(ticket.createdAt).toLocaleString()}
      </td>

      <td className="border px-4 py-2 flex gap-2">
        {/* Action khác nhau theo mode */}
        {mode === "sent" ? (
          <button
            onClick={() => handleConfirmSend(ticket.id)}
            className="px-2 py-1 bg-green-500 text-white rounded"
          >
            Confirm
          </button>
        ) : (
          <button
            onClick={() => setSelectedTicket(ticket)}
            className="px-2 py-1 bg-blue-500 text-white rounded"
          >
            View
          </button>
        )}
      </td>
    </tr>
  );
};

export default TicketRow;
