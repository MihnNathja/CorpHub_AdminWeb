// src/features/document/hooks/useDocument.js
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo, useState } from "react";
import { fetchMyCompetencies } from "../store/competencySlice";

export const useCompetency = () => {
  const dispatch = useDispatch();
  const { items, types, loading, error } = useSelector(
    (state) => state.competency
  );

  const getMyCompetencies = useCallback(
    (force = false) => {
      if (force || items.length === 0) {
        dispatch(fetchMyCompetencies());
      }
    },
    [dispatch, items.length]
  );

  return { items, getMyCompetencies, loading, error };
};
