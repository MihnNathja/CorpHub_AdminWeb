import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPositionChangeRequest,
  fetchPositionChangeRequestsByEmployee,
} from "../store/positionChangeRequestSlice";
import {
  getRequest,
  getApprovalStepsByRequest,
} from "../services/positionChangeRequestApi";

export const usePositionChangeRequest = () => {
  const dispatch = useDispatch();
  const { items, current, loading, error } = useSelector(
    (state) => state.positionChangeRequest
  );

  return {
    items,
    current,
    loading,
    error,
    createRequest: (data) => dispatch(createPositionChangeRequest(data)),
    getRequestsByEmployee: (id) =>
      dispatch(fetchPositionChangeRequestsByEmployee(id)),
    getRequestDetail: useCallback(async (id) => {
      const res = await getRequest(id);
      return res?.data?.data || res?.data;
    }, []),
    getApprovalSteps: useCallback(async (requestId) => {
      const res = await getApprovalStepsByRequest(requestId);
      return res?.data?.data || res?.data || [];
    }, []),
  };
};
