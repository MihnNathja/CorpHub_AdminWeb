import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";

import {
    fetchWorkflowStepById,
    createWorkflowStep,
    updateWorkflowStep,
    deleteWorkflowStep,
} from "../store/workflowStepSlice";

export function useWorkflowSteps() {
    const dispatch = useDispatch();

    const { items, loading, error } = useSelector(
        (state) => state.workflowStep
    );

    /* ==========================
       LOAD BY TEMPLATE ID
    =========================== */
    const loadSteps = useCallback(
        (templateId) => dispatch(fetchWorkflowStepById(templateId)),
        [dispatch]
    );

    /* ==========================
       CRUD ACTIONS
    =========================== */
    const createStep = useCallback(
        (data) => dispatch(createWorkflowStep(data)),
        [dispatch]
    );

    const updateStep = useCallback(
        (id, data) => dispatch(updateWorkflowStep({ id, data })),
        [dispatch]
    );

    const deleteStepById = useCallback(
        (id) => dispatch(deleteWorkflowStep(id)),
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
        loadSteps,

        // crud
        createStep,
        updateStep,
        deleteStepById,
    };
}
