import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeUserActive, fetchUsers } from "../store/userSlice";

export const useUser = () => {
  const dispatch = useDispatch();

  const { list, loading, error } = useSelector((state) => state.user);

  useEffect(
    (params = { page: 0, keyword: "", filters: {}, sort: {} }) => {
      dispatch(fetchUsers(params));
    },
    [dispatch]
  );

  const toggleActive = (id) => dispatch(changeUserActive({ id }));

  return {
    list,
    loading,
    error,
    toggleActive,
  };
};
