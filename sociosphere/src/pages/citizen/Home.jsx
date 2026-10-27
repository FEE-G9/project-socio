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
import { getCrimes } from "../../data/mockCrimes";
import { getAnnouncements } from "../../data/mockAnnouncements";
// import Map from "./Map";

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
  if (c.includes("thunder")) return "â›ˆï¸";
  if (c.includes("drizzle") || c.includes("rain")) return "ðŸŒ§ï¸";
  if (c.includes("snow")) return "â„ï¸";
  if (c.includes("mist") || c.includes("fog") || c.includes("haze")) return "ðŸŒ«ï¸";
  if (c.includes("few") || c.includes("partly") || c.includes("scatter")) return "ðŸŒ¤ï¸";
  if (c.includes("cloud") || c.includes("overcast")) return "â›…";
  if (c.includes("clear") || c.includes("sun")) return "â˜€ï¸";
  return "â˜€ï¸";
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
  // {
  //   title: "View Map",
  //   description: "Live community problem heatmap",
  //   icon: MapPin,
  //   className: "action-blue",
  // },
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
        const isCrime = report?.reportType === "crime" || report?.id?.startsWith("CRM-");
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
      report?.reportedById === user?.id ||
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
    (item) =>
      item?.id &&
      !item.id.startsWith("CRM-")
  );

  const userCrimeReports = userReports.filter(
    (item) =>
      item?.id &&
      item.id.startsWith("CRM-")
  );

  const atGlanceIssues = showAllIssues ? userReports : userReports.slice(0, 3);

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
            title={`Current weather in ${userSociety}: ${weather.description || weather.condition || "Clear sky"}, ${weather.temp ?? 26}Â°C`}
          >
            <span className="weather-inline-chip">
              <span className="weather-inline-icon" role="img" aria-label={weather.condition || "weather"}>
                {getWeatherEmoji(weather.condition)}
              </span>
              <span className="weather-inline-temp">
                {weather.temp != null ? `${weather.temp}Â°C` : "26Â°C"}
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
                  <span className="ticker-desc">â€” {ann.content}</span>
                )}
                <span className="ticker-sep">âœ¦</span>
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

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0D1524]">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Issues at a glance</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Your latest civic and safety reports</p>
            </div>
            {userReports.length > 2 && (
              <button
                type="button"
                onClick={() => setShowAllIssues((show) => !show)}
                className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-400"
              >
                {showAllIssues ? "Show less" : "View more"}
                <ChevronRight size={16} className={showAllIssues ? "rotate-90" : ""} />
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {atGlanceIssues.length ? atGlanceIssues.map((issue) => {
              const Icon = getIssueIcon(issue);
              return (
                <article key={issue.id} className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60 sm:px-6">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${issue.reportType === "crime" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}>
                    <Icon size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{issue.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{issue.category} Ã‚Â· {issue.status}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setSelectedIssue(issue); setShowIssueTimeline(false); }}
                    className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                  >
                    View details
                  </button>
                </article>
              );
            }) : <div className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No reports to show yet.</div>}
          </div>
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

                        <span>Ã¢â‚¬Â¢</span>

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

                        <span>Ã¢â‚¬Â¢</span>

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
          <div className="overview-card">
            <div className="overview-icon">
              <Calendar size={20} />
            </div>

            <div>
              <span>UPCOMING</span>

              <strong>
                Holi Milan & Spring Carnival
              </strong>

              <p>
                Tomorrow Ã¢â‚¬Â¢ 10:00 AM Ã¢â‚¬Â¢ Open Amphitheatre
              </p>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">
              <MessageSquare size={20} />
            </div>

            <div>
              <span>COMMUNITY ACTIVITY</span>

              <strong>
                24 new discussions
              </strong>

              <p>
                Residents are actively discussing local
                issues
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
          MAP MODAL
      ===================================================== */}

      {/* {activeModal === "map" && (
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
              maxWidth: "1140px",
              maxHeight: "92vh",
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

            <Map
              onClose={() => setActiveModal(null)}
              isEmbedded={true}
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
