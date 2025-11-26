// src/features/admin-competency/hooks/useAdminCompetency.js

import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  approveCompetency,
  getAllPendingCompetencies,
  rejectCompetency,
} from "../store/employeeSlice";

export const useAdminCompetencyEmployee = () => {
  const dispatch = useDispatch();

  const { pendingCompetencies, loading, error } = useSelector(
    (state) => state.employees
  );

  const loadPending = useCallback(() => {
    dispatch(getAllPendingCompetencies());
  }, [dispatch]);

  // Approve competency
  const approve = useCallback(
    (competencyId) => {
      return dispatch(approveCompetency(competencyId));
    },
    [dispatch]
  );

  // Reject competency
  const reject = useCallback(
    (competencyId, reason) => {
      return dispatch(rejectCompetency({ competencyId, reason }));
    },
    [dispatch]
  );

  return {
    pendingCompetencies,
    loading,
    error,
    loadPending,
    approve,
    reject,
  };
};
