import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const TreeNode = ({ node, moveNode }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "NODE",
    item: { id: node.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "NODE",
    drop: (item) => moveNode(item.id, node.id),
  });

  return (
    <div
      ref={(el) => drag(drop(el))}
      className={`p-2 rounded-md transition-all cursor-pointer ${
        isDragging
          ? "opacity-50 border border-blue-400"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {node.name}
        </span>
        {node.manager && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            👤 {node.manager}
          </span>
        )}
      </div>

      {node.children?.length > 0 && (
        <div className="pl-4 mt-1 border-l border-gray-300 dark:border-gray-600 space-y-1">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} moveNode={moveNode} />
          ))}
        </div>
      )}
    </div>
  );
};

const DepartmentTreeView = ({ data, setData }) => {
  const moveNode = (dragId, targetId) => {
    // TODO: implement update structure logic
    console.log(`Di chuyển node ${dragId} vào node ${targetId}`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-2">
        {data.map((node) => (
          <TreeNode key={node.id} node={node} moveNode={moveNode} />
        ))}
      </div>
    </DndProvider>
  );
};

export default DepartmentTreeView;
