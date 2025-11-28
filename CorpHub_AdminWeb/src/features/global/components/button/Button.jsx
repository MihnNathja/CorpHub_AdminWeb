import React from "react";
import clsx from "clsx";

/**
 * Nút dùng chung trong toàn hệ thống
 * Props:
 *  - variant: "solid" | "outline" | "ghost" | "danger"
 *  - size: "sm" | "md" | "lg"
 *  - color: "blue" | "green" | "gray" | "red" (chỉ dùng cho variant solid)
 *  - loading: boolean
 *  - icon: JSX (icon component)
 */
export const Button = ({
    children,
    onClick,
    type = "button",
    variant = "solid",
    color = "blue",
    size = "md",
    disabled = false,
    loading = false,
    icon,
    className = "",
}) => {
    const base =
        "inline-flex items-center justify-center font-medium rounded-lg focus:outline-none transition duration-150 ease-in-out select-none";

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-2.5 text-base",
    };

    const variants = {
        solid: {
            blue: "bg-blue-600 hover:bg-blue-700 text-white",
            green: "bg-green-600 hover:bg-green-700 text-white",
            gray: "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white",
            red: "bg-red-600 hover:bg-red-700 text-white",
        },
        outline:
            "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 bg-transparent",
        ghost:
            "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
        danger:
            "bg-red-500 hover:bg-red-600 text-white",
    };

    const classes = clsx(
        base,
        sizes[size],
        variant === "solid"
            ? variants.solid[color]
            : variants[variant],
        disabled && "opacity-60 cursor-not-allowed",
        className
    );

    return (
        <button
            type={type}
            onClick={!disabled && !loading ? onClick : undefined}
            className={classes}
            disabled={disabled || loading}
        >
            {loading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                </svg>
            )}
            {icon && <span className="mr-2 flex items-center">{icon}</span>}
            {children}
        </button>
    );
};

export default Button;
