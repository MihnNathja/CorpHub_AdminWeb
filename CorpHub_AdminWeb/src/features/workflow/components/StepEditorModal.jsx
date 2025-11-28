import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useUser } from "../../user/hooks/useUser";
import {
    UserCircle,
    Users,
    Building2,
    BadgeCheck,
    Filter,
} from "lucide-react";

const APPROVER_TYPES = [
    { key: "USER", label: "Người dùng", icon: UserCircle, disabled: false },
    { key: "USER_RELATION", label: "Quan hệ người dùng", icon: Users, disabled: false },

    // Tạm khoá — disable
    { key: "POSITION", label: "Chức danh", icon: Users, disabled: true },
    { key: "POSITION_LEVEL", label: "Cấp bậc vị trí", icon: Filter, disabled: true },
    { key: "DEPARTMENT", label: "Theo phòng ban", icon: Building2, disabled: true },
];


const USER_RELATION_OPTIONS = [
    { key: "DIRECT_MANAGER", label: "Quản lý trực tiếp" },
    { key: "DEPARTMENT_MANAGER", label: "Trưởng phòng" },
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
            type: "ROLE",
            params: { roleName: "" },
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

    /* -----------------------------------------
        Dynamic Approver Fields 
    ----------------------------------------- */
    const ApproverFields = () => {
        const { type, params } = form.approver;

        const inputClass =
            "w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200";

        switch (type) {
            case "USER":
                return (
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm người dùng theo tên / email..."
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setShowUserDropdown(true);  // mở dropdown
                            }}
                            className={inputClass}
                        />

                        {showUserDropdown && users?.length > 0 && (
                            <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 
                    border border-gray-300 dark:border-gray-600 
                    rounded-lg shadow-lg max-h-48 overflow-auto z-20">

                                {users.map((u) => (
                                    <div
                                        key={u.id}
                                        onClick={() => {
                                            updateApproverParam("userId", u.id);
                                            setKeyword(u.fullName);
                                            setShowUserDropdown(false); // đóng dropdown
                                        }}
                                        className="p-2 flex items-center gap-3 cursor-pointer 
                            hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    >
                                        <img
                                            src={u.avatar || "/default-avatar.png"}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />

                                        <div>
                                            <div className="font-medium text-gray-800 dark:text-gray-200">
                                                {u.fullName || u.username}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                {u.email}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case "USER_RELATION":
                return (
                    <select
                        value={params.key || ""}
                        onChange={(e) =>
                            updateApproverParam("key", e.target.value)
                        }
                        className={inputClass}
                    >
                        <option value="">Chọn quan hệ</option>

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
                        placeholder="Mã chức danh (VD: IT_MANAGER)"
                        value={params.code || ""}
                        onChange={(e) =>
                            updateApproverParam("code", e.target.value)
                        }
                        className={inputClass}
                    />
                );

            case "POSITION_LEVEL":
                return (
                    <input
                        placeholder="Cấp bậc (VD: 3)"
                        type="number"
                        value={params.levelOrder || ""}
                        onChange={(e) =>
                            updateApproverParam("levelOrder", Number(e.target.value))
                        }
                        className={inputClass}
                    />
                );

            case "DEPARTMENT":
                return (
                    <select
                        value={params.role || ""}
                        onChange={(e) =>
                            updateApproverParam("role", e.target.value)
                        }
                        className={inputClass}
                    >
                        <option value="">Chọn vai trò</option>
                        <option value="HEAD">Trưởng phòng</option>
                        <option value="DIRECTOR">Giám đốc</option>
                        <option value="MANAGER">Quản lý</option>
                    </select>
                );
        }
    };

    return (
        <Transition show={open} as={Fragment}>
            <Dialog onClose={() => setOpen(false)} className="relative z-50">

                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

                <div className="fixed inset-0 flex items-center justify-center p-4">

                    <Dialog.Panel
                        className="
                    w-full 
                    max-w-5xl             
                    sm:max-w-xl          
                    md:max-w-3xl 
                    lg:max-w-5xl
                    rounded-2xl 
                    p-6 
                    bg-white dark:bg-gray-900 
                    shadow-2xl 
                    border border-gray-200 dark:border-gray-800

                    max-h-[90vh]          /* <— tránh tràn */
                    overflow-y-auto       /* <— scroll */
                "
                    >
                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                {isEdit ? "Sửa bước Workflow" : "Thêm bước Workflow"}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Cấu hình bước thực thi và người phê duyệt
                            </p>
                        </div>

                        {/* CONTENT SPLIT */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* LEFT SIDE — Step info */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Tên Step</label>
                                    <input
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({ ...form, name: e.target.value })
                                        }
                                        className="w-full mt-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 
                                            border dark:border-gray-700 text-gray-800 dark:text-gray-200"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Thứ tự</label>
                                    <input
                                        type="number"
                                        value={form.stepOrder}
                                        onChange={(e) =>
                                            setForm({ ...form, stepOrder: Number(e.target.value) })
                                        }
                                        className="w-full mt-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 
                                            border dark:border-gray-700 text-gray-800 dark:text-gray-200"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Loại Step</label>
                                    <select
                                        value={form.stepType}
                                        onChange={(e) =>
                                            setForm({ ...form, stepType: e.target.value })
                                        }
                                        className="w-full mt-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 
                                            border dark:border-gray-700 text-gray-800 dark:text-gray-200"
                                    >
                                        <option value="APPROVAL">APPROVAL</option>
                                        <option value="AUTO">AUTO</option>
                                        <option value="NOTIFY">NOTIFY</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        Điều kiện (optional)
                                    </label>
                                    <textarea
                                        value={form.conditionExpr || ""}
                                        onChange={(e) =>
                                            setForm({ ...form, conditionExpr: e.target.value })
                                        }
                                        className="w-full mt-1 p-2 h-24 rounded-lg bg-gray-50 dark:bg-gray-800 
                                            border dark:border-gray-700 text-gray-800 dark:text-gray-200"
                                    />
                                </div>
                            </div>

                            {/* RIGHT SIDE — Approver settings */}
                            <div className="space-y-4">
                                <label className="text-sm text-gray-500 dark:text-gray-400">
                                    Người duyệt
                                </label>

                                {/* Approver Type selection */}
                                <div className="grid grid-cols-2 gap-3">
                                    {APPROVER_TYPES.map(({ key, label, icon: Icon, disabled }) => (
                                        <div
                                            key={key}
                                            onClick={() => {
                                                if (!disabled) {
                                                    setForm({ ...form, approver: { type: key, params: {} } });
                                                }
                                            }}
                                            className={`p-3 rounded-lg cursor-pointer border flex items-center gap-3 transition ${disabled ? "opacity-40 cursor-not-allowed" : ""}${form.approver.type === key && !disabled
                                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                : "border-gray-300 dark:border-gray-700"}`}
                                        >
                                            <Icon size={20} className="text-gray-600 dark:text-gray-300" />
                                            <span className="text-gray-700 dark:text-gray-200 text-sm">{label}</span>
                                        </div>
                                    ))}

                                </div>

                                {/* Dynamic fields */}
                                <div className="mt-2">{ApproverFields()}</div>

                                {/* Preview */}
                                <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border dark:border-gray-700">
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                        Preview:
                                    </div>
                                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {form.approver.type} —{" "}
                                        <span className="text-gray-600 dark:text-gray-300">
                                            {JSON.stringify(form.approver.params)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end mt-8 gap-3">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 rounded-lg border 
                                    border-gray-300 dark:border-gray-700 
                                    text-gray-700 dark:text-gray-300
                                    hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 rounded-lg bg-blue-600 text-white 
                                    hover:bg-blue-700 shadow-md"
                            >
                                Lưu Step
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Transition>
    );
}
