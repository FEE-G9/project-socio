import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

import Report from "./Report";
import ReportCrime from "./ReportCrime";
import Map from "./Map";

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
// import Map from "./Map";

import {
  Shield,
  MapPin,
  Bell,
  Users,
  User,
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
} from "lucide-react";

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
  // {
  //   title: "View Map",
  //   description: "Live community problem heatmap",
  //   icon: MapPin,
  //   className: "action-blue",
  // },
  {
    title: "Community Hub",
    description: "Resident polls, clubs, rides",
    icon: Users,
    className: "action-purple",
  },
  {
    title: "Maintenance",
    description: "Pay dues & view ledger",
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

  const { theme } = useTheme();
  const { user } = useAuth();

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
     INITIAL SAMPLE COLONY REPORTS FOR SEEDING IF EMPTY
  ========================================================= */

  const INITIAL_COLONY_REPORTS = [
    {
      id: "ISSUE-101",
      title: "Main Avenue Water Pipeline Leakage near Block B Park",
      category: "Water Supply & Plumbing",
      priority: "HIGH PRIORITY",
      priorityClass: "high",
      status: "In Progress",
      statusClass: "progress",
      location: "Block B, Near Central Fountain",
      description: "Clean drinking water is leaking profusely from the main pipeline connection. Water pressure in Block B apartments has dropped by 40%.",
      date: "Sep 5, 2026",
      eta: "24 Hours",
      reportedBy: "Aarav Sharma",
      personName: "Aarav Sharma",
      reportedByEmail: "aarav@sociosphere.io",
      communityId: "colony-1",
      communityName: "Green Meadows Heights",
      colony: "Green Meadows Heights",
      reportType: "civic",
      image: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "ISSUE-102",
      title: "Broken Solar Streetlights along Perimeter Road",
      category: "Electrical & Lighting",
      priority: "MEDIUM PRIORITY",
      priorityClass: "medium",
      status: "In Progress",
      statusClass: "progress",
      location: "Perimeter Wall Gate 3 to Gate 4",
      description: "Three consecutive solar streetlights have gone dark since yesterday evening. The stretch is dark during night hours.",
      date: "Sep 6, 2026",
      eta: "48 Hours",
      reportedBy: "Priya Patel",
      personName: "Priya Patel",
      reportedByEmail: "priya@sociosphere.io",
      communityId: "colony-1",
      communityName: "Green Meadows Heights",
      colony: "Green Meadows Heights",
      reportType: "civic",
      image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "ISSUE-103",
      title: "Uncollected Green Waste after Garden Pruning",
      category: "Sanitation & Waste",
      priority: "LOW PRIORITY",
      priorityClass: "low",
      status: "Resolved",
      statusClass: "resolved",
      location: "Community Center Lawn",
      description: "Tree branches and garden clippings were left piled near the recycling bin area following seasonal tree trimming.",
      date: "Sep 2, 2026",
      eta: "Cleared",
      reportedBy: "Rohan Verma",
      personName: "Rohan Verma",
      reportedByEmail: "rohan@sociosphere.io",
      communityId: "colony-1",
      communityName: "Green Meadows Heights",
      colony: "Green Meadows Heights",
      reportType: "civic",
      image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "CRM-2026-104",
      title: "Bicycle Theft Attempt near Underground Parking B2",
      category: "Theft & Burglary Incident",
      priority: "CRITICAL PRIORITY",
      priorityClass: "critical",
      status: "In Progress",
      statusClass: "progress",
      location: "Basement B2, Pillar #14",
      description: "Lock on gear cycle was tampered with between 10 PM and 11 PM. CCTV footage request submitted to security desk.",
      date: "Sep 6, 2026",
      eta: "Security Dispatched",
      reportedBy: "Vikram Malhotra",
      personName: "Vikram Malhotra",
      reportedByEmail: "vikram@sociosphere.io",
      communityId: "colony-1",
      communityName: "Green Meadows Heights",
      colony: "Green Meadows Heights",
      reportType: "crime",
      image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80"
    }
  ];

  /* =========================================================
     LOAD REPORTS OF ALL INDIVIDUALS IN THE SAME COLONY
  ========================================================= */

  const loadUserReports = () => {
    try {
      const currentEmail = user?.email?.trim().toLowerCase();
      const currentUserId = user?.id;
      const userColonyId = user?.communityId || "colony-1";
      const userColonyName = (user?.communityName || "Green Meadows Heights")
        .trim()
        .toLowerCase();

      let storedRaw = localStorage.getItem("sociosphere_user_reports");
      if (!storedRaw) {
        localStorage.setItem(
          "sociosphere_user_reports",
          JSON.stringify(INITIAL_COLONY_REPORTS)
        );
        storedRaw = JSON.stringify(INITIAL_COLONY_REPORTS);
      }

      const storedReports = JSON.parse(storedRaw || "[]");

      const filteredReports = storedReports
        .filter((report) => {
          const reportEmail = report?.reportedByEmail?.trim().toLowerCase();
          const reportColonyId = report?.communityId || report?.colonyId;
          const reportColonyName = (
            report?.communityName ||
            report?.colonyName ||
            report?.colony ||
            ""
          )
            .trim()
            .toLowerCase();

          // Match by current user
          const emailMatches = currentEmail && reportEmail === currentEmail;
          const idMatches = currentUserId && report?.reportedById === currentUserId;

          // Match by colony / community of user
          const colonyIdMatches =
            userColonyId && reportColonyId && reportColonyId === userColonyId;
          const colonyNameMatches =
            userColonyName &&
            reportColonyName &&
            reportColonyName === userColonyName;

          // Fallback matching if report has no colony specified
          const noColonySet = !reportColonyId && !reportColonyName;

          return (
            emailMatches ||
            idMatches ||
            colonyIdMatches ||
            colonyNameMatches ||
            noColonySet
          );
        })
        .map((report) => {
          const isCrime =
            report?.reportType === "crime" ||
            report?.id?.startsWith("CRM-");

          const reporterPersonName =
            report?.reportedBy ||
            report?.personName ||
            (isCrime ? "Anonymous Resident" : "Resident Citizen");

          return {
            ...report,

            reportedBy: reporterPersonName,
            personName: reporterPersonName,

            priority:
              report.priority ||
              (report.severity
                ? `${report.severity} Priority`
                : isCrime
                  ? "High Priority"
                  : "Medium Priority"),

            priorityClass:
              report.priorityClass ||
              (
                report.severity ||
                (isCrime ? "critical" : "medium")
              ).toLowerCase(),

            status: report.status || "In Progress",

            statusClass:
              report.statusClass ||
              (report.status === "Resolved" ? "resolved" : "progress"),

            date:
              report.date ||
              (report.createdAt || report.timestamp
                ? new Date(
                    report.createdAt || report.timestamp
                  ).toLocaleDateString()
                : "Recently"),

            eta:
              report.eta ||
              report.aiAnalysis?.estimatedResolutionTime ||
              (isCrime ? "Security Dispatched" : "Pending Dispatch"),

            image: report.image || null,

            reportType: isCrime ? "crime" : "civic",
          };
        });

      setUserReports(filteredReports);
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

    window.addEventListener(
      "sociosphere_data_updated",
      loadUserReports
    );

    return () => {
      window.removeEventListener(
        "sociosphere_data_updated",
        loadUserReports
      );
    };
  }, [user?.email, user?.id]);

  /* =========================================================
     DELETE REPORT
  ========================================================= */

  const handleDeleteReport = (issue) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this report?"
  );

  if (!confirmed) return;

  try {
    const reports = JSON.parse(
      localStorage.getItem(
        "sociosphere_user_reports"
      ) || "[]"
    );

    const updatedReports = reports.filter(
      (report) => report.id !== issue.id
    );

    localStorage.setItem(
      "sociosphere_user_reports",
      JSON.stringify(updatedReports)
    );

    window.dispatchEvent(
      new Event("sociosphere_data_updated")
    );

    loadUserReports();

    showToast(
      "Report deleted successfully."
    );
  } catch (error) {
    console.error(
      "Failed to delete report:",
      error
    );

    showToast(
      "Unable to delete report."
    );
  }
};

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

    // if (title === "View Map") {
    //   setActiveModal("map");
    //   return;
    // }

    if (
      title === "Community Hub" ||
      title === "Maintenance"
    ) {
      setComingSoonFeature(title);
    }
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
          <div className="location-section">
            <MapPin size={16} />

            <span>
              {user?.communityName ||
                "Your Community"}
            </span>

            <span className="online-dot" />
          </div>

          <div className="navbar-actions">
            <button
              className="emergency-button"
              onClick={() => {
                navigate("/citizen/report-crime");
                setActiveModal("reportCrime");

                showToast(
                  "Emergency Crime & Safety portal opened"
                );
              }}
            >
              <span className="emergency-icon">
                !
              </span>

              SOS

              <strong>Emergency</strong>
            </button>
          </div>
        </div>
      </header>

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

      <main className="home-main">
        {/* ===================================================
            QUICK ACTIONS
        =================================================== */}

        <section className="section-header quick-header">
          <h2>Quick Civic Actions</h2>
          <span>One-tap resident utilities</span>
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

        {/* ===================================================
            CIVIC ISSUES
        =================================================== */}

        <section className="issues-section">
          <div className="issues-heading">
            <div>
              <h2>
                Community Civic Issues

                <span className="count-badge">
                  {displayedCivicIssues.length}
                </span>
              </h2>

              <p>
                Track real-time progress, municipal technician
                dispatch, and infrastructure resolution
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

                        <div className="issue-reporter flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">
                          <User size={14} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                          <span>Reported by: <strong className="text-slate-800 dark:text-slate-100 font-semibold">{issue.reportedBy || issue.personName || "Resident"}</strong></span>
                        </div>
                      </div>
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
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

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

                Community Crime & Safety Incidents

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

                        <div className="issue-reporter flex items-center gap-1.5 text-xs text-rose-400 dark:text-rose-300 font-medium mt-2">
                          <User size={14} className="text-rose-400 dark:text-rose-400 shrink-0" />
                          <span>Reported by: <strong className="text-rose-200 dark:text-rose-100 font-semibold">{crime.reportedBy || crime.personName || "Resident"}</strong></span>
                        </div>
                      </div>
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
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        {/* ===================================================
            COMMUNITY OVERVIEW
        =================================================== */}

        <section className="community-overview mt-10">
          <div className="overview-card health-card">
            <div className="overview-icon">
              <Sparkles size={20} />
            </div>

            <div>
              <span>COMMUNITY HEALTH</span>

              <strong>94%</strong>

              <p>
                Excellent neighborhood health index
              </p>
            </div>
          </div>

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
                Tomorrow • 10:00 AM • Open Amphitheatre
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
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="home-footer">
        <div>
          <Shield size={16} />

          <strong>
            SocioSphere Citizen Dashboard
          </strong>

          <span>
            • {user?.communityName || "Your Community"}
          </span>
        </div>

        <div>
          <span>
            Powered by SocioAI Civic Engine
          </span>

          <span>•</span>

          <button
            onClick={() =>
              showToast("Privacy Policy")
            }
          >
            Privacy
          </button>

          <button
            onClick={() =>
              showToast("Terms of Civic Service")
            }
          >
            Terms
          </button>

          <button
            onClick={() =>
              showToast("RWA Constitution")
            }
          >
            Bylaws
          </button>
        </div>
      </footer>

      {/* FOOTER */}

      {/* MAP MODAL - COMMENTED OUT FOR FUTURE USE */}
      {/* {activeModal === "map" && (
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
      )} */}

      {/* =====================================================
          COMING SOON MODAL
      ===================================================== */}

      {comingSoonFeature && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() =>
            setComingSoonFeature(null)
          }
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0D1524] p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <Sparkles size={22} />
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-slate-100">
                {comingSoonFeature}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                This feature is currently under
                development and will be available soon
                on SocioSphere.
              </p>

              <button
                onClick={() =>
                  setComingSoonFeature(null)
                }
                className="mt-6 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition-all duration-200 hover:bg-emerald-400"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
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