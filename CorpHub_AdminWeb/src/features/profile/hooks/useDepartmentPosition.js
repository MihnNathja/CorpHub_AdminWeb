// src/hooks/useDepartmentPositions.js

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchDepartmentsWithPositions } from "../store/departmentWithPositionSlice";

export const useDepartmentPositions = () => {
  const dispatch = useDispatch();

  const { list, loading, error } = useSelector(
    (state) => state.departmentPosition
  );

  useEffect(() => {
    dispatch(fetchDepartmentsWithPositions());
  }, [dispatch]);

  return { departments: list, loading, error };
};
