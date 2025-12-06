import React from "react";
import { Fingerprint, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckInButton({ onClick, disabled = false, title = "Check In", variant = "default" }) {
    const buttonVariants = {
        default: {
            enabled: {
                bg: "bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600",
                shadow: "shadow-lg shadow-blue-500/40 dark:shadow-blue-700/40",
                hover: "hover:shadow-blue-500/60 dark:hover:shadow-blue-700/60 hover:scale-[1.02]",
                text: "text-white",
                icon: <Fingerprint className="w-6 h-6" />,
            },
            disabled: {
                bg: "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800",
                shadow: "shadow-lg shadow-gray-300/20 dark:shadow-gray-800/30",
                hover: "",
                text: "text-gray-600 dark:text-gray-500",
                icon: <AlertCircle className="w-6 h-6" />,
            },
        },
        success: {
            enabled: {
                bg: "bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600",
                shadow: "shadow-lg shadow-emerald-500/40 dark:shadow-emerald-700/40",
                hover: "hover:shadow-emerald-500/60 dark:hover:shadow-emerald-700/60 hover:scale-[1.02]",
                text: "text-white",
                icon: <CheckCircle2 className="w-6 h-6" />,
            },
            disabled: {
                bg: "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800",
                shadow: "shadow-lg shadow-gray-300/20 dark:shadow-gray-800/30",
                hover: "",
                text: "text-gray-600 dark:text-gray-500",
                icon: <AlertCircle className="w-6 h-6" />,
            },
        },
        warning: {
            enabled: {
                bg: "bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600",
                shadow: "shadow-lg shadow-amber-500/40 dark:shadow-amber-700/40",
                hover: "hover:shadow-amber-500/60 dark:hover:shadow-amber-700/60 hover:scale-[1.02]",
                text: "text-white",
                icon: <Clock className="w-6 h-6" />,
            },
            disabled: {
                bg: "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800",
                shadow: "shadow-lg shadow-gray-300/20 dark:shadow-gray-800/30",
                hover: "",
                text: "text-gray-600 dark:text-gray-500",
                icon: <AlertCircle className="w-6 h-6" />,
            },
        },
    };

    const currentVariant = buttonVariants[variant] || buttonVariants.default;
    const style = disabled ? currentVariant.disabled : currentVariant.enabled;

    return (
        <div className="w-full space-y-3">
            <motion.div
                className="relative group"
                whileHover={!disabled ? { y: -2 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
                {/* Glow Effect */}
                {!disabled && (
                    <motion.div
                        className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${style.bg}`}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}

                <motion.button
                    onClick={onClick}
                    disabled={disabled}
                    title={disabled ? "Shift time expired" : title}
                    whileTap={!disabled ? { scale: 0.95 } : {}}
                    whileHover={!disabled ? { scale: 1.02 } : {}}
                    className={`
                        relative w-full py-4 px-6 
                        rounded-2xl font-bold tracking-wide
                        flex items-center justify-center gap-3
                        transition-all duration-300
                        overflow-hidden
                        ${style.bg}
                        ${style.shadow}
                        ${!disabled ? style.hover : "cursor-not-allowed opacity-60"}
                        ${style.text}
                    `}
                >
                    {/* Animated Background Gradient */}
                    {!disabled && (
                        <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                            animate={{ x: ["100%", "-100%"] }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "loop",
                            }}
                        />
                    )}

                    {/* Content */}
                    <motion.div
                        className="relative flex items-center justify-center gap-3 z-10"
                        animate={!disabled ? { y: [0, -2, 0] } : {}}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <motion.div
                            animate={!disabled ? { rotate: [0, 5, -5, 0] } : {}}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatDelay: 1,
                            }}
                        >
                            {style.icon}
                        </motion.div>
                        <span className="text-base font-bold">{title}</span>
                    </motion.div>
                </motion.button>
            </motion.div>

            {/* Status Text */}
            {disabled && (
                <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1.5"
                >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Shift time expired - Check-in unavailable
                </motion.p>
            )}
        </div>
    );
}
