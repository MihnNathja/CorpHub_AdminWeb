import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  ChevronDown,
  ChevronRight,
  Users,
  Pencil,
  Trash2,
  PlusCircle,
  Crown,
} from "lucide-react";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const formatUsers = (users) => {
  if (!users) return [];

  return users
    .map((u) => ({
      id: u?.userId,
      fullName: u?.fullName,
      email: u?.email,
      avatar: u?.avatar,
      positionName: u?.positionName || null,
      positionId: u?.positionId || null,
      levelOrder: u.positionResponse?.levelOrder ?? 9999,
    }))
    .sort((a, b) => a.levelOrder - b.levelOrder);
};

// ======================== TreeNode ========================
const TreeNode = ({
  node,
  moveNode,
  onEdit,
  onDelete,
  onAddChild,
  onAssignManager,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: "DEPARTMENT",
    item: { id: node.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "DEPARTMENT",
    drop: (item) => moveNode(item.id, node.id),
  });

  // 🧮 Tính tổng số nhân viên (kể cả cấp con, nếu có)
  const countUsers = (dept) => {
    const ownCount = dept.users?.length || 0;
    const childCount = dept.children?.reduce(
      (acc, c) => acc + countUsers(c),
      0
    );
    return ownCount + (childCount || 0);
  };

  const totalUsers = countUsers(node);

  return (
    <div
      ref={(el) => drag(drop(el))}
      className={`p-3 rounded-md transition-all cursor-pointer border ${
        isDragging
          ? "opacity-50 border-blue-400"
          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* Tên + manager */}
        <div
          className="flex items-center gap-2 flex-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          {node.children?.length > 0 ? (
            isOpen ? (
              <ChevronDown size={16} className="text-gray-500" />
            ) : (
              <ChevronRight size={16} className="text-gray-500" />
            )
          ) : (
            <div className="w-4" />
          )}
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {node.name}
          </span>

          {node.manager && (
            <span className="flex items-center text-xs text-gray-500 dark:text-gray-400 ml-2">
              <Crown size={12} className="mr-1 text-yellow-500" />
              {node.manager.fullName}
            </span>
          )}
        </div>

        {/* Số lượng nhân viên + actions */}
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          {/* 👥 Số lượng nhân viên */}
          <div className="flex items-center gap-1 text-xs">
            <Users size={13} />
            <span>{totalUsers}</span>
          </div>

          {/* Action buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAssignManager?.(node);
              console.log("Assign Manager", node);
            }}
            title="Gán Manager"
            className="hover:text-yellow-500"
          >
            <Crown size={14} />
          </button>
          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              onAddChild?.(node);
            }}
            title="Thêm phòng ban con"
            className="hover:text-green-500"
          >
            <PlusCircle size={14} />
          </button> */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(node);
            }}
            title="Chỉnh sửa"
            className="hover:text-blue-500"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(node.id);
            }}
            title="Xóa"
            className="hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Danh sách nhân viên */}
      {isOpen && node.users?.length > 0 && (
        <div className="pl-6 mt-2 border-l border-gray-300 dark:border-gray-600 space-y-1">
          {formatUsers(node.users).map((user) => (
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
                {user.positionName && (
                  <span className="text-xs text-blue-500">
                    {user.positionName}
                  </span>
                )}
                {user.email && (
                  <span className="text-xs text-gray-400">{user.email}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Danh sách phòng ban con */}
      {isOpen && node.children?.length > 0 && (
        <div className="pl-6 mt-3 space-y-2 border-l border-gray-200 dark:border-gray-700">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              moveNode={moveNode}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              onAssignManager={onAssignManager}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ======================== DepartmentTreeView ========================
const DepartmentTreeView = ({
  data = [],
  onEdit,
  onDelete,
  onAddChild,
  onAssignManager,
}) => {
  const moveNode = (dragId, targetId) => {
    console.log(`🌀 Di chuyển phòng ban ${dragId} vào phòng ban ${targetId}`);
    // TODO: gọi API backend hoặc cập nhật state ở đây
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-3">
        {data.length > 0 ? (
          data.map((dept) => (
            <TreeNode
              key={dept.id}
              node={dept}
              moveNode={moveNode}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              onAssignManager={onAssignManager}
            />
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
