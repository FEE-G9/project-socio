import React, { useState } from "react";
import {
  Menu,
  X,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Shield,
  Sun,
  Moon,
  Settings,
  LayoutDashboard,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";

const Navbar = ({
  links = [],
  user = null,
  userMenu = [],
  onLogout,
  showNotifications = false,
  notificationCount = 0,
  onNotificationClick,
  showBrand = true,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    theme,
    toggleTheme,
  } = useTheme();

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(href);
  };

  const handleNavigation = (href) => {
    setMobileOpen(false);
    navigate(href);
  };

  const handleProfileNavigation = (href) => {
    setProfileOpen(false);
    navigate(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950/95">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* BRAND */}
        {showBrand && (
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2"
            aria-label="Go to home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white transition-all duration-200 group-hover:scale-105 group-hover:bg-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/20">
              <Shield size={19} />
            </div>

            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Socio
              <span className="text-emerald-600">
                Sphere
              </span>
            </span>
          </button>
        )}

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <button
                key={link.href}
                onClick={() =>
                  handleNavigation(link.href)
                }
                className={`rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* RIGHT SIDE */}
        <div className="hidden items-center gap-2 md:flex">

          {/* THEME */}
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2.5 text-slate-500 transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Toggle theme"
            title={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          {/* NOTIFICATIONS */}
          {showNotifications && (
            <button
              onClick={onNotificationClick}
              className="relative rounded-xl p-2.5 text-slate-500 transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={20} />

              {notificationCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {notificationCount > 9
                    ? "9+"
                    : notificationCount}
                </span>
              )}
            </button>
          )}

          {/* PROFILE */}
          <div className="relative">

            <button
              onClick={() =>
                setProfileOpen((prev) => !prev)
              }
              className="group flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open profile menu"
            >

              {/* AVATAR */}
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || "User"}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-transparent transition-all duration-200 group-hover:ring-emerald-500/40"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-all duration-200 group-hover:bg-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <User size={18} />
                </div>
              )}

              {/* NAME */}
              <div className="hidden text-left lg:block">
                <p className="max-w-28 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {user?.name || "Citizen"}
                </p>

                <p className="text-[10px] text-slate-400">
                  {user?.role || "Citizen"}
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform duration-200 ${
                  profileOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* PROFILE DROPDOWN */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">

                {/* PROFILE HEADER */}
                <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">

                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || "User"}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <User size={18} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {user?.name || "Citizen"}
                    </p>

                    <p className="text-xs text-slate-400">
                      {user?.role || "Citizen"}
                    </p>
                  </div>
                </div>

                {/* PROFILE */}
                <button
                  onClick={() =>
                    handleProfileNavigation(
                      "/citizen/profile"
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <User size={16} />
                  Profile
                </button>

                {/* DASHBOARD */}
                <button
                  onClick={() =>
                    handleProfileNavigation(
                      "/citizen/dashboard"
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>

                {/* SETTINGS */}
                <button
                  onClick={() =>
                    handleProfileNavigation(
                      "/citizen/profile"
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <Settings size={16} />
                  Settings
                </button>

                <div className="my-2 border-t border-slate-200 dark:border-slate-700" />

                {/* LOGOUT */}
                {onLogout && (
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-rose-600 transition-all duration-200 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() =>
            setMobileOpen((prev) => !prev)
          }
          className="rounded-xl p-2 text-slate-600 transition-all duration-200 hover:scale-105 hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">

          <nav className="space-y-1">

            {links.map((link) => {
              const active = isActive(link.href);

              return (
                <button
                  key={link.href}
                  onClick={() =>
                    handleNavigation(link.href)
                  }
                  className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* MOBILE THEME */}
            <button
              onClick={toggleTheme}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {theme === "dark" ? (
                <>
                  <Sun size={18} />
                  Switch to Light Mode
                </>
              ) : (
                <>
                  <Moon size={18} />
                  Switch to Dark Mode
                </>
              )}
            </button>

            {/* MOBILE PROFILE */}
            <button
              onClick={() =>
                handleProfileNavigation(
                  "/citizen/profile"
                )
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <User size={18} />
              Profile
            </button>

            {/* MOBILE LOGOUT */}
            {onLogout && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onLogout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-rose-600 transition-all duration-200 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;