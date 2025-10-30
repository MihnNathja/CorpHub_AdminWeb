import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartments,
  loadDepartmentsWithUsers,
} from "../store/departmentSlice";

export const useDepartmentManagement = () => {
  const dispatch = useDispatch();
  const { departments, loading, error } = useSelector(
    (state) => state.department
  );

  useEffect(() => {
    dispatch(loadDepartmentsWithUsers());
  }, [dispatch]);

  const stableDepartments = useMemo(() => departments || [], [departments]);

  return { departments: stableDepartments, loading, error };
};
