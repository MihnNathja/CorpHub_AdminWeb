import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { createAsset, deleteAsset, fetchAssets, fetchCategories, updateAsset } from "../store/assetSlice";
import { showError, showSuccess } from "../../../utils/toastUtils";

export const useAssets = () => {
    const dispatch = useDispatch();

    const { assets, meta, categories, loading, error } = useSelector(
        (state) => state.assets
    );

    const [selectedAsset, setSelectedAsset] = useState(null);
    const [editingId, setEditingId] = useState(false);

    const [page, setPage] = useState(meta.page ?? 0);
    const [size, setSize] = useState(meta.size ?? 9);
    const totalPages = meta.totalPages ?? 1;


    const refreshAssets = useCallback(() => {
        dispatch(fetchAssets({ page, size }));
    }, [dispatch, page, size]);

    const refreshCategories = useCallback(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        refreshAssets();
    }, [refreshAssets]);

    useEffect(() => {
        refreshCategories();
    }, [refreshCategories]);

    const addAsset = async (data) => {
        try {
            await dispatch(createAsset(data)).unwrap();
            showSuccess("Add asset successfully");
            await refreshAssets();

        } catch (error) {
            console.error("Failed to add asset:", error);
            showError("Failed to add asset");
        }
    };
    const editAsset = async (data) => {
        try {
            await dispatch(updateAsset(data)).unwrap();
            showSuccess("Update asset successfully");
        } catch (error) {
            console.error("Failed to edit asset:", error);
            showError("Failed to edit asset");
        }
    };
    const removeAsset = async (id) => {
        try {
            await dispatch(deleteAsset(id)).unwrap();
            showSuccess("Remove asset successfully");
        } catch (error) {
            console.error("Failed to remove asset:", error);
            showError("Failed to remove asset");
        }
    };

    return {
        assets,
        categories,
        loading,
        error,

        page,
        size,
        totalPages,
        setPage,
        setSize,

        selectedAsset,
        setSelectedAsset,

        refreshAssets,
        refreshCategories,
        addAsset,
        editAsset,
        removeAsset,
    };
};
