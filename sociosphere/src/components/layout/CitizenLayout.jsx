import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileWarning,
  ShieldAlert,
  User,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import ScrollReveal from "../ui/ScrollReveal";
import CitizenSOSActiveBanner from "../ui/CitizenSOSActiveBanner";

const CitizenLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showWelcome, setShowWelcome] = useState(
    () => sessionStorage.getItem("sociosphere_show_welcome") === "true"
  );
  const [welcomeReady, setWelcomeReady] = useState(false);

  useEffect(() => {
    if (showWelcome) {
      sessionStorage.removeItem("sociosphere_show_welcome");
      const animationTimer = window.setTimeout(() => {
        setWelcomeReady(true);
      }, 3600);

      return () => window.clearTimeout(animationTimer);
    }
  }, [showWelcome]);

  const links = [
    {
      label: "Home",
      href: "/citizen/home",
      icon: Home,
    },
    // {
    //   label: "Dashboard",
    //   href: "/citizen/dashboard",
    //   icon: LayoutDashboard,
    // },
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
      <CitizenSOSActiveBanner />
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
           <div className="welcome-card relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/60 bg-white px-7 py-8 shadow-2xl dark:border-slate-700 dark:bg-[#0D1524] sm:px-10 sm:py-10">
             <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/20 blur-2xl" />
             <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-violet-400/15 blur-2xl" />

             <div className="relative z-10 grid items-center gap-8 sm:grid-cols-[1fr_220px]">
               <div className="welcome-message text-left">
                 <p className="welcome-copy text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                   SocioSphere
                 </p>
                 <h2 className="welcome-copy welcome-copy-delay-1 mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                   Welcome,
                 </h2>
                 <p className="welcome-copy welcome-copy-delay-2 mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                   {user?.name?.split(" ")[0] || "there"}!
                 </p>
                 <p className="welcome-copy welcome-copy-delay-3 mt-4 max-w-xs text-base leading-7 text-slate-600 dark:text-slate-300">
                   Welcome to <strong className="text-slate-900 dark:text-white">{user?.communityName || "your community"}</strong>
                 </p>
               </div>

               <div className="welcome-avatar relative mx-auto flex h-40 w-40 items-center justify-center sm:mx-0">
                 <div className="welcome-glow absolute inset-2 rounded-full bg-emerald-400/25 blur-2xl" />
                 <div className="welcome-ring absolute inset-0 rounded-full border-2 border-dashed border-emerald-400/50" />
                 <div className="welcome-ring welcome-ring-delayed absolute inset-2 rounded-full border border-emerald-200 dark:border-emerald-500/20" />
                 <div className="welcome-assistant relative flex h-28 w-24 flex-col items-center">
                 <span className="welcome-antenna absolute -top-4 h-5 w-1 rounded-full bg-emerald-400">
                   <span className="absolute -top-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-lime-300 shadow-[0_0_12px_rgba(190,242,100,0.9)]" />
                 </span>
                 <span className="welcome-head relative z-10 flex h-[4.4rem] w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-teal-300 via-cyan-400 to-lime-300 shadow-xl shadow-cyan-500/30">
                   <span className="welcome-face relative flex h-10 w-[4.5rem] items-center justify-around rounded-[1.4rem] bg-slate-950/95 px-2">
                     <span className="welcome-eye relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-300 bg-slate-950">
                       <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)]" />
                     </span>
                     <span className="welcome-eye relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-300 bg-slate-950">
                       <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)]" />
                     </span>
                   </span>
                   <span className="absolute bottom-1.5 h-1.5 w-5 rounded-full bg-white/95 shadow-[0_0_7px_rgba(255,255,255,0.8)]" />
                 </span>
                 <span className="welcome-arm welcome-arm-left absolute left-0 top-[4.5rem] h-11 w-5 rounded-full bg-gradient-to-b from-lime-300 via-teal-300 to-cyan-400 shadow-md" />
                 <span className="welcome-body relative -mt-1 h-16 w-[4.4rem] rounded-[1.8rem] bg-gradient-to-br from-lime-300 via-teal-300 to-cyan-400 shadow-lg shadow-cyan-500/20" />
                 <span className="welcome-arm welcome-arm-right absolute right-0 top-[4.5rem] h-11 w-5 rounded-full bg-gradient-to-b from-lime-300 via-teal-300 to-cyan-400 shadow-md" />
                 <span className="welcome-shadow absolute -bottom-1 h-3 w-16 rounded-full bg-slate-400/25 blur-md dark:bg-slate-950/50" />
               </div>
               <span className="welcome-spark absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                 <Sparkles size={15} />
               </span>
                 <span className="welcome-hello absolute -right-2 top-0 rounded-2xl rounded-bl-sm bg-slate-950 px-3 py-2 text-sm font-bold text-white shadow-lg">
                   Hello!
                 </span>
               </div>
             </div>

             <div className="relative z-10 mt-8 flex justify-start">
               <button
                 type="button"
                 onClick={() => setShowWelcome(false)}
                 className={`welcome-button inline-flex min-w-36 items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 ${welcomeReady ? "welcome-button-ready" : ""}`}
               >
                 Jump In
               </button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default CitizenLayout;