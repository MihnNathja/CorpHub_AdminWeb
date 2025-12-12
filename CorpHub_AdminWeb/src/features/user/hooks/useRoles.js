import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "../store/userSlice";

const useRoles = () => {
  const dispatch = useDispatch();
  const { roles, rolesLoading, rolesError } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (!roles || roles.length === 0) {
      dispatch(fetchRoles());
    }
  }, [dispatch, roles?.length]);

  const reloadRoles = useCallback(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  return { roles, rolesLoading, rolesError, reloadRoles };
};

export default useRoles;
