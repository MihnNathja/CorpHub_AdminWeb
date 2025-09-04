// src/features/user/pages/UserList.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../store/userSlice";
import UserTable from "../components/UserTable";

const UserList = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && <UserTable users={list} />}
    </div>
  );
};

export default UserList;
