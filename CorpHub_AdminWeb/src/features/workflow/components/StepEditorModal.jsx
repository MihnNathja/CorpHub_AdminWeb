import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";

export default function StepEditorModal({
    open,
    setOpen,
    templateId,
    step,
    onCreate,
    onUpdate,
}) {
    const isEdit = !!step;

    const [form, setForm] = useState({
        name: "",
        stepOrder: 1,
        stepType: "APPROVAL",
        assignedRole: "",
        conditionExpr: "",
    });

    useEffect(() => {
        if (step) setForm(step);
    }, [step]);

    const handleSubmit = () => {
        if (isEdit) onUpdate(step.id, form);
        else onCreate({ ...form, templateId });

        setOpen(false);
    };

    return (
        <Transition show={open} as={Fragment}>
            <Dialog onClose={() => setOpen(false)} className="relative z-50">
                <Transition.Child
                    enter="duration-200 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    as={Fragment}
                >
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        enter="duration-200 ease-out"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="duration-150 ease-in"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                        as={Fragment}
                    >
                        <Dialog.Panel
                            className="w-full max-w-lg rounded-2xl p-6 
                                bg-white dark:bg-gray-800 
                                border border-gray-200 dark:border-gray-700 shadow-xl"
                        >
                            <Dialog.Title className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                {isEdit ? "Sửa Step" : "Thêm Step"}
                            </Dialog.Title>

                            <div className="mt-4 space-y-4">

                                {/* NAME */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Tên Step
                                    </label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({ ...form, name: e.target.value })
                                        }
                                        className="w-full mt-1 p-2 rounded-lg 
                                            bg-gray-50 dark:bg-gray-700
                                            border border-gray-300 dark:border-gray-600
                                            text-gray-800 dark:text-gray-200"
                                    />
                                </div>

                                {/* ORDER */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Thứ tự
                                    </label>
                                    <input
                                        type="number"
                                        value={form.stepOrder}
                                        onChange={(e) =>
                                            setForm({ ...form, stepOrder: Number(e.target.value) })
                                        }
                                        className="w-full mt-1 p-2 rounded-lg 
                                            bg-gray-50 dark:bg-gray-700
                                            border border-gray-300 dark:border-gray-600
                                            text-gray-800 dark:text-gray-200"
                                    />
                                </div>

                                {/* TYPE */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Loại Step
                                    </label>
                                    <select
                                        value={form.stepType}
                                        onChange={(e) =>
                                            setForm({ ...form, stepType: e.target.value })
                                        }
                                        className="w-full mt-1 p-2 rounded-lg 
                                            bg-gray-50 dark:bg-gray-700
                                            border border-gray-300 dark:border-gray-600
                                            text-gray-800 dark:text-gray-200"
                                    >
                                        <option value="APPROVAL">APPROVAL</option>
                                        <option value="AUTO">AUTO</option>
                                        <option value="NOTIFY">NOTIFY</option>
                                    </select>
                                </div>

                                {/* ROLE */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Vai trò duyệt
                                    </label>
                                    <input
                                        type="text"
                                        value={form.assignedRole}
                                        onChange={(e) =>
                                            setForm({ ...form, assignedRole: e.target.value })
                                        }
                                        className="w-full mt-1 p-2 rounded-lg 
                                            bg-gray-50 dark:bg-gray-700
                                            border border-gray-300 dark:border-gray-600
                                            text-gray-800 dark:text-gray-200"
                                    />
                                </div>

                                {/* CONDITION */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Điều kiện
                                    </label>
                                    <textarea
                                        value={form.conditionExpr || ""}
                                        onChange={(e) =>
                                            setForm({ ...form, conditionExpr: e.target.value })
                                        }
                                        className="w-full mt-1 p-2 rounded-lg h-20
                                            bg-gray-50 dark:bg-gray-700
                                            border border-gray-300 dark:border-gray-600
                                            text-gray-800 dark:text-gray-200"
                                    />
                                </div>
                            </div>

                            {/* BUTTONS */}
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 rounded-lg border 
                                        border-gray-300 dark:border-gray-600 
                                        text-gray-700 dark:text-gray-300 
                                        hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Hủy
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 rounded-lg 
                                        bg-blue-500 hover:bg-blue-600 text-white shadow"
                                >
                                    Lưu
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
