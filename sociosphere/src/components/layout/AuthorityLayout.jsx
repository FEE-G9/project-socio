import React, { useState, useEffect, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  AlertCircle,
  ShieldAlert,
  User,
  Sparkles,
  Users,
  PhoneCall,
  Wallet,
  HelpCircle,
  MapPin,
  Megaphone
} from "lucide-react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import { useAuth } from "../../context/AuthContext";
import { useWeather } from "../../hooks/useWeather";
import { getAnnouncements } from "../../data/mockAnnouncements";
import { getUsers } from "../../data/mockUsers";
import ScrollReveal from "../ui/ScrollReveal";
import AdminSOSReceiver from "../ui/AdminSOSReceiver";

const getWeatherEmoji = (condition) => {
  switch (condition?.toLowerCase()) {
    case "rain":
    case "drizzle":
      return "🌧️";
    case "clouds":
      return "☁️";
    case "clear":
      return "☀️";
    case "thunderstorm":
      return "⛈️";
    case "snow":
      return "❄️";
    case "mist":
    case "smoke":
    case "haze":
    case "fog":
      return "🌫️";
    default:
      return "🌤️";
  }
};

const AuthorityLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const weather = useWeather();

  const adminSociety = user?.society || user?.communityName || 'Gandhi Colony';
  const adminSocietyCode = user?.societyCode || (
    adminSociety === 'Gandhi Colony' ? 'GC-101' :
    adminSociety === 'Shayam Nagar' ? 'SN-202' : 'DV-303'
  );

  const [announcements, setAnnouncements] = useState([]);
  const [usersList, setUsersList] = useState([]);
  
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

  useEffect(() => {
    const loadData = () => {
      try {
        setAnnouncements(getAnnouncements() || []);
      } catch { /* ignore */ }
      try {
        setUsersList(getUsers() || []);
      } catch { /* ignore */ }
    };
    loadData();
    window.addEventListener("sociosphere_data_updated", loadData);
    window.addEventListener("sociosphere_users_updated", loadData);
    window.addEventListener("storage", loadData);
    return () => {
      window.removeEventListener("sociosphere_data_updated", loadData);
      window.removeEventListener("sociosphere_users_updated", loadData);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const pendingRequestsCount = useMemo(() => {
    return usersList.filter(u => 
      (u.society || u.communityName || '').toLowerCase() === adminSociety.toLowerCase() &&
      u.status === 'Pending Approval'
    ).length;
  }, [usersList, adminSociety]);

  const latestNotice = useMemo(() => {
    const matching = announcements.filter(a => {
      if (!a) return false;
      const s = (a.society || a.communityName || a.colony || a.colonyName || '').toLowerCase();
      return s === adminSociety.toLowerCase() || (adminSociety.toLowerCase() === 'gandhi colony' && (!s || a.societyCode === 'GC-101'));
    });
    return matching[0]?.title || `Welcome to ${adminSociety} Authority Portal — All Civic Systems Synchronized.`;
  }, [announcements, adminSociety]);

  const links = [
    {
      label: "Admin Home",
      href: "/authority/home",
      icon: LayoutDashboard,
    },
    {
      label: "Issues Tracker",
      href: "/authority/issues",
      icon: AlertCircle,
    },
    {
      label: "Crime & Security",
      href: "/authority/crimes",
      icon: ShieldAlert,
    },
    {
      label: "Resident Directory",
      href: "/authority/members",
      icon: Users,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : null,
    },
    {
      label: "Emergency Dispatch",
      href: "/authority/emergency",
      icon: PhoneCall,
    },
    {
      label: "Finance & Accounts",
      href: "/authority/fees",
      icon: Wallet,
    },
    {
      label: "Admin Profile",
      href: "/authority/profile",
      icon: User,
    },
    {
      label: "SOP Guidelines",
      href: "/authority/faqs",
      icon: HelpCircle,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <AdminSOSReceiver />
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
          {/* DECORATIVE TOP STATUS BAR & MARQUEE TICKER */}
          <div className="border-b border-slate-200/80 bg-white/70 px-6 py-2.5 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#0D1524]/70 sm:px-8 lg:px-10">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              
              {/* Weather & Society Badge */}
              <div className="flex items-center gap-3 text-xs flex-wrap">
                <span 
                  className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 font-bold text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                  title={`Current weather in ${adminSociety}: ${weather.description || "Clear sky"}, ${weather.temp ?? 26}°C`}
                >
                  <span className="text-sm">{getWeatherEmoji(weather.condition)}</span>
                  <span>{weather.temp != null ? `${weather.temp}°C` : "26°C"}</span>
                  <span className="text-slate-400 font-normal">({weather.description || weather.condition || "Clear sky"})</span>
                </span>

                <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">|</span>

                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <MapPin size={14} className="text-emerald-500" />
                  <span>{adminSociety}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    {adminSocietyCode}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" title="Colony live sync" />
                </div>
              </div>

              {/* Marquee Ticker */}
              <div className="flex items-center gap-2 overflow-hidden text-xs max-w-md sm:max-w-lg">
                <span className="flex items-center gap-1 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider shrink-0 border border-amber-500/30">
                  <Megaphone size={11} />
                  Notice
                </span>
                <span className="truncate font-medium text-slate-600 dark:text-slate-300 text-xs">
                  {latestNotice}
                </span>
              </div>

            </div>
          </div>

          <div className="mx-auto max-w-[1440px] px-6 py-6 sm:px-8 lg:px-10">
            <ScrollReveal key={location.pathname} className="w-full">
              <Outlet />
            </ScrollReveal>
          </div>
        </main>
      </div>

      <BottomNav links={links.slice(0, 5)} />

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
                  {user?.name?.split(" ")[0] || "Admin"}!
                </p>
                <p className="welcome-copy welcome-copy-delay-3 mt-4 max-w-xs text-base leading-7 text-slate-600 dark:text-slate-300">
                  Welcome to <strong className="text-slate-900 dark:text-white">{adminSociety}</strong>
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

export default AuthorityLayout;
