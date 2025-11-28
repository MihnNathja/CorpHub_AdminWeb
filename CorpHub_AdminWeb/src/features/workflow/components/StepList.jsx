import { useState, useEffect } from "react";
import StepCard from "./StepCard";
import { PlusCircle } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function StepList({
    steps = [],
    onEdit,
    onDelete,
    onAdd,
    updateStep
}) {

    // 🔥 UI LOCAL STATE – KHÔNG BỊ RE-RENDER TỪ REDUX
    const [uiSteps, setUiSteps] = useState([]);

    // 🔥 Khi steps từ Redux thay đổi → sync 1 lần
    useEffect(() => {
        setUiSteps([...steps].sort((a, b) => a.stepOrder - b.stepOrder));
    }, [steps]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destIndex = result.destination.index;

        if (sourceIndex === destIndex) return;

        // 1️⃣ REORDER UI NGAY LẬP TỨC – KHÔNG ĐỢI REDUX
        const newList = Array.from(uiSteps);
        const [moved] = newList.splice(sourceIndex, 1);
        newList.splice(destIndex, 0, moved);

        // Update stepOrder UI ngay lập tức
        const updatedUI = newList.map((s, idx) => ({
            ...s,
            stepOrder: idx + 1,
        }));

        setUiSteps(updatedUI); // ⬅ UI mượt tuyệt đối

        // 2️⃣ GỬI API CHỈ CHO 2 STEP – CHẠY NỀN
        const movedStep = uiSteps[sourceIndex];
        const targetStep = uiSteps[destIndex];

        updateStep(movedStep.id, {
            ...movedStep,
            stepOrder: destIndex + 1,
        });

        updateStep(targetStep.id, {
            ...targetStep,
            stepOrder: sourceIndex + 1,
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Workflow Steps
                </h3>

                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl 
                        bg-blue-500 text-white hover:bg-blue-600 shadow"
                >
                    <PlusCircle size={18} /> Thêm Step
                </button>
            </div>

            {uiSteps.length === 0 && (
                <div className="text-gray-500 dark:text-gray-400 text-center mt-10">
                    Chưa có step nào.
                </div>
            )}

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="stepList">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="flex flex-col gap-4"
                        >
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
                                            {...provided.dragHandleProps}
                                            className={`transition ${snapshot.isDragging
                                                    ? "scale-[1.02] shadow-lg"
                                                    : ""
                                                }`}
                                        >
                                            <StepCard
                                                step={step}
                                                onEdit={() => onEdit(step)}
                                                onDelete={() => onDelete(step.id)}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}

                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}
