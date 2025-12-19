import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  ChevronDown,
  ChevronRight,
  Users,
  Pencil,
  Trash2,
  Crown,
} from "lucide-react";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

/* Format user list */
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

/* ======================================================
  ROOT DROP ZONE — Drag here to make it the root department
   ====================================================== */
const RootDropZone = ({ onDropToRoot }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "DEPARTMENT",
    drop: (item) => {
      if (onDropToRoot) onDropToRoot(item.id, null); // parent = null
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`p-3 rounded-md text-center border-2 border-dashed transition-all my-3 ${
        isOver
          ? "border-blue-500 bg-blue-50 dark:bg-gray-800"
          : "border-gray-300 dark:border-gray-600"
      }`}
    >
      <span className="text-gray-600 dark:text-gray-300 text-sm">
        ⬆ Drag a department here to move it to the root level
      </span>
    </div>
  );
};

/* ======================================================
                        TREE NODE
   ====================================================== */
const TreeNode = ({ node, moveNode, onEdit, onDelete, onAssignManager }) => {
  const [isOpen, setIsOpen] = useState(false);

  /* Drag configuration */
  const [{ isDragging }, drag] = useDrag({
    type: "DEPARTMENT",
    item: { id: node.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  /* Drop configuration */
  const [, drop] = useDrop({
    accept: "DEPARTMENT",
    drop: (item) => {
      moveNode(item.id, node.id);
    },
  });

  /* Count users across tree */
  const countUsers = (dept) => {
    const own = dept.users?.length || 0;
    const child = dept.children?.reduce((acc, c) => acc + countUsers(c), 0);
    return own + (child || 0);
  };

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
            <span className="flex items-center text-xs text-gray-500 ml-2">
              <Crown size={12} className="mr-1 text-yellow-500" />
              {node.manager.fullName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-gray-500">
          <div className="flex items-center gap-1 text-xs">
            <Users size={13} />
            <span>{countUsers(node)}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAssignManager?.(node);
            }}
            className="hover:text-yellow-500"
          >
            <Crown size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(node);
            }}
            className="hover:text-blue-500"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(node.id);
            }}
            className="hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Users */}
      {isOpen && node.users?.length > 0 && (
        <div className="pl-6 mt-2 border-l border-gray-300 space-y-1">
          {formatUsers(node.users).map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-2 text-sm hover:bg-gray-100 p-1 rounded-md"
            >
              <img
                src={u.avatar || DEFAULT_AVATAR}
                className="w-6 h-6 rounded-full border"
              />
              <div className="flex flex-col text-xs">
                <span className="font-medium">{u.fullName}</span>
                {u.positionName && (
                  <span className="text-blue-500">{u.positionName}</span>
                )}
                <span className="text-gray-400">{u.email}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Children */}
      {isOpen && node.children?.length > 0 && (
        <div className="pl-6 mt-3 space-y-2 border-l border-gray-200">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              moveNode={moveNode}
              onEdit={onEdit}
              onDelete={onDelete}
              onAssignManager={onAssignManager}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ======================================================
                    MAIN TREE VIEW
   ====================================================== */
const DepartmentTreeView = ({
  data = [],
  onEdit,
  onDelete,
  onAssignManager,
  onMoveDepartment,
}) => {
  const moveNode = (dragId, targetId) => {
    if (onMoveDepartment) onMoveDepartment(dragId, targetId);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* ROOT DROP ZONE */}
      <RootDropZone onDropToRoot={onMoveDepartment} />

      <div className="space-y-3">
        {data.length > 0 ? (
          data.map((dept) => (
            <TreeNode
              key={dept.id}
              node={dept}
              moveNode={moveNode}
              onEdit={onEdit}
              onDelete={onDelete}
              onAssignManager={onAssignManager}
            />
          ))
        ) : (
          <div className="text-sm text-gray-500 italic">
            No departments available.
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default DepartmentTreeView;
