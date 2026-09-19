import React from "react";
import { NavLink } from "react-router-dom";

const BottomNav = ({ links = [] }) => {
  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-40
        border-t border-slate-200
        bg-white/95 backdrop-blur
        px-2 py-2
        dark:border-slate-700/60
        dark:bg-slate-900/95
        md:hidden
      "
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) => `
                flex min-w-16 flex-col items-center gap-1
                rounded-xl px-3 py-2
                text-xs font-medium
                transition-colors duration-200
                ${
                  isActive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }
              `}
            >
              {Icon && <Icon size={20} />}
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;