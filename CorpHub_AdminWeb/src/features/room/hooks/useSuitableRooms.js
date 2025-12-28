import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSuitableRooms } from "../store/roomSlice";

export const useSuitableRooms = (id) => {
  const dispatch = useDispatch();

  const { suitableRooms, loadingSuitable } = useSelector((state) => state.rooms);

  useEffect(() => {
    if (!id) return;                 
    dispatch(fetchSuitableRooms(id)); 
  }, [id, dispatch]);

  return { suitableRooms, loadingSuitable };
};
