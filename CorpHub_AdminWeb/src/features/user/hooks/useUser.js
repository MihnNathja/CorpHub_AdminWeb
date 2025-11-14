import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  changeUserActive,
  fetchUsers,
  resetUserPassword,
} from "../store/userSlice";

export const useUser = () => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");

  const { list, loading, error } = useSelector((state) => state.user);

  useEffect(
    (params = { page: 0, keyword, filters: {}, sort: {} }) => {
      dispatch(fetchUsers(params));
    },
    [dispatch, keyword]
  );
  const handleResetPassword = (userId) => {
    return dispatch(resetUserPassword(userId));
  };
  const toggleActive = (id) => dispatch(changeUserActive({ id }));

  return {
    list,
    loading,
    error,
    keyword,
    setKeyword,
    toggleActive,
    handleResetPassword,
  };
};
