// src/features/document/hooks/useDocument.js
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo, useState } from "react";
import {
  addCompetency,
  fetchCompetencyTypes,
  fetchMyCompetencies,
} from "../store/competencySlice";
import { uploadDocumentsAsync } from "../store/documentSlice";
import { showError, showSuccess } from "../../../utils/toastUtils";

export const useCompetency = () => {
  const dispatch = useDispatch();
  const { items, types, loading, error, success } = useSelector(
    (state) => state.competency
  );

  const getMyCompetencies = useCallback(
    (force = false) => {
      if (force || items.length === 0) {
        dispatch(fetchMyCompetencies());
      }
    },
    [dispatch, items.length]
  );

  const getTypes = useCallback(
    (force = false) => {
      if (force || types.length === 0) {
        dispatch(fetchCompetencyTypes());
        console.log("Types: ", types);
      }
    },
    [dispatch, types.length]
  );

  // --- Upload file + thêm competency ---
  const create = async (formData) => {
    let documentId = formData.documentId;

    try {
      // 🔹 Nếu có file => upload trước
      if (formData.file) {
        const fd = new FormData();
        fd.append("files", formData.file);
        const uploadedIds = await dispatch(uploadDocumentsAsync(fd)).unwrap();
        documentId = uploadedIds?.[0];
      }

      // 🔹 Gom dữ liệu gửi backend
      const payload = {
        ...formData,
        documentId,
      };
      delete payload.file;

      // 🔹 Gửi tạo competency
      const result = await dispatch(
        addCompetency({ competency: payload })
      ).unwrap();

      showSuccess("Add new competency successfully");
      await dispatch(fetchMyCompetencies());

      return result;
    } catch (err) {
      showError("❌ Lỗi tạo competency:", err);
      console.error("❌ Lỗi tạo competency:", err);
      throw err;
    }
  };

  const state = useMemo(
    () => ({
      items,
      types,
    }),
    [items, types]
  );
  return {
    ...state,
    loading,
    error,
    success,
    create,
    getMyCompetencies,
    loadTypes: getTypes,
  };
};
