import React, { useState } from "react";
import RoleTable from "../components/RoleTable";
import RoleFormModal from "../components/RoleFormModal";
import { mockRoles, allPermissions } from "../components/mockRoles";
import RolePermissionMatrix from "../components/RolePermissionMatrix";
import RolePermissionMatrixGrouped from "../components/RolePermissionGrouped";
import RolePermissionMatrixPro from "../components/RolePermissionMatrixPro";

const RolesPage = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [activeTab, setActiveTab] = useState("roles");
  const [isOpen, setIsOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const handleSave = (role) => {
    if (role.id) {
      setRoles((prev) => prev.map((r) => (r.id === role.id ? { ...role } : r)));
    } else {
      setRoles((prev) => [...prev, { ...role, id: Date.now() }]);
    }
    setIsOpen(false);
  };

  const tabs = [
    { key: "roles", label: "Danh sách vai trò" },
    { key: "permissions", label: "Tất cả quyền" },
  ];

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Title */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
          Role & Permission Management
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingRole(null);
              setIsOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition"
          >
            + Thêm vai trò
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-5 py-2.5 font-medium text-sm transition-all duration-200
              ${
                activeTab === tab.key
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-blue-500"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all">
        {activeTab === "roles" && (
          <RoleTable
            roles={roles}
            onEdit={(r) => {
              setEditingRole(r);
              setIsOpen(true);
            }}
          />
        )}

        {/* {activeTab === "permissions" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">
              Danh sách quyền hệ thống
            </h3>
            <div className="flex flex-wrap gap-2">
              {allPermissions.map((p, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )} */}
        {/* {activeTab === "permissions" && <RolePermissionMatrix />} */}
        {activeTab === "permissions" && <RolePermissionMatrixGrouped />}
        {/* {activeTab === "permissions" && <RolePermissionMatrixPro />} */}
      </div>

      {/* Modal thêm/sửa vai trò */}
      <RoleFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
        allPermissions={allPermissions}
        role={editingRole}
      />
    </div>
  );
};

export default RolesPage;
