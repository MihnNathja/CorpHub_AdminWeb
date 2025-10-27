import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeUserActive, fetchUsers } from "../store/userSlice";

export const useUser = () => {
  const dispatch = useDispatch();

  const {
    list: employees,
    loading,
    error,
  } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const toggleActive = (id) => dispatch(changeUserActive({ id }));

  return {
    employees,
    loading,
    error,
    toggleActive,
  };
};
