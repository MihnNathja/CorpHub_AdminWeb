const UserTable = ({ users, onEdit }) => {
  return (
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
                  onClick={() => onEdit(u)}
                  className="px-3 py-1 bg-orange-500 dark:bg-orange-400 text-white rounded hover:bg-yellow-600 dark:hover:bg-orange-500 transition-colors"
                >
                  Edit
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
  );
};

export default UserTable;
