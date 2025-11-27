"use client";
import { useState, useEffect } from "react";

import TemplateSidebar from "../components/TemplateSidebar";
import TemplateDetail from "../components/TemplateDetail";
import StepList from "../components/StepList";
import StepEditorModal from "../components/StepEditorModal";
import { useWorkflowTemplates } from "../hooks/useWorkflowTemplates";
import { useWorkflowSteps } from "../hooks/useWorkflowStep";

const WorkflowPage = () => {
    const {
        items: templates,
        loading: loadingTemplates,
        reload: reloadTemplates,
    } = useWorkflowTemplates();

    const [selectedTemplateId, setSelectedTemplateId] = useState(null);

    const {
        items: steps,
        loadSteps,
        createStep,
        updateStep,
        deleteStepById,
    } = useWorkflowSteps();

    const [openModal, setOpenModal] = useState(false);
    const [editingStep, setEditingStep] = useState(null);

    // Load steps when template changes
    useEffect(() => {
        if (selectedTemplateId) {
            loadSteps(selectedTemplateId);
        }
    }, [selectedTemplateId]);

    console.log("Current steps:", steps);

    return (
        <div className="flex h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900">
            {/* SIDEBAR */}
            <TemplateSidebar
                templates={templates}
                loading={loadingTemplates}
                selectedId={selectedTemplateId}
                onSelect={setSelectedTemplateId}
                onRefresh={reloadTemplates}
            />

            {/* RIGHT CONTENT */}
            <div className="flex-1 p-6 overflow-y-auto">
                {selectedTemplateId ? (
                    <>
                        <TemplateDetail
                            template={templates.find(t => t.id === selectedTemplateId)}
                        />

                        <StepList
                            steps={steps}
                            onEdit={(s) => {
                                setEditingStep(s);
                                setOpenModal(true);
                            }}
                            onDelete={deleteStepById}
                            onAdd={() => {
                                setEditingStep(null);
                                setOpenModal(true);
                            }}
                            updateStep={updateStep}
                        />
                    </>
                ) : (
                    <div className="text-gray-600 dark:text-gray-300 text-center mt-20">
                        Chọn một workflow template để xem chi tiết.
                    </div>
                )}
            </div>

            {/* MODAL */}
            <StepEditorModal
                open={openModal}
                setOpen={setOpenModal}
                templateId={selectedTemplateId}
                step={editingStep}
                onCreate={createStep}
                onUpdate={updateStep}
            />
        </div>
    );
}

export default WorkflowPage;