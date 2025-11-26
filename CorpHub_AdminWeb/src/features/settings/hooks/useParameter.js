// src/features/parameters/hooks/useParameter.js
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import { loadParameters } from "../store/parameterSlice";

export const useParameter = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.parameter);

  // Gọi load khi cần (có thể gọi thủ công hoặc tự động)
  const getParameters = useCallback(() => {
    dispatch(loadParameters());
  }, [dispatch]);

  // Tự động load nếu chưa có
  useEffect(() => {
    if (items.length === 0 && !loading) {
      dispatch(loadParameters());
    }
  }, [dispatch, items.length, loading]);

  // Gom nhóm để UI dùng nhanh
  const grouped = items.reduce((acc, p) => {
    acc[p.group] = acc[p.group] || [];
    acc[p.group].push(p);
    return acc;
  }, {});

  return { parameters: items, grouped, loading, error, reload: getParameters };
};
