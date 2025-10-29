import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCategories } from "../store/assetSlice";

export const useAssetsCategory = () => {
    const dispatch = useDispatch();

    const { categories, loading, error } = useSelector(
        (state) => state.assets
    );

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);


    return {
        categories,
        loading,
        error,
        refreshCategories: () => dispatch(fetchCategories()),
    };
};
