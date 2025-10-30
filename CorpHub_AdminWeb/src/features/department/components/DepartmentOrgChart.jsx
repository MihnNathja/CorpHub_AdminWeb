import React, { useCallback, useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

// Ảnh mặc định nếu user chưa có avatar
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

// ====================== Chuyển đổi dữ liệu sang Node & Edge ======================
const makeNodesFromDepartments = (departments) => {
  const nodes = [];
  const edges = [];

  departments.forEach((dept, index) => {
    const nodeId = String(dept.departmentId);

    // 🎨 Render nội dung node
    const userList =
      dept.users
        ?.map(
          (u) => `
          <div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
            <img src="${u.avatar || DEFAULT_AVATAR}" 
                 style="width:20px;height:20px;border-radius:50%;object-fit:cover;border:1px solid #ddd;" />
            <span style="font-size:12px;color:#f1f1f1;">${u.fullName}</span>
          </div>`
        )
        .join("") || "";

    const labelHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <strong style="font-size:14px;">${dept.departmentName}</strong>
        <div style="margin-top:6px;">${userList}</div>
      </div>
    `;

    nodes.push({
      id: nodeId,
      data: { label: <div dangerouslySetInnerHTML={{ __html: labelHTML }} /> },
      position: { x: (index % 4) * 250, y: Math.floor(index / 4) * 180 },
      style: {
        background: "#1e3a8a",
        color: "white",
        padding: 10,
        borderRadius: 12,
        minWidth: 180,
        textAlign: "center",
      },
    });
  });

  // ⚙️ Nếu sau này bạn có quan hệ parent-child, thêm edges tại đây
  // ví dụ edges.push({ id: `${parent}-${child}`, source: parent, target: child });

  return { nodes, edges };
};

// ====================== Component chính ======================
const DepartmentOrgChart = ({ data = [] }) => {
  const { nodes: initNodes, edges: initEdges } = useMemo(
    () => makeNodesFromDepartments(data),
    [data]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-[80vh] bg-white dark:bg-gray-900 rounded-xl shadow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-right"
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default DepartmentOrgChart;
