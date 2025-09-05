import React, { useState } from "react";
import { useTickets } from "../hooks/useTickets";

const TicketTable = () => {
  const {
    tickets, loading, statusFilter, setStatusFilter,
    page, setPage, totalPages, users,
    selectedTicket, setSelectedTicket,
    editingId, setEditingId,
    handleAssign
  } = useTickets();


  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      {/* Filter */}
      <div className="mb-4 flex items-center gap-2">
        <label>Status: </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded p-1"
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Priority</th>
              <th className="border px-4 py-2">Assignee</th>
              <th className="border px-4 py-2">Created At</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{ticket.id.slice(0, 8)}...</td>
                <td className="border px-4 py-2">{ticket.title}</td>
                <td className="border px-4 py-2">{ticket.status}</td>
                <td className="border px-4 py-2">{ticket.priority}</td>
                <td className="border px-4 py-2">
                  {editingId === ticket.id ? (
                    <select
                      value={ticket.assignee?.id || ""}
                      onChange={(e) => handleAssign(ticket.id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="">Chưa phân công</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.fullName}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{ticket.assignee?.fullName || "Chưa phân công"}</span>
                      <button onClick={() => setEditingId(ticket.id)} className="text-blue-500">✏️</button>
                    </div>
                  )}
                </td>

                <td className="border px-4 py-2">
                  {new Date(ticket.createdAt).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page} / {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-2/3 max-h-[80vh] overflow-y-auto shadow-lg">
            <h2 className="text-lg font-bold mb-4">Ticket Details</h2>
            <div className="space-y-2">
              <p><b>ID:</b> {selectedTicket.id}</p>
              <p><b>Title:</b> {selectedTicket.title}</p>
              <p><b>Description:</b> {selectedTicket.description}</p>
              <p><b>Category:</b> {selectedTicket.category?.name || "N/A"}</p>
              <p><b>Requester:</b> {selectedTicket.requester?.fullName || "Ẩn danh"}</p>
              <div className="mt-2">
              <label className="block font-semibold">Assignee</label>
              <select
                value={selectedTicket.assignee?.id || ""}
                onChange={(e) => {
                  const newUserId = e.target.value;
                  handleAssign(selectedTicket.id, newUserId);
                  setSelectedTicket({
                    ...selectedTicket,
                    assignee: { id: newUserId }
                  });
                }}
                className="border rounded p-1 w-full"
              >
                <option value="">Chưa phân công</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.fullName}</option>
                ))}
              </select>

            </div>

              <p><b>Department:</b> {selectedTicket.department?.name || "N/A"}</p>
              <p><b>Priority:</b> {selectedTicket.priority}</p>
              <p><b>Status:</b> {selectedTicket.status}</p>
              <p><b>Assigned At:</b> {selectedTicket.assignedAt ? new Date(selectedTicket.assignedAt).toLocaleString() : "-"}</p>
              <p><b>Resolved At:</b> {selectedTicket.resolvedAt ? new Date(selectedTicket.resolvedAt).toLocaleString() : "-"}</p>
              <p><b>Created At:</b> {new Date(selectedTicket.createdAt).toLocaleString()}</p>
              <p><b>Updated At:</b> {new Date(selectedTicket.updatedAt).toLocaleString()}</p>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketTable;
