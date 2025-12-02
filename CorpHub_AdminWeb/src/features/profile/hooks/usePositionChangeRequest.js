import { useDispatch, useSelector } from "react-redux";
import {
  createPositionChangeRequest,
  fetchPositionChangeRequestsByEmployee,
} from "../store/positionChangeRequestSlice";

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
  };
};
