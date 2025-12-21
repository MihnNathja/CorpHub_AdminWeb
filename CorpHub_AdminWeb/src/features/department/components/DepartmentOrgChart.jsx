import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from "reactflow";
import {
  Users,
  Crown,
  Pencil,
  Trash2,
  MoveVertical,
  Network,
} from "lucide-react";
import AssignManagerModal from "./AssignManagerModal";
import "reactflow/dist/style.css";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

// Build nodes/edges from tree data
const buildFlowData = (departments = [], handlers) => {
  const nodes = [];
  const edges = [];
  let x = 0;

  const walk = (dept, depth) => {
    const nodeId = String(dept.id);

    nodes.push({
      id: nodeId,
      type: "department",
      position: { x: x * 240, y: depth * 200 },
      data: {
        dept,
        ...handlers,
      },
    });

    if (dept.children?.length) {
      dept.children.forEach((child) => {
        edges.push({
          id: `${dept.id}-${child.id}`,
          source: String(dept.id),
          target: String(child.id),
          animated: false,
        });
        walk(child, depth + 1);
      });
    } else {
      // advance x for leaf placement
      x += 1;
    }
  };

  departments.forEach((d) => {
    walk(d, 0);
    x += 1; // spacing between top-level siblings
  });

  return { nodes, edges };
};

const DepartmentNode = ({ data }) => {
  const { dept, onEdit, onDelete, onAssignManager, onMoveToRoot } = data;
  const userCount = dept.users?.length || 0;

  return (
    <div className="relative bg-gradient-to-b from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg border border-white/10 min-w-[220px]">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-indigo-200"
      />

      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Network size={16} className="text-white/80" />
            <h3 className="font-semibold text-sm leading-tight">{dept.name}</h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/80">
            <Users size={14} />
            <span>{userCount}</span>
          </div>
        </div>

        {dept.manager && (
          <div className="flex items-center gap-2 text-xs bg-white/10 rounded-lg px-2 py-1">
            <Crown size={14} className="text-amber-300" />
            <span className="truncate">{dept.manager.fullName}</span>
          </div>
        )}

        {dept.users?.length > 0 && (
          <div className="flex -space-x-2">
            {dept.users.slice(0, 4).map((u) => (
              <img
                key={u.id || u.userId}
                src={u.avatar || DEFAULT_AVATAR}
                alt={u.fullName}
                className="w-7 h-7 rounded-full border-2 border-white"
                title={u.fullName}
              />
            ))}
            {dept.users.length > 4 && (
              <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 text-[11px] border border-white/20">
                +{dept.users.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-1 text-white/90">
          <button
            onClick={() => onAssignManager?.(dept)}
            className="hover:text-amber-200"
            title="Assign manager"
          >
            <Crown size={16} />
          </button>
          <button
            onClick={() => onEdit?.(dept)}
            className="hover:text-blue-200"
            title="Edit department"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete?.(dept.id)}
            className="hover:text-rose-200"
            title="Delete department"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={() => onMoveToRoot?.(dept.id)}
            className="hover:text-emerald-200"
            title="Move to root"
          >
            <MoveVertical size={16} />
          </button>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-indigo-200"
      />
    </div>
  );
};

const DepartmentOrgChart = ({
  data = [],
  onEdit,
  onDelete,
  onAssignManager,
  onMoveDepartment,
}) => {
  const handlers = useMemo(
    () => ({
      onEdit,
      onDelete,
      onAssignManager,
      onMoveToRoot: (deptId) => onMoveDepartment?.(deptId, null),
    }),
    [onAssignManager, onDelete, onEdit, onMoveDepartment]
  );

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildFlowData(data, handlers),
    [data, handlers]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialEdges, initialNodes, setEdges, setNodes]);

  const [selectedDept, setSelectedDept] = useState(null);
  const [managerModalOpen, setManagerModalOpen] = useState(false);

  const handleAssignManager = (dept) => {
    setSelectedDept(dept);
    setManagerModalOpen(true);
  };

  const handleSelectManager = async (user) => {
    if (!selectedDept || !onAssignManager) return;
    await onAssignManager(selectedDept.id, user.userId ?? user.id);
    setManagerModalOpen(false);
  };

  const onConnect = useCallback(
    (params) => {
      // Treat source as parent, target as child -> move child under parent
      const { source, target } = params;
      if (onMoveDepartment && target && source) {
        onMoveDepartment(target, source);
      }
      setEdges((eds) => addEdge({ ...params, animated: false }, eds));
    },
    [onMoveDepartment, setEdges]
  );

  const nodeTypes = useMemo(
    () => ({
      department: (props) => (
        <DepartmentNode
          {...props}
          data={{
            ...props.data,
            onAssignManager: handleAssignManager,
          }}
        />
      ),
    }),
    [handleAssignManager]
  );

  return (
    <>
      <div className="w-full h-[80vh] bg-white dark:bg-gray-900 rounded-xl shadow">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <MiniMap zoomable pannable />
          <Controls />
          <Background color="#e5e7eb" gap={18} />
        </ReactFlow>
      </div>

      <AssignManagerModal
        open={managerModalOpen}
        dept={selectedDept}
        onClose={() => setManagerModalOpen(false)}
        onSelect={handleSelectManager}
      />
    </>
  );
};

export default DepartmentOrgChart;
