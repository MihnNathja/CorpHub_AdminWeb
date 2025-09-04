// src/features/user/components/UserTable.jsx
const UserTable = ({ users }) => {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 p-2">#</th>
          <th className="border border-gray-300 p-2">Name</th>
          <th className="border border-gray-300 p-2">Email</th>
          <th className="border border-gray-300 p-2">Type</th>
          <th className="border border-gray-300 p-2">Department</th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((u, i) => (
            <tr key={u.id || i} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{i + 1}</td>
              <td className="border border-gray-300 p-2">{u.fullName}</td>
              <td className="border border-gray-300 p-2">{u.email}</td>
              <td className="border border-gray-300 p-2">{u.type}</td>
              <td className="border border-gray-300 p-2">{u.department?.name || "-"}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center p-4 text-gray-500">
              No users found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};


export default UserTable;
