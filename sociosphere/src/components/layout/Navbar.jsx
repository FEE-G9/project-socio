import React, { useState } from "react";
import {
  Menu,
  X,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Settings,
  LayoutDashboard,
  MapPin,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";
import UserAvatar from "../ui/UserAvatar";

const navbarNotifications = [
  { title: "Water supply maintenance", detail: "Service resumes at 4:00 PM", color: "bg-blue-500" },
  { title: "Community meeting", detail: "RWA meeting starts tomorrow at 6:30 PM", color: "bg-emerald-500" },
  { title: "Security update", detail: "Visitor verification is now active", color: "bg-amber-500" },
];

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
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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

    if (href === "/authority" || href === "/authority/home") {
      return location.pathname === "/authority" || location.pathname === "/authority/home";
    }

    return (
      location.pathname === href ||
      location.pathname.startsWith(`${href}/`)
    );
  };

  const handleNavigation = (href) => {
    setMobileOpen(false);
    navigate(href);
  };

  const handleProfileNavigation = (href) => {
    setProfileOpen(false);
    navigate(href);
  };

  const settingsPath = location.pathname.startsWith("/authority")
    ? "/authority/profile"
    : "/citizen/settings";
  const profilePath = location.pathname.startsWith("/authority")
    ? "/authority/profile"
    : "/citizen/profile";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950/95">

      <div className="mx-auto flex h-16 items-center justify-between pr-4 sm:pr-6 lg:pr-8">

        {/* BRAND */}
        {showBrand && (
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 md:w-[260px] md:justify-center"
            aria-label="Go to home"
          >
            <img
              src="/logo_main.png"
              alt="SocioSphere"
              className="h-10 w-10 object-contain transition-transform duration-200 group-hover:scale-105"
            />

            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Socio
              <span className="text-emerald-600">
                Sphere
              </span>
            </span>
          </button>
        )}

        {/* DESKTOP NAVIGATION - COMMENTED OUT AS REQUESTED */}
        {/* <nav className="hidden items-center gap-1 md:flex">
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
        </nav> */}

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
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen((open) => !open);
                  onNotificationClick?.();
                }}
                className="relative rounded-xl p-2.5 text-slate-500 transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell size={20} />

                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {notificationCount || navbarNotifications.length}
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <div className="px-3 py-2 text-sm font-bold text-slate-900 dark:text-white">Notifications</div>
                  {navbarNotifications.map((notification) => (
                    <div key={notification.title} className="flex gap-3 rounded-xl px-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/70">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.color}`} />
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{notification.title}</p>
                        <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{notification.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              <UserAvatar
                user={user}
                className="h-9 w-9 ring-2 ring-transparent transition-all duration-200 group-hover:ring-emerald-500/40"
                iconSize={18}
              />

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

                  <UserAvatar user={user} className="h-10 w-10" iconSize={18} />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                      {user?.name || "Citizen"}
                    </p>
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                      {user?.role || "Citizen"}
                    </p>
                    
                    {(user?.email || user?.phone) && (
                      <div className="space-y-0.5 mt-1 border-t border-slate-200/60 dark:border-slate-700/60 pt-1">
                        {user?.email && <p className="text-[10px] text-slate-500 truncate">{user.email}</p>}
                        {user?.phone && <p className="text-[10px] text-slate-500 truncate">{user.phone}</p>}
                      </div>
                    )}
                    
                    {(user?.block || user?.residence) && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                        <MapPin size={10} className="shrink-0" />
                        <span className="truncate">
                          {user.block && `${user.block}`}
                          {user.block && user.residence && ', '}
                          {user.residence && `Res: ${user.residence}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* PROFILE */}
                <button
                  onClick={() => handleProfileNavigation(profilePath)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <User size={16} />
                  Profile
                </button>

                {/* DASHBOARD */}
                <button
                  onClick={() =>
                    handleProfileNavigation(
                      location.pathname.startsWith('/authority') ? '/authority/dashboard' : '/citizen/dashboard'
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>

                {/* SETTINGS */}
                <button
                  onClick={() => handleProfileNavigation(settingsPath)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <Settings size={16} />
                  Account settings
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

            {/* {links.map((link) => {
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
            })} */}

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
            {showNotifications && (
              <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100"><Bell size={16} /> Notifications</p>
                <div className="space-y-2">
                  {navbarNotifications.map((notification) => (
                    <div key={notification.title} className="flex gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${notification.color}`} />
                      <span>{notification.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => handleProfileNavigation(profilePath)}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <User size={18} />
              Profile
            </button>

            <button
              onClick={() => handleProfileNavigation(settingsPath)}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Settings size={18} />
              Settings
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
