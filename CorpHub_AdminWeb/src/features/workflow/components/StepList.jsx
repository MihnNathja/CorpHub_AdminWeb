import { useState, useEffect } from "react";
import StepCard from "./StepCard";
import { PlusCircle, GripVertical, AlertCircle } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";

export default function StepList({
    steps = [],
    onEdit,
    onDelete,
    onAdd,
    updateStep
}) {
    // UI LOCAL STATE
    const [uiSteps, setUiSteps] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    // Sync with Redux when steps change
    useEffect(() => {
        setUiSteps([...steps].sort((a, b) => a.stepOrder - b.stepOrder));
    }, [steps]);

    const handleDragStart = () => {
        setIsDragging(true);
        // Add haptic feedback on supported devices
        if (window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
    };

    const handleDragEnd = (result) => {
        setIsDragging(false);

        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destIndex = result.destination.index;

        if (sourceIndex === destIndex) return;

        // 1. Reorder UI immediately - NO ANIMATION DELAY
        const newList = Array.from(uiSteps);
        const [moved] = newList.splice(sourceIndex, 1);
        newList.splice(destIndex, 0, moved);

        // Update stepOrder for all steps
        const updatedUI = newList.map((s, idx) => ({
            ...s,
            stepOrder: idx + 1,
        }));

        // Immediate UI update
        setUiSteps(updatedUI);

        // 2. Debounced backend update - fire and forget
        setTimeout(() => {
            updatedUI.forEach((step) => {
                const originalStep = steps.find(s => s.id === step.id);
                if (originalStep && step.stepOrder !== originalStep.stepOrder) {
                    updateStep(step.id, {
                        ...step,
                        stepOrder: step.stepOrder,
                    }).catch(err => {
                        console.error('Failed to update step order:', err);
                    });
                }
            });
        }, 100);
    };

    return (
        <div className="space-y-4">
            {/* Empty State */}
            {uiSteps.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-12 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center space-y-3"
                >
                    <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 inline-block">
                        <AlertCircle className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">
                            No steps configured
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Add your first workflow step to get started
                        </p>
                    </div>
                    <button
                        onClick={onAdd}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg 
                            bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold
                            transition-colors shadow-md hover:shadow-lg"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Add First Step
                    </button>
                </motion.div>
            ) : (
                <>
                    {/* Drag Hint */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                    >
                        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                            <GripVertical className="w-4 h-4" />
                            <span className="font-medium">
                                Drag & drop to reorder steps
                            </span>
                        </div>
                        <div className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/40 text-xs font-semibold text-blue-700 dark:text-blue-300">
                            {uiSteps.length} step{uiSteps.length !== 1 ? 's' : ''}
                        </div>
                    </motion.div>

                    {/* Steps List */}
                    <DragDropContext
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <Droppable droppableId="stepList">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`
                                        space-y-3 transition-all duration-150
                                        ${snapshot.isDraggingOver
                                            ? "bg-indigo-50/50 dark:bg-indigo-900/10 ring-2 ring-indigo-200 dark:ring-indigo-800 rounded-xl p-4"
                                            : "p-0"
                                        }
                                    `}
                                >
                                    {/* Remove AnimatePresence for smoother drag */}
                                    {uiSteps.map((step, index) => (
                                        <Draggable
                                            key={step.id}
                                            draggableId={step.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`
                                                        relative transition-all duration-150
                                                        ${snapshot.isDragging
                                                            ? "scale-105 rotate-2 shadow-2xl z-50 opacity-90"
                                                            : "shadow-sm"
                                                        }
                                                    `}
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                        // Force hardware acceleration
                                                        transform: provided.draggableProps.style?.transform,
                                                        transition: snapshot.isDragging ? 'none' : 'transform 0.15s ease',
                                                    }}
                                                >
                                                    {/* Drag Handle Overlay */}
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        className={`
                                                            absolute left-0 top-0 bottom-0 w-12 
                                                            flex items-center justify-center
                                                            bg-gradient-to-r from-indigo-100 to-transparent 
                                                            dark:from-indigo-900/50 dark:to-transparent
                                                            border-r-2 border-indigo-200 dark:border-indigo-700
                                                            rounded-l-xl cursor-grab active:cursor-grabbing
                                                            transition-opacity duration-150
                                                            ${snapshot.isDragging ? "opacity-100" : "opacity-0 hover:opacity-100"}
                                                        `}
                                                    >
                                                        <GripVertical className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                    </div>

                                                    {/* Step Order Badge */}
                                                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-10">
                                                        <div className={`
                                                            w-8 h-8 rounded-full flex items-center justify-center
                                                            text-xs font-bold shadow-lg border-2 border-white dark:border-gray-900
                                                            transition-all duration-150
                                                            ${snapshot.isDragging
                                                                ? "bg-indigo-600 text-white scale-110"
                                                                : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300"
                                                            }
                                                        `}>
                                                            {step.stepOrder}
                                                        </div>
                                                    </div>

                                                    {/* Step Card */}
                                                    <div className="pl-8">
                                                        <StepCard
                                                            step={step}
                                                            onEdit={() => onEdit(step)}
                                                            onDelete={() => onDelete(step.id)}
                                                            isDragging={snapshot.isDragging}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}

                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </>
            )}
        </div>
    );
}
