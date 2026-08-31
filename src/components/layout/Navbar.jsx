import React, { useState } from 'react';
import {
  Menu,
  X,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Leaf,
} from 'lucide-react';

/**
 * Navbar Component
 * 
 * Reusable navbar for SocioSphere that works across Public, Citizen, and Authority pages.
 * 
 * Props:
 * - links: Array of {label, href, active} objects for navigation
 * - userMenu: Array of {label, action} objects for user dropdown
 * - onLogout: Function to handle logout
 * - user: Object with {name, avatar} for user profile
 * - showNotifications: Boolean to show notification icon
 * - notificationCount: Number to show on notification badge
 * - onNotificationClick: Function to handle notification click
 * - ctaButton: Object with {label, action} for primary CTA
 * - showBrand: Boolean to show logo (default: true)
 * - variant: 'public' | 'citizen' | 'authority' (default: 'public') - for future context-specific behavior
 */
const Navbar = ({
  links = [],
  userMenu = [],
  onLogout,
  user = null,
  showNotifications = true,
  notificationCount = 0,
  onNotificationClick,
  ctaButton = null,
  showBrand = true,
  _variant = 'public', // Reserved for future context-specific behavior
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-50 bg-[#080E1A] border-b border-slate-800 shadow-sm"
      style={{ fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          {showBrand && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500">
                <Leaf className="w-6 h-6 text-slate-950" strokeWidth={2} />
              </div>
              <span className="text-base font-bold text-slate-100 hidden sm:inline">
                SocioSphere
              </span>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center px-8">
            {links.length > 0 ? (
              links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    link.active
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {link.label}
                </a>
              ))
            ) : (
              <span className="text-slate-500 text-sm">No navigation links provided</span>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            {showNotifications && (
              <button
                onClick={onNotificationClick}
                className="relative p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/50 transition-all duration-200"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" strokeWidth={1.5} />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>
            )}

            {/* Primary CTA Button */}
            {ctaButton && (
              <button
                onClick={ctaButton.action}
                className="hidden sm:block px-4 py-2 bg-emerald-500 text-slate-950 text-sm font-bold rounded-xl hover:bg-emerald-400 transition-all duration-200"
              >
                {ctaButton.label}
              </button>
            )}

            {/* User Menu / Login Area */}
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-emerald-400" strokeWidth={2} />
                    )}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-slate-200 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 hidden sm:block ${
                      userDropdownOpen ? 'rotate-180' : ''
                    }`}
                    strokeWidth={2}
                  />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0D1524] border border-slate-800 rounded-xl shadow-lg py-1">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-sm font-medium text-slate-200">{user.name}</p>
                      {user.email && (
                        <p className="text-xs text-slate-500">{user.email}</p>
                      )}
                    </div>

                    {userMenu.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.action();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 transition-all duration-200"
                      >
                        {item.label}
                      </button>
                    ))}

                    <div className="border-t border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          onLogout?.();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-300 hover:bg-rose-500/10 transition-all duration-200"
                      >
                        <LogOut className="w-4 h-4" strokeWidth={2} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
              >
                Login
              </a>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/50 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={2} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-800">
            <div className="flex flex-col gap-1 pt-4">
              {links.length > 0 ? (
                links.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      link.active
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {link.label}
                  </a>
                ))
              ) : (
                <span className="px-4 py-2 text-slate-500 text-sm">No navigation links</span>
              )}

              {ctaButton && (
                <button
                  onClick={() => {
                    ctaButton.action();
                    closeMobileMenu();
                  }}
                  className="mt-2 mx-4 px-4 py-2 bg-emerald-500 text-slate-950 text-sm font-bold rounded-xl hover:bg-emerald-400 transition-all duration-200 w-auto"
                >
                  {ctaButton.label}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
