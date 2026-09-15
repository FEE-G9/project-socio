import React from "react";

import { Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  AlertCircle,
  ShieldAlert,
  Megaphone,
  Users,
  Map,
} from "lucide-react";import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import { useAuth } from "../../context/AuthContext";

const CitizenLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

const links = [
  { label: "Home", href: "/citizen/home", icon: Home },
  { label: "Report Issue", href: "/citizen/report", icon: AlertCircle },
  { label: "Report Crime", href: "/citizen/report-crime", icon: ShieldAlert },
  { label: "Announcements", href: "/citizen/announcements", icon: Megaphone },
  { label: "Community", href: "/citizen/community", icon: Users },
  { label: "Map", href: "/citizen/map", icon: Map },
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
        user={user}
      />

      <div className="flex">
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