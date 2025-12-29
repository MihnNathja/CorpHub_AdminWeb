import React from "react";

const ConfirmDialog = ({
    open,
    title = "Xác nhận",
    message = "Bạn có chắc chắn muốn thực hiện hành động này?",
    onConfirm,
    onCancel
}) => {
    console.log("ConfirmDialog render:", { open, onConfirm: typeof onConfirm, onCancel: typeof onCancel });
    
    if (!open) return null;
 
    return (
        <div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[100]"
            onClick={(e) => {
                // Chỉ close khi click vào backdrop, không phải nội dung bên trong
                if (e.target === e.currentTarget) {
                    onCancel?.();
                }
            }}
        >
            <div 
                className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</p>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log("Cancel button clicked");
                            onCancel?.();
                        }}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log("Confirm button clicked");
                            onConfirm?.();
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
