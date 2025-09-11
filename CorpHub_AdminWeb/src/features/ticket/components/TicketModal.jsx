import React from "react";
import { priorityColors } from "../../global/const/priorityColors";
import { statusColors } from "../../global/const/statusColors";
import StatCard from "../../global/components/StatCard";
import {
  User,
  Building2,
  Tag,
  CalendarClock,
  CalendarCheck,
  X,
  Layers,
  Info,
} from "lucide-react";

const TicketModal = ({ ticket, users, onClose, handleAssign }) => {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-3/4 max-h-[85vh] overflow-y-auto rounded-xl shadow-lg transition-colors">
        
      {/* Header với màu status */}
      <div
        className={`flex justify-between items-center p-4 rounded-t-xl ${statusColors[ticket.status]}`}
      >
        {/* Nhóm tiêu đề + badge */}
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Info className="w-5 h-5" /> {ticket.title}
          </h2>
          <StatCard
            label={ticket.priority}
            colors={priorityColors}
            className="px-3 py-1 text-xs"
          />
        </div>

        {/* Nút close */}
        <button
          onClick={onClose}
          className="ml-4 p-2 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>


        {/* Nội dung */}
        <div className="p-6 grid grid-cols-3 gap-6">
          {/* Cột trái */}
          <div className="space-y-4 col-span-1">
            <p className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <b>ID:</b> {ticket.id}
            </p>
            <p className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <b>Department:</b> {ticket.department?.name || "N/A"}
            </p>
            <p className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <b>Category:</b> {ticket.category?.categoryName || "N/A"}
            </p>
            <p className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <b>Requester:</b> {ticket.requester?.fullName || "Ẩn danh"}
            </p>
            <p className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4" />
              <b>Created At:</b> {new Date(ticket.createdAt).toLocaleString()}
            </p>
            {/* Assignee */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <label className="flex items-center gap-2 font-semibold mb-2">
                <User className="w-4 h-4" />
                Assignee
              </label>
              <select
                value={ticket.assignee?.id || ""}
                onChange={(e) => handleAssign(ticket.id, e.target.value)}
                className="w-full border rounded-lg p-2 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="">Chưa phân công</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cột phải */}
          <div className="space-y-6 col-span-2">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 mt-1" />
              <div className="flex-1">
                <b>Description</b>
                <div
                  className="mt-2 border border-gray-300 dark:border-gray-700 rounded-lg p-3 
                            bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                            whitespace-pre-line overflow-y-auto"
                  style={{ maxHeight: "200px" }}
                >
                  {ticket.description}
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t dark:border-gray-700">
          <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CalendarCheck className="w-4 h-4" />
            Updated At: {new Date(ticket.updatedAt).toLocaleString()}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 dark:bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
