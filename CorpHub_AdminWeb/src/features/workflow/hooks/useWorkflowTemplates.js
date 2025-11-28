// src/features/workflow/hooks/useWorkflowTemplates.js
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";

import {
    fetchWorkflowTemplates,
    createWorkflowTemplate,
    updateWorkflowTemplate,
    deleteWorkflowTemplate,
    resetWorkflowTemplateState,
} from "../store/workflowTemplateSlice";

export function useWorkflowTemplates() {
    const dispatch = useDispatch();

    const { items, loading, error } = useSelector(
        (state) => state.workflowTemplate
    );

    /* ==========================
       LOAD ALL 
    =========================== */
    useEffect(() => {
        dispatch(fetchWorkflowTemplates());
    }, [dispatch]);

    /* ==========================
       CRUD ACTIONS
    =========================== */

    const createTemplate = useCallback(
        (data) => dispatch(createWorkflowTemplate(data)),
        [dispatch]
    );

    const updateTemplate = useCallback(
        (id, data) => dispatch(updateWorkflowTemplate({ id, data })),
        [dispatch]
    );

    const deleteTemplateById = useCallback(
        (id) => dispatch(deleteWorkflowTemplate(id)),
        [dispatch]
    );

    const reload = useCallback(
        () => dispatch(fetchAllWorkflowTemplates()),
        [dispatch]
    );

    const resetState = useCallback(
        () => dispatch(resetWorkflowTemplateState()),
        [dispatch]
    );

    /* ==========================
       RETURN API
    =========================== */
    return {
        items,
        loading,
        error,

        // load
        reload,

        // crud
        createTemplate,
        updateTemplate,
        deleteTemplateById,

        // reset
        resetState,
    };
}
