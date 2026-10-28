import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { useWeather } from "../../hooks/useWeather";

import Report from "./Report";
import ReportCrime from "./ReportCrime";

import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { getIssues, saveIssues } from "../../data/mockIssues";
import { deleteCrime, getCrimes } from "../../data/mockCrimes";
import { getAnnouncements } from "../../data/mockAnnouncements";

import {
  Shield,
  MapPin,
  Bell,
  Users,
  Trash2,
  CreditCard,
  Plus,
  AlertTriangle,
  Droplets,
  Zap,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
  Calendar,
  MessageSquare,
  FileText,
  ShieldAlert,
  PhoneCall,
  PackageSearch,
  Cloud,
  Gauge,
  Megaphone,
} from "lucide-react";

function getWeatherEmoji(condition) {
  const c = (condition || "").toLowerCase();
  if (c.includes("thunder")) return "⛈️";
  if (c.includes("drizzle") || c.includes("rain")) return "🌧️";
  if (c.includes("snow")) return "❄️";
  if (c.includes("mist") || c.includes("fog") || c.includes("haze")) return "🌫️";
  if (c.includes("few") || c.includes("partly") || c.includes("scatter")) return "🌤️";
  if (c.includes("cloud") || c.includes("overcast")) return "⛅";
  if (c.includes("clear") || c.includes("sun")) return "☀️";
  return "☀️";
}

const quickActions = [
  {
    title: "Report Issue",
    description: "Pothole, leak, lights, garbage",
    icon: Plus,
    className: "action-green",
  },
  {
    title: "Report Crime",
    description: "Security alert & guard dispatch",
    icon: Shield,
    className: "action-red",
  },
  {
    title: "Lost & Found",
    description: "Report & recover misplaced items",
    icon: PackageSearch,
    className: "action-blue",
  },
  {
    title: "Emergency",
    description: "Police, ambulance, fire helplines",
    icon: PhoneCall,
    className: "action-red",
  },
  {
    title: "Community Hub",
    description: "Resident polls, clubs, rides",
    icon: Users,
    className: "action-purple",
  },
  {
    title: "Expenses",
    description: "Society income & expense ledger",
    icon: CreditCard,
    className: "action-yellow",
  },
];

