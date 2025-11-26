import { useDispatch, useSelector } from "react-redux";
import {
  createPosition,
  deletePosition,
  fetchPositions,
  reorderPositions,
  setLocalReorder,
  updatePosition,
} from "../store/departmentPositionSlice";
import { useEffect } from "react";

export function useDepartmentPositions(departmentId) {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.positions);

  useEffect(() => {
    if (!departmentId) return;
    dispatch(fetchPositions(departmentId));
  }, [departmentId, dispatch]);

  // Local reorder
  const handleReorderLocal = (orderedIds) => {
    const map = new Map(list.map((p) => [p.id, p]));

    const newList = orderedIds.map((id, index) => {
      const pos = map.get(id);
      return {
        ...pos,
        levelOrder: index,
      };
    });

    // update Redux local state
    dispatch(setLocalReorder(newList));
  };

  const handleReorderSave = (orderedIds) =>
    dispatch(reorderPositions({ departmentId, orderedIds }));

  return {
    positions: list,
    loading,
    load: () => dispatch(fetchPositions(departmentId)),
    add: (payload) => dispatch(createPosition({ departmentId, payload })),
    update: (id, payload) => dispatch(updatePosition({ id, payload })),
    remove: (id) => dispatch(deletePosition(id)),
    reorder: (orderedIds) =>
      dispatch(reorderPositions({ departmentId, orderedIds })),

    // expose reorder helpers
    handleReorderLocal,
    handleReorderSave,
  };
}
