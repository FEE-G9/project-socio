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
import { useAuth } from "../../context/AuthContext";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import { useAuth } from "../../context/AuthContext";
import ScrollReveal from "../ui/ScrollReveal";

const CitizenLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

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
    // {
    //   label: "Map",
    //   href: "/citizen/map",
    //   icon: Map,
    // },
    {
      label: "Profile",
      href: "/citizen/profile",
      icon: User,
    },
  ];

  const handleLogout = () => {
    logout();
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
  user={user || {
    name: "Citizen",
    role: "Resident",
  }}
/>
      <Navbar
        links={links}
        showBrand={true}
        showNotifications={true}
        notificationCount={3}
        onLogout={handleLogout}
        user={user}
      />

      <div className="flex">
        <Sidebar links={links} />

        <main className="min-w-0 flex-1 pb-20 md:pb-0">
          <div className="mx-auto max-w-[1440px] px-6 py-6 sm:px-8 lg:px-10">
             <ScrollReveal key={location.pathname} className="w-full">
               <Outlet />
             </ScrollReveal>
          </div>
        </main>
      </div>

      <BottomNav links={links} />
    </div>
  );
};

export default CitizenLayout;