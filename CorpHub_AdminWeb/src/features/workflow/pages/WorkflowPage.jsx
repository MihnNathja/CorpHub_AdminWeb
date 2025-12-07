"use client";
import { useState, useEffect } from "react";
import { Workflow, Plus, AlertCircle, Loader } from "lucide-react";
import { motion } from "framer-motion";

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

    const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg border border-white/10">
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm">
                        <Workflow className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-white/80 uppercase tracking-wide">Automation</p>
                        <h1 className="text-3xl font-bold">Workflow Management</h1>
                    </div>
                </div>
                <p className="text-sm text-white/70 ml-16">
                    Create and manage workflow templates and automation steps
                </p>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* SIDEBAR */}
                <div className="lg:col-span-4 xl:col-span-3">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden sticky top-6 max-h-[calc(100vh-180px)]">
                        <TemplateSidebar
                            templates={templates}
                            loading={loadingTemplates}
                            selectedId={selectedTemplateId}
                            onSelect={setSelectedTemplateId}
                            onRefresh={reloadTemplates}
                        />
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                    {selectedTemplateId ? (
                        <>
                            {/* Template Detail Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
                            >
                                <TemplateDetail template={selectedTemplate} />
                            </motion.div>

                            {/* Steps Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
                            >
                                {/* Steps Header */}
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-indigo-600 dark:bg-indigo-600 text-white">
                                                <Workflow className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    Workflow Steps
                                                </h2>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                                    {steps?.length || 0} step(s) configured
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setEditingStep(null);
                                                setOpenModal(true);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-md hover:shadow-lg"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Step
                                        </button>
                                    </div>
                                </div>

                                {/* Steps Content */}
                                <div className="p-6">
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
                                </div>
                            </motion.div>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-16 text-center space-y-4"
                        >
                            {loadingTemplates ? (
                                <>
                                    <Loader className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mx-auto animate-spin" />
                                    <div>
                                        <p className="font-semibold text-gray-700 dark:text-gray-300">
                                            Loading Templates...
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Please wait while we fetch your workflows
                                        </p>
                                    </div>
                                </>
                            ) : templates.length === 0 ? (
                                <>
                                    <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto" />
                                    <div>
                                        <p className="font-semibold text-gray-700 dark:text-gray-300">
                                            No Templates Available
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Create your first workflow template to get started
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Workflow className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto" />
                                    <div>
                                        <p className="font-semibold text-gray-700 dark:text-gray-300">
                                            Select a Workflow Template
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Choose a template from the sidebar to view and manage its steps
                                        </p>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </div>
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