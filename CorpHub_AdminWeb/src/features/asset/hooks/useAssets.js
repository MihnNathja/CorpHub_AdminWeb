import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { createAsset, deleteAsset, fetchAssets, fetchCategories, removeFromRoom, updateAsset } from "../store/assetSlice";
import { showError, showSuccess } from "../../../utils/toastUtils";
import { set } from "date-fns";

export const useAssets = () => {
    const dispatch = useDispatch();

    const { assets, meta, categories, loading, error } = useSelector(
        (state) => state.assets
    );

    const [selectedAsset, setSelectedAsset] = useState(null);
    const [editingId, setEditingId] = useState(false);

    const [page, setPage] = useState(meta.page ?? 0);
    const [size, setSize] = useState(meta.size ?? 9);
    const [keywords, setKeywords] = useState("");
    const totalPages = meta.totalPages ?? 1;

    // Bộ lọc nâng cao
    const [filters, setFilters] = useState({
        categoryId: "",
        status: "",
    });

    // ✅ Hàm cập nhật bộ lọc
    const updateFilters = useCallback((newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setPage(0);
    }, []);

    const clearFilters = () => {
        const cleared = {
            categoryId: "",
            status: "",
        };

        setKeywords("");
        setFilters(cleared);
        updateFilters(cleared);
        setPage(0);
    };


    const refreshAssets = useCallback(() => {
        dispatch(fetchAssets({ page, size, keywords, ...filters }));
    }, [dispatch, page, size, keywords, filters]);

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
        keywords,
        filters,
        loading,
        error,

        page,
        size,
        totalPages,
        setPage,
        setSize,
        setKeywords,
        setFilters,

        selectedAsset,
        setSelectedAsset,
        clearFilters,
        updateFilters,

        refreshAssets,
        refreshCategories,
        addAsset,
        editAsset,
        removeAsset,

    };
};
