import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  AlertCircle,
  BarChart3,
  Users,
  IndianRupee,
  Megaphone,
  ShieldAlert
} from "lucide-react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import { useAuth } from "../../context/AuthContext";
import ScrollReveal from "../ui/ScrollReveal";

const AuthorityLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const links = [
    {
      label: "Admin Home",
      href: "/authority/home",
      icon: LayoutDashboard,
    },
    {
      label: "Issues",
      href: "/authority/issues",
      icon: AlertCircle,
    },
    {
      label: "Crimes",
      href: "/authority/crimes",
      icon: ShieldAlert,
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
        onLogout={handleLogout}
        user={user || {
          name: "System Administrator",
          role: "Authority",
        }}
      />

      <div className="flex">
        <Sidebar links={links} />

        <main className="min-w-0 flex-1 pb-20 md:pb-0">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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

export default AuthorityLayout;