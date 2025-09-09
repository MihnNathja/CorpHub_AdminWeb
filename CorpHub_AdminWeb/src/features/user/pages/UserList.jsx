import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, addUser } from "../store/userSlice";
import UserTable from "../components/UserTable";
import UserFormModal from "../components/UserFormModal";

const UserList = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAddUser = (userData) => {
    dispatch(addUser(userData));
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-gray-100">User Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 dark:bg-green-500 text-white dark:hover:bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Add User
        </button>
      </div>

      {loading && <p className="dark:text-gray-200">Loading...</p>}
      {error && <p className="text-red-500 dark:text-red-400">Error: {error}</p>}
      {!loading && !error && <UserTable users={list} />}

      {isModalOpen && (
        <UserFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddUser}
        />
      )}
    </div>
  );
};

export default UserList;
