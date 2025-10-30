import React, { useState } from "react";
import DepartmentTreeView from "../components/DepartmentTreeView";
import DepartmentOrgChart from "../components/DepartmentOrgChart";
import { useDepartmentManagement } from "../hooks/useDepartmentManagement";

// ✅ Dữ liệu mẫu
const mockDepartments = [
  {
    id: 1,
    name: "Công ty ABC",
    manager: "Nguyễn Văn A",
    parentId: null,
    children: [
      {
        id: 2,
        name: "Phòng Nhân sự",
        manager: "Trần Thị B",
        children: [{ id: 5, name: "Tuyển dụng", manager: "Lê Văn C" }],
      },
      {
        id: 3,
        name: "Phòng IT",
        manager: "Nguyễn Hữu D",
        children: [
          { id: 6, name: "Frontend Team", manager: "Đoàn Minh E" },
          { id: 7, name: "Backend Team", manager: "Phan Hải F" },
        ],
      },
    ],
  },
];

const DepartmentManagementPage = () => {
  const [viewMode, setViewMode] = useState("tree"); // "tree" | "org"
  // const [departments, setDepartments] = useState(mockDepartments);

  const { departments } = useDepartmentManagement();
  console.log(departments);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Quản lý Phòng ban
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Xem, chỉnh sửa và sắp xếp cấu trúc tổ chức của công ty
          </p>
        </div>

        {/* Chuyển chế độ */}
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              viewMode === "tree"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
            onClick={() => setViewMode("tree")}
          >
            🌳 Dạng cây
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              viewMode === "org"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
            onClick={() => setViewMode("org")}
          >
            🧬 Sơ đồ tổ chức
          </button>
        </div>
      </div>

      {/* Chế độ hiển thị */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all">
        {viewMode === "tree" && <DepartmentTreeView data={departments} />}
        {viewMode === "org" && <DepartmentOrgChart data={departments} />}
      </div>
    </div>
  );
};

export default DepartmentManagementPage;
