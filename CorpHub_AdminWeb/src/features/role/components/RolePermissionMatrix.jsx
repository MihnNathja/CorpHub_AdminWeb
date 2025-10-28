import React, { useState } from "react";
import { mockRoles, allPermissions } from "../components/mockRoles";

const RolePermissionMatrix = () => {
  const [roles, setRoles] = useState(mockRoles);

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

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Bảng phân quyền (Role × Permission)
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
            {allPermissions.map((perm, idx) => (
              <tr
                key={perm}
                className={`border-t border-gray-200 dark:border-gray-700 ${
                  idx % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800/40"
                    : "bg-white dark:bg-gray-900/40"
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
                      onChange={() => handleTogglePermission(role.id, perm)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => console.log(roles)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

export default RolePermissionMatrix;
