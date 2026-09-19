import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  FileWarning,
  ShieldAlert,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import ScrollReveal from "../ui/ScrollReveal";
import UserAvatar from "../ui/UserAvatar";

const CitizenLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showWelcome, setShowWelcome] = useState(
    () => sessionStorage.getItem("sociosphere_show_welcome") === "true"
  );

  useEffect(() => {
    if (showWelcome) {
      sessionStorage.removeItem("sociosphere_show_welcome");
    }
  }, [showWelcome]);

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

       {showWelcome && (
         <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-md">
           <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white px-6 py-9 text-center shadow-2xl dark:border-slate-700 dark:bg-[#0D1524]">
             <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/20 blur-2xl" />
             <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-violet-400/15 blur-2xl" />

             <div className="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center">
               <div className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-emerald-400/50 [animation-duration:7s]" />
               <div className="absolute inset-2 rounded-full border border-emerald-200 dark:border-emerald-500/20" />
               <UserAvatar user={user} className="relative h-20 w-20 shadow-lg shadow-emerald-500/20" iconSize={34} />
               <span className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-sm text-white shadow-md">
                 ✨
               </span>
             </div>

             <p className="relative text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
               SocioSphere
             </p>
             <h2 className="relative mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
               Hi, {user?.name?.split(" ")[0] || "there"}!
             </h2>
             <p className="relative mt-3 text-base text-slate-600 dark:text-slate-300">
               Welcome to <strong className="text-slate-900 dark:text-white">{user?.communityName || "your community"}</strong>
             </p>
             <button
               type="button"
               onClick={() => setShowWelcome(false)}
               className="relative mt-8 inline-flex min-w-36 items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
             >
               Jump In
             </button>
           </div>
         </div>
       )}
    </div>
  );
};

export default CitizenLayout;