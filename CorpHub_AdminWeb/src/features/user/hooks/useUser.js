import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
} from "../store/userSlice";

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

  return {
    employees,
    loading,
    error,
  };
};
