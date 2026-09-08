import React from "react";

const EmptyState = ({
  icon: Icon,
  title = "Nothing here yet",
  description,
  action,
  className = "",
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        rounded-2xl
        border border-dashed border-slate-300
        bg-white
        px-6 py-12
        text-center
        dark:border-slate-700
        dark:bg-slate-800/50
        ${className}
      `}
    >
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
          <Icon size={24} />
        </div>
      )}

      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;