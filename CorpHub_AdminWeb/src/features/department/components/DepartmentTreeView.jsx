import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ChevronDown, ChevronRight, Users } from "lucide-react";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // ảnh mặc định nếu user chưa có avatar

// ======================== TreeNode ========================
const TreeNode = ({ node, moveNode }) => {
  const [isOpen, setIsOpen] = useState(false); // collapse/expand

  const [{ isDragging }, drag] = useDrag({
    type: "DEPARTMENT",
    item: { id: node.departmentId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "DEPARTMENT",
    drop: (item) => moveNode(item.id, node.departmentId),
  });

  return (
    <div
      ref={(el) => drag(drop(el))}
      className={`p-3 rounded-md transition-all cursor-pointer border ${
        isDragging
          ? "opacity-50 border-blue-400"
          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
    >
      {/* Header: Phòng ban */}
      <div
        className="flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown size={16} className="text-gray-500" />
          ) : (
            <ChevronRight size={16} className="text-gray-500" />
          )}
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {node.departmentName}
          </span>
        </div>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1">
          <Users size={12} />
          <span>{node.users?.length || 0}</span>
        </div>
      </div>

      {/* Danh sách nhân viên */}
      {isOpen && node.users?.length > 0 && (
        <div className="pl-6 mt-2 border-l border-gray-300 dark:border-gray-600 space-y-1">
          {node.users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-md"
            >
              <img
                src={user.avatar || DEFAULT_AVATAR}
                alt={user.fullName}
                className="w-6 h-6 rounded-full object-cover border border-gray-300"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-medium">{user.fullName}</span>
                {user.email && (
                  <span className="text-xs text-gray-400">{user.email}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ======================== DepartmentTreeView ========================
const DepartmentTreeView = ({ data = [], setData }) => {
  const moveNode = (dragId, targetId) => {
    console.log(`🌀 Di chuyển phòng ban ${dragId} vào phòng ban ${targetId}`);
    // TODO: cập nhật setData hoặc gọi API backend ở đây
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-3">
        {data.length > 0 ? (
          data.map((dept) => (
            <TreeNode key={dept.departmentId} node={dept} moveNode={moveNode} />
          ))
        ) : (
          <div className="text-sm text-gray-500 italic">
            Không có phòng ban nào.
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default DepartmentTreeView;
