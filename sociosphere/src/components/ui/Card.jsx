import React from "react";

const Card = ({
  children,
  className = "",
  onClick,
  hover = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl
        border border-slate-200
        bg-white
        p-6
        shadow-sm
        dark:border-slate-700/60
        dark:bg-slate-800/90
        ${hover ? "transition-all duration-200 hover:-translate-y-1 hover:shadow-lg" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;