// src/features/user/hooks/useUserDetail.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../store/userSlice";

export const useUserDetail = (userId, isOpen) => {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (isOpen && userId) {
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId, isOpen]);

  return { currentUser, loading, error };
};
