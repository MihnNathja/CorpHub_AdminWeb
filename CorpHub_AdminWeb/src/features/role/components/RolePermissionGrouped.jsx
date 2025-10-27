import React, { useState } from "react";
import { mockRoles } from "../components/mockRoles";

const groupedPermissions = {
  "User Management": ["user.view", "user.edit", "user.delete"],
  "Ticket Management": [
    "ticket.view",
    "ticket.create",
    "ticket.manage",
    "ticket.approve",
  ],
  "System Settings": ["role.manage"],
};

const RolePermissionMatrixGrouped = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [expandedGroups, setExpandedGroups] = useState(
    Object.keys(groupedPermissions).reduce((acc, key) => {
      acc[key] = true; // mặc định mở tất cả
      return acc;
    }, {})
  );

  // ✅ Toggle quyền cho 1 vai trò
  const handleTogglePermission = (roleId, permission) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== roleId) return r;
        const hasPerm = r.permissions.includes(permission);
        return {
          ...r,
          permissions: hasPerm
            ? r.permissions.filter((p) => p !== permission)
            : [...r.permissions, permission],
        };
      })
    );
  };

  // ✅ Toggle nhóm quyền (ẩn/hiện)
  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Bảng phân quyền theo nhóm (Role × Permission)
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <th className="p-3 text-left w-1/3">Quyền</th>
              {roles.map((role) => (
                <th
                  key={role.id}
                  className="p-3 text-center font-medium border-l border-gray-300 dark:border-gray-600"
                >
                  {role.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-gray-700 dark:text-gray-300">
            {Object.entries(groupedPermissions).map(([group, permissions]) => (
              <React.Fragment key={group}>
                {/* Header nhóm */}
                <tr
                  onClick={() => toggleGroup(group)}
                  className="bg-blue-50 dark:bg-blue-900/30 cursor-pointer select-none border-t border-gray-200 dark:border-gray-700"
                >
                  <td
                    colSpan={roles.length + 1}
                    className="p-3 font-semibold text-blue-700 dark:text-blue-300"
                  >
                    {expandedGroups[group] ? "▼" : "▶"} {group}
                  </td>
                </tr>

                {/* Các quyền trong nhóm */}
                {expandedGroups[group] &&
                  permissions.map((perm, idx) => (
                    <tr
                      key={perm}
                      className={`border-t border-gray-200 dark:border-gray-700 ${
                        idx % 2 === 0
                          ? "bg-gray-50 dark:bg-gray-800/40"
                          : "bg-white dark:bg-gray-900/30"
                      }`}
                    >
                      <td className="p-3 font-medium">{perm}</td>
                      {roles.map((role) => (
                        <td
                          key={role.id}
                          className="text-center border-l border-gray-200 dark:border-gray-700"
                        >
                          <input
                            type="checkbox"
                            checked={role.permissions.includes(perm)}
                            onChange={() =>
                              handleTogglePermission(role.id, perm)
                            }
                            className="w-4 h-4 accent-blue-600 cursor-pointer"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => console.log(roles)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition"
        >
          💾 Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

export default RolePermissionMatrixGrouped;
