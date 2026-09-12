import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  onClick,
  ...props
}) => {
  const variants = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600",
    outline:
      "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        gap-2
        rounded-xl
        font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        dark:focus:ring-offset-slate-950
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;