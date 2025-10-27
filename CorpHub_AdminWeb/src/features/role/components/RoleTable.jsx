import React from "react";

const RoleTable = ({ roles, onEdit }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr className="text-left text-gray-700 dark:text-gray-200">
            <th className="p-3">Tên vai trò</th>
            <th className="p-3">Mô tả</th>
            <th className="p-3">Quyền</th>
            <th className="p-3 text-center">Hành động</th>
          </tr>
        </thead>

        <tbody className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
          {roles.map((r) => (
            <tr
              key={r.id}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <td className="p-3 font-medium">{r.name}</td>
              <td className="p-3">{r.description}</td>
              <td className="p-3 text-sm text-gray-600 dark:text-gray-300">
                {r.permissions.join(", ")}
              </td>
              <td className="p-3 text-center">
                <button
                  onClick={() => onEdit(r)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 
                             text-gray-700 dark:text-gray-200 
                             hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Sửa
                </button>
              </td>
            </tr>
          ))}
          {roles.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="p-4 text-center text-gray-500 dark:text-gray-400 italic"
              >
                Chưa có vai trò nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoleTable;
