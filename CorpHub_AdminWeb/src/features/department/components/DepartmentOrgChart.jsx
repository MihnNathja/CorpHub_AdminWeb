import React, { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

const makeNodesFromTree = (tree, parent = null, posX = 0, posY = 0) => {
  const nodes = [];
  const edges = [];

  tree.forEach((node, index) => {
    const nodeId = String(node.id);
    nodes.push({
      id: nodeId,
      data: { label: `${node.name}\n👤 ${node.manager || "N/A"}` },
      position: { x: posX + index * 250, y: posY },
      style: {
        borderRadius: 10,
        padding: 10,
        background: "#1e3a8a",
        color: "white",
        width: 180,
        textAlign: "center",
      },
    });

    if (parent) {
      edges.push({
        id: `${parent}-${nodeId}`,
        source: String(parent),
        target: nodeId,
      });
    }

    if (node.children) {
      const childNodes = makeNodesFromTree(
        node.children,
        node.id,
        posX + index * 250,
        posY + 150
      );
      nodes.push(...childNodes.nodes);
      edges.push(...childNodes.edges);
    }
  });

  return { nodes, edges };
};

const DepartmentOrgChart = ({ data }) => {
  const { nodes, edges } = makeNodesFromTree(data);
  const [chartNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [chartEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "100%", height: "70vh" }}>
      <ReactFlow
        nodes={chartNodes}
        edges={chartEdges}
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
