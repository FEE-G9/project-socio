import React from "react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendUp = true,
  className = "",
}) => {
  return (
    <div
      className={`
        rounded-2xl
        border border-slate-200
        bg-white
        p-5
        shadow-sm
        dark:border-slate-700/60
        dark:bg-slate-800/90
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <Icon size={21} />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4">
          <span
            className={`text-sm font-medium ${
              trendUp
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {trend}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;