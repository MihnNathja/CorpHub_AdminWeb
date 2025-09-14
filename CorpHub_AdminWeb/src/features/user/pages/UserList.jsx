import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, addUser } from "../store/userSlice";
import UserTable from "../components/UserTable";
import UserFormModal from "../components/UserFormModal";
import ButtonOutline from "../../global/components/ButtonOutline";

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
    <div className="text-gray-900 dark:text-gray-700">
      <h1 className="text-xl font-bold dark:text-gray-100">User Management</h1>
      <div className="flex justify-between items-center mb-4 mt-4">
        <ButtonOutline
          onClick={() => setIsModalOpen(true)}
          color={"green"}
        >
          Add User
        </ButtonOutline>
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
