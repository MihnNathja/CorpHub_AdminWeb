import React, { useMemo, useState } from "react";
import { mockRoles } from "../components/mockRoles";

// ✅ Dữ liệu nhóm quyền
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

const RolePermissionMatrixPro = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [expandedGroups, setExpandedGroups] = useState(
    Object.keys(groupedPermissions).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {})
  );
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Tìm kiếm quyền theo từ khóa
  const filteredPermissions = useMemo(() => {
    if (!searchTerm) return groupedPermissions;
    const lower = searchTerm.toLowerCase();
    const filtered = {};
    Object.entries(groupedPermissions).forEach(([group, perms]) => {
      const matches = perms.filter((p) => p.toLowerCase().includes(lower));
      if (matches.length > 0) filtered[group] = matches;
    });
    return filtered;
  }, [searchTerm]);

  // ✅ Toggle quyền
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

  // ✅ Toggle nhóm
  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  // ✅ Chọn / bỏ chọn tất cả quyền trong nhóm cho 1 vai trò
  const handleToggleAllInGroup = (group, roleId, selectAll) => {
    const perms = groupedPermissions[group];
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== roleId) return r;
        return {
          ...r,
          permissions: selectAll
            ? Array.from(new Set([...r.permissions, ...perms]))
            : r.permissions.filter((p) => !perms.includes(p)),
        };
      })
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Bảng phân quyền nâng cao (Role × Permission)
        </h3>

        {/* 🔍 Ô tìm kiếm */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Tìm kiếm quyền..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl">
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
            {Object.entries(filteredPermissions).map(([group, permissions]) => (
              <React.Fragment key={group}>
                {/* Header nhóm */}
                <tr
                  onClick={() => toggleGroup(group)}
                  className="bg-blue-50 dark:bg-blue-900/30 cursor-pointer select-none border-t border-gray-200 dark:border-gray-700"
                >
                  <td
                    colSpan={roles.length + 1}
                    className="p-3 font-semibold text-blue-700 dark:text-blue-300 flex justify-between items-center"
                  >
                    <span>
                      {expandedGroups[group] ? "▼" : "▶"} {group}
                    </span>
                    <span className="flex gap-2 text-xs font-normal">
                      {roles.map((r) => {
                        const allSelected = permissions.every((p) =>
                          r.permissions.includes(p)
                        );
                        return (
                          <button
                            key={r.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleAllInGroup(group, r.id, !allSelected);
                            }}
                            className={`px-2 py-1 rounded border text-xs ${
                              allSelected
                                ? "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 border-blue-300"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            {allSelected ? "Bỏ chọn" : "Chọn tất cả"} {r.name}
                          </button>
                        );
                      })}
                    </span>
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

      {/* Footer */}
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

export default RolePermissionMatrixPro;
