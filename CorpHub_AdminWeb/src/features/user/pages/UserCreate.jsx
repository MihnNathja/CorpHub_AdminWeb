import UserForm from "../components/UserForm";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../store/userSlice";

const UserCreate = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const handleCreate = (formData) => {
    dispatch(addUser(formData));
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Create New User</h1>
      {loading && <p className="text-blue-500">Creating user...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <UserForm onSubmit={handleCreate} />
    </div>
  );
};

export default UserCreate;
