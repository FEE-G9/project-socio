import React, { useState } from "react";
import { Menu, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ links = [] }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (href) => {
    if (href === "/citizen/home") {
      return location.pathname === "/citizen/home";
    }

    if (href === "/authority" || href === "/authority/home") {
      return location.pathname === "/authority" || location.pathname === "/authority/home";
    }

    return (
      location.pathname === href ||
      location.pathname.startsWith(`${href}/`)
    );
  };

  return (
    <aside
      className={`hidden shrink-0 border-r border-slate-200 bg-slate-50 transition-all duration-300 dark:border-slate-800 dark:bg-[#0B1120] md:block ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col">

        {/* SIDEBAR HEADER */}
        <div
          className={`flex h-14 items-center border-b border-slate-200 dark:border-slate-800 ${
            collapsed
              ? "justify-center"
              : "justify-between px-4"
          }`}
        >
          {!collapsed && (
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </span>
          )}

          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:scale-105 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label={
              collapsed
                ? "Open sidebar"
                : "Close sidebar"
            }
            title={
              collapsed
                ? "Open sidebar"
                : "Close sidebar"
            }
          >
            {collapsed ? (
              <ChevronRight size={19} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);

            return (
              <button
                key={link.href}
                onClick={() => navigate(link.href)}
                title={collapsed ? link.label : undefined}
                className={`group flex w-full items-center rounded-xl transition-all duration-200 ${
                  collapsed
                    ? "justify-center px-2 py-2.5"
                    : "gap-3 px-3 py-2.5"
                } ${
                  active
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                    : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 font-medium"
                }`}
              >
                <Icon
                  size={19}
                  className={`shrink-0 transition-transform duration-200 ${
                    active
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "group-hover:scale-105"
                  }`}
                />

                {!collapsed && (
                  <span className="truncate text-xs">
                    {link.label}
                  </span>
                )}

                {!collapsed && link.badge && (
                  <span className="ml-auto rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-1.5 py-0.2 text-[10px] font-bold">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
