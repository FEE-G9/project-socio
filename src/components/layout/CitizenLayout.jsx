import React, { useContext, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthContext } from '../../context/AuthContext';

/**
 * CitizenLayout Component
 * 
 * Common layout wrapper for all citizen-facing pages.
 * Provides:
 * - Navbar with citizen navigation
 * - Responsive main content area
 * - Outlet for page-specific content rendering
 * - Dark theme consistent with design system
 * 
 * All citizen pages should render through this layout via React Router.
 */
const CitizenLayout = () => {
  const authContext = useContext(AuthContext);
  const [activeNav, setActiveNav] = useState('');

  // Citizen navigation links
  const citizenLinks = [
    { label: 'Home', href: '/citizen/dashboard', active: activeNav === 'dashboard' },
    { label: 'Issues', href: '/citizen/issues', active: activeNav === 'issues' },
    { label: 'Announcements', href: '/citizen/announcements', active: activeNav === 'announcements' },
    { label: 'Community', href: '/citizen/community', active: activeNav === 'community' },
    { label: 'Map', href: '/citizen/map', active: activeNav === 'map' },
  ];

  // Citizen user menu items
  const citizenUserMenu = [
    {
      label: 'Profile',
      action: () => {
        // Navigate to profile page
        window.location.href = '/citizen/profile';
      },
    },
    {
      label: 'My Fees',
      action: () => {
        // Navigate to fees page
        window.location.href = '/citizen/fees';
      },
    },
    {
      label: 'Expenses',
      action: () => {
        // Navigate to expenses page
        window.location.href = '/citizen/expenses';
      },
    },
    {
      label: 'Settings',
      action: () => {
        // Navigate to settings
        window.location.href = '/citizen/settings';
      },
    },
  ];

  // Handle logout
  const handleLogout = () => {
    // Clear auth context and redirect to login
    if (authContext?.logout) {
      authContext.logout();
    }
    window.location.href = '/login';
  };

  // Update active nav based on current URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('dashboard')) setActiveNav('dashboard');
    else if (path.includes('issues')) setActiveNav('issues');
    else if (path.includes('announcements')) setActiveNav('announcements');
    else if (path.includes('community')) setActiveNav('community');
    else if (path.includes('map')) setActiveNav('map');
  }, []);

  // Get user data from context
  const user = authContext?.user || null;

  return (
    <div className="min-h-screen bg-[#070B14]" style={{ fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Navbar */}
      <Navbar
        links={citizenLinks}
        user={user}
        userMenu={citizenUserMenu}
        onLogout={handleLogout}
        showNotifications={true}
        notificationCount={authContext?.notificationCount || 0}
        onNotificationClick={() => {
          window.location.href = '/citizen/notifications';
        }}
        ctaButton={{
          label: 'Report Issue',
          action: () => {
            window.location.href = '/citizen/report';
          },
        }}
        showBrand={true}
        variant="citizen"
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Content via Outlet */}
          <Outlet />
        </div>
      </main>

      {/* Footer (optional, can be expanded later) */}
      <footer className="bg-[#0B1120] border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} SocioSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CitizenLayout;
