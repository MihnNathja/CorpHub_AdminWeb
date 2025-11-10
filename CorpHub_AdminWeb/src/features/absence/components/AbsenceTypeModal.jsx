import React, { useState, useEffect } from "react";

const AbsenceTypeModal = ({ show, onClose, onSubmit, initialData }) => {
    const [form, setForm] = useState({
        code: "",
        name: "",
        description: "",
        requireProof: false,
        requireApprovalLv: 1,
        affectQuota: true,
        maxPerRequest: 1,
        genderLimit: "ALL",
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else
            setForm({
                code: "",
                name: "",
                description: "",
                requireProof: false,
                requireApprovalLv: 1,
                affectQuota: true,
                maxPerRequest: 1,
                genderLimit: "ALL",
            });
    }, [initialData]);

    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    {initialData ? "Edit Absence Type" : "Add Absence Type"}
                </h4>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Code */}
                    <div>
                        <label className="block text-sm mb-1">Code</label>
                        <input
                            type="text"
                            value={form.code}
                            onChange={(e) =>
                                setForm({ ...form, code: e.target.value })
                            }
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 
                            bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                            required
                        />
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm mb-1">Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 
                            bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm mb-1">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 
                            bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 resize-none"
                            rows="3"
                            required
                        />
                    </div>

                    {/* Require Proof + Affect Quota */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm mb-1">
                                Require Proof
                            </label>
                            <select
                                value={form.requireProof}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        requireProof: e.target.value === "true",
                                    })
                                }
                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 
                                bg-gray-50 dark:bg-gray-900"
                            >
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">
                                Affect Quota
                            </label>
                            <select
                                value={form.affectQuota}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        affectQuota: e.target.value === "true",
                                    })
                                }
                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 
                                bg-gray-50 dark:bg-gray-900"
                            >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                    </div>

                    {/* Approval Level + Max Days */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm mb-1">
                                Approval Level
                            </label>
                            <select
                                value={form.requireApprovalLv}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        requireApprovalLv: Number(e.target.value),
                                    })
                                }
                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 
                                bg-gray-50 dark:bg-gray-900"
                            >
                                <option value={1}>1 Level</option>
                                <option value={2}>2 Levels</option>
                                <option value={3}>3 Levels</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">
                                Max Days per Request
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={form.maxPerRequest}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        maxPerRequest: Number(e.target.value),
                                    })
                                }
                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 
                                bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm mb-1">Gender</label>
                        <select
                            value={form.genderLimit}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    genderLimit: e.target.value,
                                })
                            }
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 
                            bg-gray-50 dark:bg-gray-900"
                        >
                            <option value="ALL">All</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 
                            text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 
                            text-white rounded-lg"
                        >
                            {initialData ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AbsenceTypeModal;
