import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments } from "../store/departmentSlice";

export const useDepartment = () => {
  const dispatch = useDispatch();
  const { departments, loading, error } = useSelector(
    (state) => state.department
  );

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const stableDepartments = useMemo(() => departments || [], [departments]);

  return { departments: stableDepartments, loading, error };
};
