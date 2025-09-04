import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, addUser } from "../store/userSlice";
import UserTable from "../components/UserTable";
import UserFormModal from "../components/UserFormModal"; // component modal mới

const UserList = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAddUser = (userData) => {
    dispatch(addUser(userData)); // gọi action thêm user
    setIsModalOpen(false);       // đóng modal sau khi thêm
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add User
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
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
