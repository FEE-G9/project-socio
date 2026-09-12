import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Map,
  FileWarning,
  ShieldAlert,
  User,
} from "lucide-react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

const CitizenLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    {
      label: "Home",
      href: "/citizen/home",
      icon: Home,
    },
    {
      label: "Dashboard",
      href: "/citizen/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Report Issue",
      href: "/citizen/report",
      icon: FileWarning,
    },
    {
      label: "Report Crime",
      href: "/citizen/report-crime",
      icon: ShieldAlert,
    },
    {
      label: "Map",
      href: "/citizen/map",
      icon: Map,
    },
    {
      label: "Profile",
      href: "/citizen/profile",
      icon: User,
    },
  ];

  const handleLogout = () => {
    localStorage.setItem("sociosphere_is_auth", "false");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
     <Navbar
  links={links}
  showBrand={true}
  showNotifications={true}
  notificationCount={3}
  onLogout={handleLogout}
  user={{
    name: "Ekjot Kaur",
    role: "Citizen",
  }}
/>

      <div className="flex">
        <Sidebar links={links} />

        <main className="min-w-0 flex-1 pb-20 md:pb-0">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav links={links} />
    </div>
  );
};

export default CitizenLayout;