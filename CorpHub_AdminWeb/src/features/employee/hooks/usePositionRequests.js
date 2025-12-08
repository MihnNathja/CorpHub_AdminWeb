import { useEffect, useState, useCallback } from "react";
import {
  getPositionChangeRequestsByEmployee,
  getPositionChangeRequest,
  getApprovalStepsByRequest,
  getAllPositionChangeRequests,
} from "../services/employeeApi";

export default function usePositionRequests() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all requests (global list) with optional status filter
  const loadAll = useCallback(async (status) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await getAllPositionChangeRequests(status);
      // backend wraps in ApiResponse => resp.data.data
      const data = resp?.data?.data || resp?.data || [];
      setItems(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load by specific employee (still available for modal/detail)
  const loadByEmployee = useCallback(async (employeeId) => {
    if (!employeeId) {
      setItems([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const resp = await getPositionChangeRequestsByEmployee(employeeId);
      const data = resp?.data?.data || resp?.data || [];
      setItems(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDetail = useCallback(async (id) => {
    try {
      const resp = await getPositionChangeRequest(id);
      return resp?.data?.data || resp?.data;
    } catch (err) {
      throw err;
    }
  }, []);

  const getSteps = useCallback(async (requestId) => {
    try {
      const resp = await getApprovalStepsByRequest(requestId);
      return resp?.data?.data || resp?.data || [];
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    items,
    loading,
    error,
    loadAll,
    loadByEmployee,
    getDetail,
    getSteps,
  };
}
