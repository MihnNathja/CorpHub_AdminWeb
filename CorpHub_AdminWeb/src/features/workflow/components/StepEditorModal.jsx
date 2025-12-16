import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useUser } from "../../user/hooks/useUser";
import {
    UserCircle,
    Users,
    Building2,
    BadgeCheck,
    Filter,
    X,
    Save,
    Zap,
    Settings,
    CheckCircle2,
    Lock,
} from "lucide-react";
import { motion } from "framer-motion";

const APPROVER_TYPES = [
    { key: "USER", label: "User", icon: UserCircle, disabled: false, color: "blue" },
    { key: "USER_RELATION", label: "User relation", icon: Users, disabled: false, color: "purple" },
    { key: "POSITION", label: "Position", icon: BadgeCheck, disabled: true, color: "emerald" },
    { key: "POSITION_LEVEL", label: "Position level", icon: Filter, disabled: true, color: "amber" },
    { key: "DEPARTMENT", label: "By department", icon: Building2, disabled: true, color: "indigo" },
];

const USER_RELATION_OPTIONS = [
    { key: "DIRECT_MANAGER", label: "Direct manager" },
    { key: "DEPARTMENT_MANAGER", label: "Department head" },
];

const STEP_TYPES = [
    { value: "APPROVAL", label: "Approval", icon: CheckCircle2, color: "emerald" },
    { value: "AUTO", label: "Auto", icon: Zap, color: "blue" },
    { value: "NOTIFY", label: "Notify", icon: Settings, color: "purple" },
];

