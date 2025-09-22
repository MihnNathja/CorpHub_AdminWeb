import { useEffect, useState } from "react";
import UserDetailModal from "./UserDetailModal";

const UserTable = ({ users, onSelectUser  }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  useEffect(() => {
  console.log("selectedUserId updated:", selectedUserId);
}, [selectedUserId]);
  return (
    <>
    
    <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-colors">
      <thead>
        <tr className="bg-gray-100 dark:bg-gray-700">
          <th className="border border-gray-300 dark:border-gray-700 p-2">#</th>
          <th className="border border-gray-300 dark:border-gray-700 p-2">Name</th>
          <th className="border border-gray-300 dark:border-gray-700 p-2">Email</th>
          <th className="border border-gray-300 dark:border-gray-700 p-2">Type</th>
          <th className="border border-gray-300 dark:border-gray-700 p-2">Department</th>
          <th className="border border-gray-300 dark:border-gray-700 p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((u, i) => (
            <tr key={u.id || i} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <td className="border border-gray-300 dark:border-gray-700 p-2">{i + 1}</td>
              <td className="border border-gray-300 dark:border-gray-700 p-2">{u.fullName}</td>
              <td className="border border-gray-300 dark:border-gray-700 p-2">{u.email}</td>
              <td className="border border-gray-300 dark:border-gray-700 p-2">{u.type}</td>
              <td className="border border-gray-300 dark:border-gray-700 p-2">{u.department?.name || "-"}</td>
              <td className="border border-gray-300 dark:border-gray-700 p-2">
              <button
                onClick={() => onSelectUser(u.id)}
                className="bg-green-500 text-white px-3 py-2 rounded-lg"
              >
                Xem chi tiết
              </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center p-4 text-gray-500 dark:text-gray-300">
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
