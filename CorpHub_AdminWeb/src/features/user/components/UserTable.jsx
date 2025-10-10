import { useEffect, useState } from "react";
import UserDetailModal from "./UserDetailModal";
import { EyeIcon } from "lucide-react";

const UserTable = ({ users, onSelectUser }) => {
  return (
    <>
      <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-colors">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="border border-gray-300 dark:border-gray-700 p-2">
              #
            </th>
            <th className="border border-gray-300 dark:border-gray-700 p-2">
              Name
            </th>
            <th className="border border-gray-300 dark:border-gray-700 p-2">
              Email
            </th>
            <th className="border border-gray-300 dark:border-gray-700 p-2">
              Type
            </th>
            <th className="border border-gray-300 dark:border-gray-700 p-2">
              Department
            </th>
            <th className="border border-gray-300 dark:border-gray-700 p-2">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u, i) => (
              <tr
                key={u.id || i}
                className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <td className="border border-gray-300 dark:border-gray-700 p-2">
                  {i + 1}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-2">
                  {u.fullName}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-2">
                  {u.email}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-2">
                  {u.type}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-2">
                  {u.department?.name || "-"}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-2">
                  <button
                    type="button"
                    onClick={() => onSelectUser(u.id)}
                    className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md
      bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 transition`}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="text-center p-4 text-gray-500 dark:text-gray-300"
              >
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default UserTable;
