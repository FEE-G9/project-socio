import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  AlertCircle,
  BarChart3,
  Users,
  IndianRupee,
  Megaphone,
} from "lucide-react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

const AuthorityLayout = () => {
  const navigate = useNavigate();

  const links = [
    {
      label: "Dashboard",
      href: "/authority",
      icon: LayoutDashboard,
    },
    {
      label: "Issues",
      href: "/authority/issues",
      icon: AlertCircle,
    },
    {
      label: "Analytics",
      href: "/authority/analytics",
      icon: BarChart3,
    },
    {
      label: "Members",
      href: "/authority/members",
      icon: Users,
    },
    {
      label: "Fees",
      href: "/authority/fees",
      icon: IndianRupee,
    },
    {
      label: "Announcements",
      href: "/authority/announcements",
      icon: Megaphone,
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
        onLogout={handleLogout}
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

export default AuthorityLayout;