export default function StepEditorModal({
    open,
    setOpen,
    templateId,
    step,
    onCreate,
    onUpdate,
}) {
    const isEdit = !!step;
    const { list: users, keyword, setKeyword } = useUser();

    const [form, setForm] = useState({
        name: "",
        stepOrder: 1,
        stepType: "APPROVAL",
        conditionExpr: "",
        approver: {
            type: "USER",
            params: {},
        },
    });
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    useEffect(() => {
        if (step) setForm(step);
    }, [step]);

    const handleSubmit = () => {
        const payload = { ...form, templateId };
        isEdit ? onUpdate(step.id, payload) : onCreate(payload);
        setOpen(false);
    };

    const updateApproverParam = (key, val) => {
        setForm({
            ...form,
            approver: {
                ...form.approver,
                params: { ...form.approver.params, [key]: val },
            },
        });
    };

    const inputClass = "w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

    /* Dynamic Approver Fields */
    const ApproverFields = () => {
        const { type, params } = form.approver;

        switch (type) {
            case "USER":
                return (
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="🔍 Search user by name / email..."
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setShowUserDropdown(true);
                            }}
                            className={inputClass}
                        />

                        {showUserDropdown && users?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute mt-2 w-full bg-white dark:bg-gray-800 
                                    border border-gray-300 dark:border-gray-600 
                                    rounded-xl shadow-2xl max-h-64 overflow-auto z-20"
                            >
                                {users.map((u) => (
                                    <div
                                        key={u.id}
                                        onClick={() => {
                                            updateApproverParam("userId", u.id);
                                            setKeyword(u.fullName);
                                            setShowUserDropdown(false);
                                        }}
                                        className="p-3 flex items-center gap-3 cursor-pointer 
                                            hover:bg-blue-50 dark:hover:bg-blue-900/20 
                                            transition-colors border-b border-gray-100 dark:border-gray-700 
                                            last:border-0"
                                    >
                                        <img
                                            src={u.avatar || "/default-avatar.png"}
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                                            alt={u.fullName}
                                        />
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                {u.fullName || u.username}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {u.email}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                );

            case "USER_RELATION":
                return (
                    <select
                        value={params.key || ""}
                        onChange={(e) => updateApproverParam("key", e.target.value)}
                        className={inputClass}
                    >
                        <option value="">-- Select relation --</option>
                        {USER_RELATION_OPTIONS.map((opt) => (
                            <option key={opt.key} value={opt.key}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );

            case "POSITION":
                return (
                    <input
                        placeholder="Position code (e.g., IT_MANAGER)"
                        value={params.code || ""}
                        onChange={(e) => updateApproverParam("code", e.target.value)}
                        className={inputClass}
                    />
                );

            case "POSITION_LEVEL":
                return (
                    <input
                        placeholder="Level (e.g., 3)"
                        type="number"
                        value={params.levelOrder || ""}
                        onChange={(e) => updateApproverParam("levelOrder", Number(e.target.value))}
                        className={inputClass}
                    />
                );

            case "DEPARTMENT":
                return (
                    <select
                        value={params.role || ""}
                        onChange={(e) => updateApproverParam("role", e.target.value)}
                        className={inputClass}
                    >
                        <option value="">-- Select role --</option>
                        <option value="HEAD">Department Head</option>
                        <option value="DIRECTOR">Director</option>
                        <option value="MANAGER">Manager</option>
                    </select>
                );
        }
    };

    return (
        <Transition show={open} as={Fragment}>
            <Dialog onClose={() => setOpen(false)} className="relative z-50">
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-5xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-hidden flex flex-col">

                            {/* Header */}
                            <div className="px-8 py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-b border-white/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-sm">
                                            <Settings className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">
                                                {isEdit ? "Edit Workflow Step" : "Add Workflow Step"}
                                            </h2>
                                            <p className="text-sm text-white/70 mt-1">
                                                Configure step execution and approver
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Content - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                    {/* LEFT SIDE — Step Info */}
                                    <div className="space-y-6">
                                        <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
                                            <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wide mb-4 flex items-center gap-2">
                                                <Zap className="w-4 h-4" />
                                                Step Information
                                            </h3>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                        Step Name
                                                    </label>
                                                    <input
                                                        value={form.name}
                                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                        placeholder="e.g., Approved by manager"
                                                        className={inputClass}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                        Order
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={form.stepOrder}
                                                        onChange={(e) => setForm({ ...form, stepOrder: Number(e.target.value) })}
                                                        className={inputClass}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                        Step Type
                                                    </label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {STEP_TYPES.map(({ value, label, icon: Icon, color }) => {
                                                            const colorClasses = {
                                                                emerald: "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
                                                                blue: "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
                                                                purple: "border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
                                                            };

                                                            return (
                                                                <button
                                                                    key={value}
                                                                    type="button"
                                                                    onClick={() => setForm({ ...form, stepType: value })}
                                                                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${form.stepType === value
                                                                        ? colorClasses[color] + " ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                                                                        : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600"
                                                                        }`}
                                                                >
                                                                    <Icon className="w-5 h-5" />
                                                                    <span className="text-xs font-semibold">{label}</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                        Condition (Optional)
                                                    </label>
                                                    <textarea
                                                        value={form.conditionExpr || ""}
                                                        onChange={(e) => setForm({ ...form, conditionExpr: e.target.value })}
                                                        placeholder="e.g., value > 10000000"
                                                        rows={3}
                                                        className={inputClass}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT SIDE — Approver Settings */}
                                    <div className="space-y-6">
                                        <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                                            <h3 className="text-sm font-bold text-purple-900 dark:text-purple-100 uppercase tracking-wide mb-4 flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                Approver
                                            </h3>

                                            {/* Approver Type Grid */}
                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                {APPROVER_TYPES.map(({ key, label, icon: Icon, disabled, color }) => {
                                                    const isSelected = form.approver.type === key;

                                                    return (
                                                        <button
                                                            key={key}
                                                            type="button"
                                                            disabled={disabled}
                                                            onClick={() => {
                                                                if (!disabled) {
                                                                    setForm({ ...form, approver: { type: key, params: {} } });
                                                                }
                                                            }}
                                                            className={`p-3 rounded-lg border-2 flex items-center gap-2 transition-all ${disabled
                                                                ? "opacity-40 cursor-not-allowed"
                                                                : isSelected
                                                                    ? "border-purple-400 dark:border-purple-600 bg-purple-100 dark:bg-purple-900/40 ring-2 ring-purple-200 dark:ring-purple-800"
                                                                    : "border-gray-300 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                                                                }`}
                                                        >
                                                            <Icon className={`w-4 h-4 ${isSelected ? "text-purple-700 dark:text-purple-300" : "text-gray-600 dark:text-gray-400"}`} />
                                                            <span className={`text-xs font-semibold ${isSelected ? "text-purple-900 dark:text-purple-100" : "text-gray-700 dark:text-gray-300"}`}>
                                                                {label}
                                                            </span>
                                                            {disabled && <Lock className="w-3 h-3 ml-auto text-gray-400" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Dynamic Fields */}
                                            <div className="mb-4">
                                                {ApproverFields()}
                                            </div>

                                            {/* Preview */}
                                            <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-purple-200 dark:border-purple-700">
                                                <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide mb-2">
                                                    Preview
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/40 text-xs font-bold text-purple-700 dark:text-purple-300">
                                                        {form.approver.type}
                                                    </span>
                                                    <pre className="flex-1 text-xs text-gray-700 dark:text-gray-300 font-mono overflow-x-auto">
                                                        {JSON.stringify(form.approver.params, null, 2)}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-8 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Step
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
