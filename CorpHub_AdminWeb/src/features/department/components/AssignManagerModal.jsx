import React from "react";
import { Crown } from "lucide-react";

const AssignManagerModal = ({ open, onClose, dept, onSelect }) => {
  if (!open || !dept) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-md w-[400px]">
        <h2 className="text-lg font-bold mb-3">
          Select manager for {dept.name}
        </h2>

        <div className="max-h-64 overflow-auto space-y-2">
          {dept.users?.map((u) => (
            <div
              key={u.id}
              onClick={() => onSelect(u)}
              className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <img src={u.avatar} className="w-8 h-8 rounded-full" />
              <div className="flex flex-col">
                <span className="font-medium">{u.fullName}</span>
                <span className="text-xs text-gray-400">{u.email}</span>
              </div>

              <Crown className="ml-auto text-yellow-500" size={18} />
            </div>
          ))}

          {dept.users?.length === 0 && (
            <div className="text-sm text-gray-500 italic">
              No employees available.
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignManagerModal;
