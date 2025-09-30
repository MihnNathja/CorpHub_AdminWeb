import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../store/categorySlice";

export const useCategory = () => {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state) => state.category);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return { categories, loading, error };
};