const isCrimeReport = (report) => {
  const category = (report?.category || "").toLowerCase();
  return (
    report?.reportType === "crime" ||
    /^(CRM|CRIME)-/i.test(report?.id || "") ||
    ["crime", "theft", "security", "vandalism", "harassment", "cyber", "suspicious"].some((term) =>
      category.includes(term)
    )
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [activeCivicTab, setActiveCivicTab] = useState("all");
  const [activeCrimeTab, setActiveCrimeTab] = useState("all");
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [toast, setToast] = useState("");
  const [userReports, setUserReports] = useState([]);
  const [comingSoonFeature, setComingSoonFeature] = useState(null);
  const [showAllIssues, setShowAllIssues] = useState(false);
  const [showReportFilters, setShowReportFilters] = useState(false);
  const [reportSearch, setReportSearch] = useState("");
  const [reportTypeFilter, setReportTypeFilter] = useState("all");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showIssueTimeline, setShowIssueTimeline] = useState(false);
  const { theme } = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();
  const weather = useWeather();
  const [colonyAnnouncements, setColonyAnnouncements] = useState([]);

  useEffect(() => {
    const loadAnnouncements = () => {
      try {
        const all = getAnnouncements() || [];
        const userColonyId = user?.communityId || user?.colonyId;
        const userColonyName = (user?.communityName || "").trim().toLowerCase();

        const matching = all.filter((item) => {
          if (!item) return false;
          const itemColonyId = item.colonyId;
          const itemColonyName = (item.communityName || item.colonyName || "").trim().toLowerCase();
          if (userColonyId && itemColonyId && itemColonyId === userColonyId) return true;
          if (userColonyName && itemColonyName && itemColonyName === userColonyName) return true;
          if (!itemColonyId && !itemColonyName) return true;
          return false;
        });

        setColonyAnnouncements(matching.length > 0 ? matching : all);
      } catch {
        setColonyAnnouncements([]);
      }
    };

    loadAnnouncements();
    window.addEventListener("sociosphere_data_updated", loadAnnouncements);
    window.addEventListener("storage", loadAnnouncements);
    return () => {
      window.removeEventListener("sociosphere_data_updated", loadAnnouncements);
      window.removeEventListener("storage", loadAnnouncements);
    };
  }, [user?.communityId, user?.communityName, user?.colonyId]);

  /* =========================================================
     TOAST
  ========================================================= */

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  /* =========================================================
     LOAD REPORTS FROM THE CURRENT USER'S SOCIETY
  ========================================================= */

  const loadUserReports = () => {
    try {
      const storedReports = JSON.parse(localStorage.getItem("sociosphere_user_reports") || "[]");
      const authorityIssues = getIssues();
      const authorityCrimes = getCrimes();

      // Merge all items: authority issues, authority crimes, and user reports
      const combinedMap = new Map();

      // 1. Add authority issues
      (authorityIssues || []).forEach((item) => {
        if (item && item.id) {
          combinedMap.set(item.id, { ...item, reportType: item.reportType || "civic" });
        }
      });

      // 2. Add authority crimes
      (authorityCrimes || []).forEach((item) => {
        if (item && item.id) {
          combinedMap.set(item.id, { ...item, reportType: "crime" });
        }
      });

      // 3. Add stored user reports
      (storedReports || []).forEach((item) => {
        if (item && item.id) {
          const isCrime = item.reportType === "crime" || item.id.startsWith("CRM-");
          combinedMap.set(item.id, { ...item, reportType: isCrime ? "crime" : "civic" });
        }
      });

      const userSociety = (user?.society || user?.communityName || 'Gandhi Colony').trim();
      const userEmail = (user?.email || '').trim().toLowerCase();
      const userId = user?.id;
      const userCommunityId = user?.communityId;

      // Filter reports strictly to this citizen's society (or items reported by this citizen)
      const societyReports = Array.from(combinedMap.values()).filter((item) => {
        if (!item) return false;
        // Direct reporter match
        if (userEmail && item.reportedByEmail && item.reportedByEmail.trim().toLowerCase() === userEmail) return true;
        if (userId && item.reportedById && item.reportedById === userId) return true;

        // Society match
        const itemSoc = (item.society || item.communityName || item.colony || item.colonyName || '').trim().toLowerCase();
        if (itemSoc && itemSoc === userSociety.toLowerCase()) return true;
        if (userCommunityId && item.communityId && item.communityId === userCommunityId) return true;

        // Default seed backwards compatibility for Gandhi Colony
        if (userSociety.toLowerCase() === 'gandhi colony' && (itemSoc === 'green meadows heights' || !itemSoc)) {
          return true;
        }

        return false;
      });

      const normalized = societyReports.map((report) => {
        const isCrime = isCrimeReport(report);
        return {
          ...report,
          priority: report.priority || (report.severity ? `${report.severity} Priority` : isCrime ? "High Priority" : "Medium Priority"),
          priorityClass: report.priorityClass || (report.severity || (isCrime ? "critical" : "medium")).toLowerCase(),
          status: report.status || "In Progress",
          statusClass: report.statusClass || (report.status === "Resolved" ? "resolved" : "progress"),
          date: report.date || (report.createdAt || report.timestamp ? new Date(report.createdAt || report.timestamp).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) : "Recently"),
          eta: report.eta || report.aiAnalysis?.estimatedResolutionTime || (isCrime ? "Security Dispatched" : "Pending Dispatch"),
          image: report.image || null,
          reportType: isCrime ? "crime" : "civic",
        };
      });

      setUserReports(normalized);
    } catch (error) {
      console.error("Failed to load user reports:", error);
      setUserReports([]);
    }
  };

  /* =========================================================
     LOAD ON USER CHANGE + DATA UPDATE
  ========================================================= */

  useEffect(() => {
    loadUserReports();

    window.addEventListener("sociosphere_data_updated", loadUserReports);
    window.addEventListener("sociosphere_crimes_updated", loadUserReports);
    window.addEventListener("storage", loadUserReports);

    return () => {
      window.removeEventListener("sociosphere_data_updated", loadUserReports);
      window.removeEventListener("sociosphere_crimes_updated", loadUserReports);
      window.removeEventListener("storage", loadUserReports);
    };
  }, [user?.email, user?.id, user?.communityName, user?.society]);

  /* =========================================================
     QUICK ACTIONS
  ========================================================= */

  const handleQuickAction = (title) => {
    if (title === "Report Issue") {
      navigate("/citizen/report");
      return;
    }

    if (title === "Report Crime") {
      navigate("/citizen/report-crime");
      return;
    }

    if (title === "Lost & Found") {
      navigate("/citizen/lost-found");
      return;
    }

    if (title === "Expenses") {
      navigate("/citizen/expenses");
      return;
    }

    if (title === "Emergency") {
      navigate("/citizen/emergency");
      return;
    }

    if (title === "Community Hub") {
      navigate("/citizen/community");
      return;
    }
  };

  const isOwnReport = (report) => {
    const currentEmail = user?.email?.trim().toLowerCase();
    return Boolean(
      (user?.id && report?.reportedById === user.id) ||
      (currentEmail &&
        report?.reportedByEmail?.trim().toLowerCase() === currentEmail)
    );
  };

  const handleDeleteReport = (report) => {
    if (!isOwnReport(report)) {
      showToast("You can only delete reports submitted by you.");
      return;
    }

    if (!window.confirm("Delete this report? This action cannot be undone.")) {
      return;
    }

    const remainingIssues = getIssues().filter((issue) => issue.id !== report.id);
    saveIssues(remainingIssues);
    if (isCrimeReport(report)) {
      deleteCrime(report.id);
    }

    const storedReports = JSON.parse(
      localStorage.getItem("sociosphere_user_reports") || "[]"
    );
    localStorage.setItem(
      "sociosphere_user_reports",
      JSON.stringify(storedReports.filter((issue) => issue.id !== report.id))
    );
    window.dispatchEvent(new Event("sociosphere_data_updated"));
    showToast("Report deleted.");
  };

  /* =========================================================
     SEPARATE CIVIC + CRIME
  ========================================================= */

  const userCivicReports = userReports.filter(
    (item) => item?.id && !isCrimeReport(item)
  );

  const userCrimeReports = userReports.filter(
    (item) => item?.id && isCrimeReport(item)
  );

  const mixedReports = [];
  for (let index = 0; index < Math.max(userCivicReports.length, userCrimeReports.length); index += 1) {
    if (userCivicReports[index]) mixedReports.push(userCivicReports[index]);
    if (userCrimeReports[index]) mixedReports.push(userCrimeReports[index]);
  }
  const filteredReports = mixedReports.filter((report) => {
    const isCrime = isCrimeReport(report);
    if (reportTypeFilter === "crime" && !isCrime) return false;
    if (reportTypeFilter === "civic" && isCrime) return false;

    const query = reportSearch.trim().toLowerCase();
    return (
      !query ||
      [report.title, report.category, report.description, report.location]
        .some((value) => value?.toLowerCase().includes(query))
    );
  });
  const atGlanceIssues = showAllIssues ? filteredReports : filteredReports.slice(0, 3);

  const displayedCivicIssues = userCivicReports;
  const displayedCrimeIssues = userCrimeReports;

  /* =========================================================
     GET ISSUE ICON
  ========================================================= */

  const getIssueIcon = (issue) => {
    if (issue.icon) return issue.icon;

    const category = (
      issue?.category || ""
    ).toLowerCase();

    if (
      category.includes("water") ||
      category.includes("leak")
    ) {
      return Droplets;
    }

    if (category.includes("drain")) {
      return AlertTriangle;
    }

    if (
      category.includes("light") ||
      category.includes("electric")
    ) {
      return Zap;
    }

    if (
      category.includes("waste") ||
      category.includes("garbage") ||
      category.includes("bin")
    ) {
      return Trash2;
    }

    if (
      category.includes("crime") ||
      category.includes("theft") ||
      category.includes("vandalism") ||
      category.includes("harassment") ||
      category.includes("safety") ||
      category.includes("nuisance") ||
      category.includes("cyber")
    ) {
      return ShieldAlert;
    }

    return AlertTriangle;
  };

  /* =========================================================
     CIVIC FILTERING
  ========================================================= */

  const filteredCivicIssues =
    displayedCivicIssues.filter((issue) => {
      if (activeCivicTab === "progress") {
        return (
          issue.status === "In Progress" ||
          issue.status === "Pending Dispatch"
        );
      }

      if (activeCivicTab === "resolved") {
        return issue.status === "Resolved";
      }

      if (activeCivicTab === "high") {
        return (
          issue.priorityClass === "high" ||
          issue.priorityClass === "critical" ||
          (issue.priority &&
            issue.priority
              .toUpperCase()
              .includes("HIGH")) ||
          (issue.priority &&
            issue.priority
              .toUpperCase()
              .includes("CRITICAL"))
        );
      }

      return true;
    });

  const civicInProgressCount =
    displayedCivicIssues.filter(
      (issue) =>
        issue.status === "In Progress" ||
        issue.status === "Pending Dispatch"
    ).length;

  const civicResolvedCount =
    displayedCivicIssues.filter(
      (issue) => issue.status === "Resolved"
    ).length;

  const civicHighCriticalCount =
    displayedCivicIssues.filter(
      (issue) =>
        issue.priorityClass === "high" ||
        issue.priorityClass === "critical" ||
        (issue.priority &&
          issue.priority
            .toUpperCase()
            .includes("HIGH")) ||
        (issue.priority &&
          issue.priority
            .toUpperCase()
            .includes("CRITICAL"))
    ).length;

  /* =========================================================
     CRIME FILTERING
  ========================================================= */

  const filteredCrimeIssues =
    displayedCrimeIssues.filter((crime) => {
      if (activeCrimeTab === "active") {
        return (
          crime.status === "In Progress" ||
          crime.status === "Security Dispatched" ||
          crime.status === "Pending Dispatch"
        );
      }

      if (activeCrimeTab === "resolved") {
        return (
          crime.status === "Resolved" ||
          crime.status === "Logged"
        );
      }

      if (activeCrimeTab === "critical") {
        return (
          crime.priorityClass === "critical" ||
          (crime.priority &&
            crime.priority
              .toUpperCase()
              .includes("CRITICAL")) ||
          (crime.priority &&
            crime.priority
              .toUpperCase()
              .includes("HIGH"))
        );
      }

      return true;
    });

  const crimeActiveCount =
    displayedCrimeIssues.filter(
      (issue) =>
        issue.status === "In Progress" ||
        issue.status === "Security Dispatched" ||
        issue.status === "Pending Dispatch"
    ).length;

  const crimeResolvedCount =
    displayedCrimeIssues.filter(
      (issue) =>
        issue.status === "Resolved" ||
        issue.status === "Logged"
    ).length;

  const crimeCriticalCount =
    displayedCrimeIssues.filter(
      (issue) =>
        issue.priorityClass === "critical" ||
        (issue.priority &&
          issue.priority
            .toUpperCase()
            .includes("CRITICAL")) ||
        (issue.priority &&
          issue.priority
            .toUpperCase()
            .includes("HIGH"))
    ).length;

  const userSociety = user?.society || user?.communityName || 'Gandhi Colony';
  const userSocietyCode = user?.societyCode || (
    userSociety === 'Gandhi Colony' ? 'GC-101' :
    userSociety === 'Shayam Nagar' ? 'SN-202' : 'DV-303'
  );

  const displayName = user?.name && !user.name.includes("@")
    ? user.name.split(" ")[0]
    : "Resident";
  const currentHour = new Date().getHours();
  const timeGreeting =
    currentHour >= 5 && currentHour < 12
      ? "Good morning"
      : currentHour >= 12 && currentHour < 17
        ? "Good afternoon"
        : currentHour >= 17 && currentHour < 21
          ? "Good evening"
          : "Good night";

  const getProgressStep = (issue) => {
    if (issue.status === "Resolved") return 4;
    if (issue.status === "In Progress" || issue.status === "Security Dispatched") return 3;
    if (issue.status === "Pending Dispatch") return 2;
    return 1;
  };

  return (
    <div
      className={`home-page ${
        theme === "dark"
          ? "dark-mode"
          : "light-mode"
      }`}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="home-navbar">
        <div className="navbar-inner">
<div
            className="location-section"
            title={`Current weather in ${userSociety}: ${weather.description || weather.condition || "Clear sky"}, ${weather.temp ?? 26}°C`}
          >
            <span className="weather-inline-chip">
              <span className="weather-inline-icon" role="img" aria-label={weather.condition || "weather"}>
                {getWeatherEmoji(weather.condition)}
              </span>
              <span className="weather-inline-temp">
                {weather.temp != null ? `${weather.temp}°C` : "26°C"}
              </span>
            </span>
            <span className="location-divider" aria-hidden="true">|</span>
            <MapPin size={16} className="location-pin-icon text-emerald-500" />
            <span className="community-name-text font-bold">{userSociety}</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
              {userSocietyCode}
            </span>
            <span className="online-dot" title="Colony live" />
          </div>
        </div>
      </header>

      {/* =====================================================
          COLONY IMPORTANT ANNOUNCEMENT (MARQUEE)
      ===================================================== */}
      <section className="colony-ticker-section" aria-label="Colony Announcements">
        <div className="ticker-badge">
          <Megaphone size={14} className="ticker-badge-icon" />
          <span>Notice</span>
        </div>

        <div
          className="ticker-track"
          onClick={() => navigate("/citizen/announcements")}
          title="Click to view all announcements"
        >
          <marquee
            behavior="scroll"
            direction="left"
            scrollamount="5"
            className="ticker-marquee"
            onMouseEnter={(e) => e.target.stop()}
            onMouseLeave={(e) => e.target.start()}
          >
            {(colonyAnnouncements.length > 0
              ? colonyAnnouncements
              : [
                  {
                    id: "default-colony-notice",
                    title: `Welcome to ${user?.communityName || "Your Colony"} Portal`,
                    content: "Stay updated with recent notices, report local civic concerns, and connect with your neighbours.",
                    important: true,
                    category: "Notice",
                  },
                ]
            ).map((ann, idx) => (
              <span key={ann.id || idx} className="ticker-item">
                {ann.important && (
                  <span className="ticker-pill-urgent">IMPORTANT</span>
                )}
                <span className="ticker-category">[{ann.category || "Notice"}]</span>
                <strong className="ticker-title">{ann.title}</strong>
                {ann.content && (
                  <span className="ticker-desc">— {ann.content}</span>
                )}
                <span className="ticker-sep">✦</span>
              </span>
            ))}
          </marquee>
        </div>

        <button
          type="button"
          onClick={() => navigate("/citizen/announcements")}
          className="ticker-action-btn"
          title="View all colony announcements"
        >
          <span>View all</span>
          <ChevronRight size={14} />
        </button>
      </section>

      <section className="home-welcome">
        <h1>{timeGreeting}, {displayName}</h1>
        <p>{t("welcomeTitle", "A better neighbourhood starts with you")}</p>
      </section>

      {/* =====================================================
          NOTIFICATIONS
      ===================================================== */}

      {showNotifications && (
        <div className="notification-panel">
          <div className="notification-header">
            <strong>Notifications</strong>

            <button
              onClick={() =>
                setShowNotifications(false)
              }
              aria-label="Close notifications"
            >
              <X size={16} />
            </button>
          </div>

          <div className="notification-item">
            <CheckCircle2 size={17} />

            <span>
              Your streetlight issue has been resolved.
            </span>
          </div>

          <div className="notification-item">
            <Bell size={17} />

            <span>
              New community announcement available.
            </span>
          </div>

          <div className="notification-item">
            <AlertTriangle size={17} />

            <span>
              Drainage issue reported near Block B.
            </span>
          </div>
        </div>
      )}

      {/* ===================================================
          QUICK ACTIONS
      =================================================== */}

      <section className="section-header quick-header">
          <h2>Quick Civic Actions</h2>
           
        </section>

        <section className="quick-actions">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                className={`quick-action-card ${action.className}`}
                onClick={() =>
                  handleQuickAction(action.title)
                }
              >
                <div className="action-icon">
                  <Icon size={23} />
                </div>

                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
              </button>
            );
          })}
        </section>

        {/* ── Issues at a Glance — card grid ── */}
        <section className="mt-8">
          {/* Section header */}
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">Your Reports</p>
              <h2 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">Issues at a glance</h2>
            </div>
            {userReports.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowReportFilters((show) => !show)}
                    aria-expanded={showReportFilters}
                    aria-haspopup="true"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500"
                  >
                    <SlidersHorizontal size={14} />
                    Search & filter
                    <ChevronDown size={14} className={showReportFilters ? "rotate-180 transition-transform" : "transition-transform"} />
                  </button>
                  {showReportFilters && (
                    <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-[#0D1524]">
                      <label className="mb-3 block">
                        <span className="mb-1.5 block text-[11px] font-bold text-slate-500 dark:text-slate-400">Search reports</span>
                        <span className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-900">
                          <Search size={14} className="shrink-0 text-slate-400" />
                          <input
                            type="search"
                            value={reportSearch}
                            onChange={(event) => setReportSearch(event.target.value)}
                            placeholder="Title, category, location..."
                            className="w-full bg-transparent py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
                          />
                        </span>
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-bold text-slate-500 dark:text-slate-400">Report type</span>
                        <select
                          value={reportTypeFilter}
                          onChange={(event) => setReportTypeFilter(event.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        >
                          <option value="all">All reports</option>
                          <option value="civic">Community issues</option>
                          <option value="crime">Crime & safety</option>
                        </select>
                      </label>
                    </div>
                  )}
                </div>
                {filteredReports.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowAllIssues((show) => !show)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                  >
                    {showAllIssues ? "Show less" : "View all"}
                    <ChevronRight size={13} className={showAllIssues ? "rotate-90 transition-transform" : "transition-transform"} />
                  </button>
                )}
              </div>
            )}
          </div>

          {atGlanceIssues.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {atGlanceIssues.map((issue) => {
                const Icon = getIssueIcon(issue);
                const isCrime = isCrimeReport(issue);

                // Status chip styles
                const statusStyle =
                  issue.status === "Resolved"
                    ? { bg: "bg-emerald-100 dark:bg-emerald-500/15", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" }
                    : issue.status === "In Progress"
                    ? { bg: "bg-blue-100 dark:bg-blue-500/15", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" }
                    : issue.status === "Pending Dispatch"
                    ? { bg: "bg-amber-100 dark:bg-amber-500/15", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" }
                    : { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", dot: "bg-slate-400" };

                // Card accent colours based on category
                const cat = (issue.category || "").toLowerCase();
                const accentMap = isCrime
                  ? { from: "from-rose-500", via: "via-rose-400", iconBg: "bg-rose-500/15 dark:bg-rose-500/20", iconText: "text-rose-600 dark:text-rose-400", border: "border-rose-100 dark:border-rose-500/20" }
                  : cat.includes("water") || cat.includes("drain") || cat.includes("leak")
                  ? { from: "from-blue-500", via: "via-cyan-400", iconBg: "bg-blue-500/15 dark:bg-blue-500/20", iconText: "text-blue-600 dark:text-blue-400", border: "border-blue-100 dark:border-blue-500/20" }
                  : cat.includes("light") || cat.includes("electric")
                  ? { from: "from-amber-400", via: "via-yellow-300", iconBg: "bg-amber-500/15 dark:bg-amber-500/20", iconText: "text-amber-600 dark:text-amber-400", border: "border-amber-100 dark:border-amber-500/20" }
                  : cat.includes("waste") || cat.includes("garbage")
                  ? { from: "from-lime-500", via: "via-green-400", iconBg: "bg-lime-500/15 dark:bg-lime-500/20", iconText: "text-lime-700 dark:text-lime-400", border: "border-lime-100 dark:border-lime-500/20" }
                  : { from: "from-emerald-500", via: "via-teal-400", iconBg: "bg-emerald-500/15 dark:bg-emerald-500/20", iconText: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-500/20" };

                return (
                  <article
                    key={issue.id}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:bg-[#0D1524] ${accentMap.border}`}
                  >
                    {/* ── Image banner ── */}
                    {(() => {
                      const cat = (issue.category || "").toLowerCase();
                      const hasReporterPhoto =
                        typeof issue.image === "string" &&
                        (issue.image.startsWith("data:image/") ||
                          issue.image.startsWith("blob:") ||
                          Boolean(issue.photoName));
                      const imgSrc = hasReporterPhoto || (isCrime && issue.image)
                        ? issue.image
                        : isCrime
                        ? "/crime-report.png"
                        : cat.includes("drain")
                        ? "/drain-overflow.png"
                        : cat.includes("water") || cat.includes("plumb") || cat.includes("leak")
                        ? "/water-leakage.png"
                        : cat.includes("electric") || cat.includes("light")
                        ? "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80"
                        : cat.includes("waste") || cat.includes("sanit") || cat.includes("garbage")
                        ? "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80"
                        : cat.includes("road") || cat.includes("pavement") || cat.includes("pathway") || cat.includes("pothole")
                        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmEI1a3MbcihRTmVvck3WhEVfmasBa-ctRKSRIHAKJaa1b-zl4MlBX36xl&s=10"
                        : cat.includes("park") || cat.includes("recreation") || cat.includes("playground") || cat.includes("swing")
                        ? "https://images.unsplash.com/photo-1678801675345-7af0e20207c2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                        : issue.image || "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=600&q=80";

                      return (
                        <div className="relative h-[140px] overflow-hidden rounded-t-2xl">
                          <img
                            src={imgSrc}
                            alt={issue.title || issue.category || "Issue"}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                          {/* Dark overlay for legibility */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                          {/* Type badge — bottom-left over image */}
                          <div className="absolute bottom-3 left-3 flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow ${isCrime ? "bg-rose-600/90" : "bg-emerald-600/90"}`}>
                              <Icon size={10} />
                              {isCrime ? "Crime" : issue.category || "Civic"}
                            </span>
                          </div>

                          {/* Status badge — bottom-right over image */}
                          <div className="absolute bottom-3 right-3">
                            <span className={`inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white shadow backdrop-blur-sm`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                              {issue.status}
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Card body */}
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-slate-800 dark:text-slate-100">
                        {issue.title}
                      </h3>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {issue.category}
                      </p>

                      {/* Footer */}
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                        {issue.date ? (
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                            <Clock size={11} />
                            {issue.date}
                          </span>
                        ) : (
                          <span />
                        )}
                        <div className="flex items-center gap-2">
                          {isOwnReport(issue) && (
                            <button
                              type="button"
                              onClick={() => handleDeleteReport(issue)}
                              aria-label={`Delete your report: ${issue.title}`}
                              className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-500/10 dark:text-rose-400"
                            >
                              <Trash2 size={13} />
                              Delete
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => { setSelectedIssue(issue); setShowIssueTimeline(false); }}
                            className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition ${accentMap.iconText} ${accentMap.iconBg} hover:opacity-80`}
                          >
                            Details
                            <ChevronRight size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center dark:border-slate-800 dark:bg-[#0D1524]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <FileText size={26} />
              </div>
              {filteredReports.length === 0 && userReports.length > 0 ? (
                <>
                  <p className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300">No matching reports</p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Try another search or report type.</p>
                  <button
                    type="button"
                    onClick={() => { setReportSearch(""); setReportTypeFilter("all"); }}
                    className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300"
                  >
                    Clear filters
                  </button>
                </>
              ) : (
                <>
                  <p className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300">No reports yet</p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Reports you submit will appear here</p>
                  <button
                    type="button"
                    onClick={() => navigate("/citizen/report")}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-500"
                  >
                    <Plus size={14} /> Report an issue
                  </button>
                </>
              )}
            </div>
          )}
        </section>



        <div className="hidden">
        {/* ===================================================
            CIVIC ISSUES
        =================================================== */}

        <section className="issues-section">
          <div className="issues-heading">
            <div>
              <h2>
                Society Civic Issues

                <span className="count-badge">
                  {displayedCivicIssues.length}
                </span>
              </h2>

              <p>
                Track civic reports and resolution progress across
                your society
              </p>
            </div>

            <div className="filter-tabs">
              <button
                className={
                  activeCivicTab === "all"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveCivicTab("all")
                }
              >
                All Issues (
                {displayedCivicIssues.length})
              </button>

              <button
                className={
                  activeCivicTab === "progress"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveCivicTab("progress")
                }
              >
                In Progress ({civicInProgressCount})
              </button>

              <button
                className={
                  activeCivicTab === "resolved"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveCivicTab("resolved")
                }
              >
                Resolved ({civicResolvedCount})
              </button>

              <button
                className={
                  activeCivicTab === "high"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveCivicTab("high")
                }
              >
                High / Critical (
                {civicHighCriticalCount})
              </button>
            </div>
          </div>

          <div className="issues-grid">
            {filteredCivicIssues.length === 0 ? (
              <div className="empty-state civic-empty-state">
                No issues reported yet.
              </div>
            ) : (
              filteredCivicIssues.map((issue) => {
                const Icon = getIssueIcon(issue);

                return (
                  <article
                    className="issue-card"
                    key={issue.id}
                  >
                    <div className="issue-top">
                      <div
                        className={`category-badge ${
                          issue.priorityClass ||
                          "medium"
                        }`}
                      >
                        <Icon size={15} />
                        {issue.category}
                      </div>

                      <div
                        className={`priority-badge ${
                          issue.priorityClass ||
                          "medium"
                        }`}
                      >
                        {issue.priority}
                      </div>

                      <div
                        className={`status-badge ${
                          issue.statusClass ||
                          "progress"
                        }`}
                      >
                        {issue.status === "Resolved" ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <Clock size={14} />
                        )}

                        {issue.status}
                      </div>
                    </div>

                    <div className="issue-body">
                      {issue.image ? (
                        <img
                          className="issue-image"
                          src={issue.image}
                          alt={issue.title}
                        />
                      ) : null}

                      <div className="issue-details">
                        <span className="issue-id">
                          {issue.id}
                        </span>

                        <h3>{issue.title}</h3>

                        <p>
                          {issue.description}
                        </p>

                        <div className="issue-location">
                          <MapPin size={15} />
                          {issue.location}
                        </div>
                      </div>
                    </div>

                    <div className="issue-progress" aria-label={`Report progress: step ${getProgressStep(issue)} of 4`}>
                      {["Reported", "Reviewed", "Assigned", "Resolved"].map((step, index) => (
                        <span key={step} className={index < getProgressStep(issue) ? "complete" : ""}>
                          <i />
                          <em>{step}</em>
                        </span>
                      ))}
                    </div>

                    <div className="issue-footer">
                      <div className="issue-time">
                        <span>{issue.date}</span>

                        <span>•</span>

                        <strong>
                          ETA: {issue.eta || "Pending"}
                        </strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          className="timeline-button"
                          onClick={() =>
                            showToast(
                              `Tracking timeline for ${issue.id}`
                            )
                          }
                        >
                          View Timeline

                          <ChevronRight size={16} />
                        </button>

                        {isOwnReport(issue) ? (
                          <button
                            type="button"
                            className="timeline-button text-rose-500 hover:text-rose-400"
                            onClick={() => handleDeleteReport(issue)}
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        </div>

        <div className="hidden">
        {/* ===================================================
            CRIME & SAFETY
        =================================================== */}

        <section className="issues-section mt-10">
          <div className="issues-heading">
            <div>
              <h2 className="text-rose-400 flex items-center gap-2">
                <ShieldAlert
                  size={22}
                  className="text-rose-400"
                />

                Reported Crime & Safety Incidents

                <span className="count-badge crime-badge">
                  {displayedCrimeIssues.length}
                </span>
              </h2>

              <p>
                Live security patrol dispatch, threat level
                triage, and law enforcement logging
              </p>
            </div>

            <div className="filter-tabs">
              <button
                className={
                  activeCrimeTab === "all"
                    ? "active-crime"
                    : ""
                }
                onClick={() =>
                  setActiveCrimeTab("all")
                }
              >
                All Incidents (
                {displayedCrimeIssues.length})
              </button>

              <button
                className={
                  activeCrimeTab === "active"
                    ? "active-crime"
                    : ""
                }
                onClick={() =>
                  setActiveCrimeTab("active")
                }
              >
                Security Active ({crimeActiveCount})
              </button>

              <button
                className={
                  activeCrimeTab === "resolved"
                    ? "active-crime"
                    : ""
                }
                onClick={() =>
                  setActiveCrimeTab("resolved")
                }
              >
                Resolved ({crimeResolvedCount})
              </button>

              <button
                className={
                  activeCrimeTab === "critical"
                    ? "active-crime"
                    : ""
                }
                onClick={() =>
                  setActiveCrimeTab("critical")
                }
              >
                Critical Threats ({crimeCriticalCount})
              </button>
            </div>
          </div>

          <div className="issues-grid">
            {filteredCrimeIssues.length === 0 ? (
              <div className="empty-state crime-empty-state">
                No crime or safety incidents reported yet.
              </div>
            ) : (
              filteredCrimeIssues.map((crime) => {
                const Icon = getIssueIcon(crime);

                return (
                  <article
                    className="issue-card border-rose-500/30"
                    key={crime.id}
                  >
                    <div className="issue-top">
                      <div className="category-badge critical">
                        <Icon size={15} />
                        {crime.category}
                      </div>

                      <div
                        className={`priority-badge ${
                          crime.priorityClass ||
                          "critical"
                        }`}
                      >
                        {crime.priority}
                      </div>

                      <div
                        className={`status-badge ${
                          crime.statusClass ||
                          "progress"
                        }`}
                      >
                        {crime.status === "Resolved" ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <Clock size={14} />
                        )}

                        {crime.status}
                      </div>
                    </div>

                    <div className="issue-body">
                      {crime.image ? (
                        <img
                          className="issue-image border border-rose-500/20"
                          src={crime.image}
                          alt={crime.title}
                        />
                      ) : null}

                      <div className="issue-details">
                        <span className="issue-id text-rose-400">
                          {crime.id}
                        </span>

                        <h3>{crime.title}</h3>

                        <p>
                          {crime.description}
                        </p>

                        <div className="issue-location text-rose-400">
                          <MapPin size={15} />
                          {crime.location}
                        </div>
                      </div>
                    </div>

                    <div className="issue-progress" aria-label={`Report progress: step ${getProgressStep(crime)} of 4`}>
                      {["Reported", "Reviewed", "Assigned", "Resolved"].map((step, index) => (
                        <span key={step} className={index < getProgressStep(crime) ? "complete" : ""}>
                          <i />
                          <em>{step}</em>
                        </span>
                      ))}
                    </div>

                    <div className="issue-footer">
                      <div className="issue-time">
                        <span>{crime.date}</span>

                        <span>•</span>

                        <strong className="text-rose-300">
                          Status:{" "}
                          {crime.eta ||
                            "Security Dispatched"}
                        </strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          className="timeline-button text-rose-400 hover:text-rose-300"
                          onClick={() =>
                            showToast(
                              `Tracking security dispatch for ${crime.id}`
                            )
                          }
                        >
                          View Timeline

                          <ChevronRight size={16} />
                        </button>

                        {isOwnReport(crime) ? (
                          <button
                            type="button"
                            className="timeline-button text-rose-500 hover:text-rose-400"
                            onClick={() => handleDeleteReport(crime)}
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        </div>

        {/* ===================================================
            COMMUNITY OVERVIEW
        =================================================== */}

<section className="community-overview mt-10">
          <div
            className="overview-card"
            onClick={() => navigate("/citizen/events")}
            title="View Upcoming Colony Events"
          >
            <div className="overview-icon">
              <Calendar size={20} />
            </div>

            <div>
              <span>UPCOMING EVENTS</span>

              <strong>
                Holi Milan & Spring Carnival
              </strong>

              <p>
                Tomorrow • 10:00 AM • Open Amphitheatre
              </p>
            </div>
          </div>

          <div
            className="overview-card"
            onClick={() => navigate("/citizen/community")}
            title="Open Community Hub"
          >
            <div className="overview-icon icon-purple">
              <Users size={20} />
            </div>

            <div>
              <span>COMMUNITY HUB</span>

              <strong>
                Resident Polls & Clubs
              </strong>

              <p>
                Vote on colony proposals & connect with neighbours
              </p>
            </div>
          </div>

          <div
            className="overview-card"
            onClick={() => navigate("/citizen/expenses")}
            title="View Society Expenses & Finances"
          >
            <div className="overview-icon icon-yellow">
              <CreditCard size={20} />
            </div>

            <div>
              <span>SOCIETY FINANCES</span>

              <strong>
                Monthly Expense Ledger
              </strong>

              <p>
                100% transparent society funds & collections
              </p>
            </div>
          </div>
        </section>

      {selectedIssue && createPortal(
        <div
          className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedIssue(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="issue-details-title"
        >
          <section
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-[#0D1524]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{showIssueTimeline ? "Issue timeline" : "Issue details"}</p>
                <h2 id="issue-details-title" className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">{selectedIssue.title}</h2>
              </div>
              <button type="button" onClick={() => setSelectedIssue(null)} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white" aria-label="Close issue details"><X size={20} /></button>
            </div>

            {showIssueTimeline ? (
              <div className="mt-6 space-y-4">
                {(selectedIssue.timeline?.length ? selectedIssue.timeline : [{ step: "Reported", date: selectedIssue.date || "Recently", note: "Your report has been received." }]).map((entry, index) => (
                  <div key={`${entry.step}-${index}`} className="flex gap-3">
                    <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-emerald-500 ring-4 ring-emerald-500/15" />
                    <div><p className="text-sm font-bold text-slate-800 dark:text-slate-100">{entry.step}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{entry.date}</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{entry.note}</p></div>
                  </div>
                ))}
                <button type="button" onClick={() => setShowIssueTimeline(false)} className="mt-2 text-sm font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">Back to details</button>
              </div>
            ) : (
              <div className="mt-6">
                <div className="flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{selectedIssue.category}</span><span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-400">{selectedIssue.status}</span></div>
                <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">{selectedIssue.description || "No additional description was provided."}</p>
                <p className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><MapPin size={16} />{selectedIssue.location || "Location not provided"}</p>
                <button type="button" onClick={() => setShowIssueTimeline(true)} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500"><Clock size={16} />View timeline</button>
              </div>
            )}
          </section>
        </div>,
        document.body
      )}

      {/* =====================================================
          REPORT ISSUE MODAL
      ===================================================== */}

      {activeModal === "report" && (
        <div
          className="modal-overlay"
          onClick={() => setActiveModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            backgroundColor: "rgba(3, 7, 18, 0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "920px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "20px",
              backgroundColor: "#070B14",
              border: "1px solid #1E293B",
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
            }}
          >
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                zIndex: 30,
                padding: "8px",
                borderRadius: "12px",
                backgroundColor: "#1E293B",
                color: "#94A3B8",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <Report
              onClose={() => setActiveModal(null)}
              isEmbedded={true}
              onSuccess={() => {
                loadUserReports();

                showToast(
                  "Issue report logged & saved!"
                );
              }}
            />
          </div>
        </div>
      )}

      {/* =====================================================
          REPORT CRIME MODAL
      ===================================================== */}

      {activeModal === "reportCrime" && (
        <div
          className="modal-overlay"
          onClick={() => setActiveModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            backgroundColor: "rgba(3, 7, 18, 0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "920px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "20px",
              backgroundColor: "#070B14",
              border: "1px solid #1E293B",
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
            }}
          >
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                zIndex: 30,
                padding: "8px",
                borderRadius: "12px",
                backgroundColor: "#1E293B",
                color: "#94A3B8",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <ReportCrime
              onClose={() => setActiveModal(null)}
              isEmbedded={true}
              onSuccess={() => {
                loadUserReports();

                showToast(
                  "Crime report logged & security notified!"
                );
              }}
            />
          </div>
        </div>
      )}

      {/* =====================================================
          COMING SOON MODAL
      ===================================================== */}

      {comingSoonFeature && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/10 p-4 backdrop-blur-sm dark:bg-slate-950/15"
          onClick={() =>
            setComingSoonFeature(null)
          }
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-[#0D1524]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles size={22} />
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {comingSoonFeature}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                This feature is currently under
                development and will be available soon
                on SocioSphere.
              </p>

              <button
                onClick={() =>
                  setComingSoonFeature(null)
                }
                className="mt-6 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-emerald-500 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
              >
                Got it
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* =====================================================
          TOAST
      ===================================================== */}

      {toast && (
        <div className="home-toast">
          {toast}
        </div>
      )}
    </div>
  );
}

function WeatherBox({ weather }) {
  const [now, setNow] = useState(() => new Date());
  const icon = getWeatherEmoji(weather.condition);
  const description = weather.description
    ? weather.description.charAt(0).toUpperCase() + weather.description.slice(1)
    : weather.loading
      ? "Getting latest conditions"
      : "Weather unavailable";
  const time = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(interval);
  }, []);

  const metrics = [
    { label: "Humidity", value: weather.humidity == null ? "--" : weather.humidity + "%", icon: Droplets },
    { label: "Wind", value: weather.windSpeed == null ? "--" : weather.windSpeed + " km/h", icon: Zap },
    { label: "Pressure", value: weather.pressure == null ? "--" : weather.pressure + " hPa", icon: Gauge },
    { label: "Clouds", value: weather.cloudCoverage == null ? "--" : weather.cloudCoverage + "%", icon: Cloud },
  ];

  return (
    <section className="weather-card" aria-label="Current weather">
      <div className="weather-card-heading">
        <h2>Current Weather</h2>
        <span>{time}</span>
      </div>

      <div className="weather-card-current">
        <span className="weather-card-icon" aria-hidden="true">
          {weather.loading ? "..." : icon}
        </span>
        <div className="weather-card-reading">
          <div className="weather-card-temperature">
            {weather.temp == null ? "26" : weather.temp}
            <span>&deg;C</span>
          </div>
          <p>{description}</p>
        </div>
      </div>

      <div className="weather-card-metrics">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div className="weather-metric" key={label}>
            <Icon size={17} aria-hidden="true" />
            <span>{value}</span>
            <small>{label}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
