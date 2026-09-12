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

    if (href === "/authority") {
      return location.pathname === "/authority";
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
        <nav className="flex-1 space-y-2 p-3">
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
                    ? "justify-center px-2 py-3"
                    : "gap-3 px-3 py-3"
                } ${
                  active
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                }`}
              >
                <Icon
                  size={20}
                  className={`shrink-0 transition-transform duration-200 ${
                    active
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "group-hover:scale-105"
                  }`}
                />

                {!collapsed && (
                  <span className="truncate text-sm font-medium">
                    {link.label}
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