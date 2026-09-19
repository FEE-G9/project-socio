import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import "./Home.css";

import Report from "./Report";
import ReportCrime from "./ReportCrime";
import Map from "./Map";

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { getIssues, saveIssues } from "../../data/mockIssues";
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
     LOAD REPORTS FROM THE CURRENT USER'S SOCIETY
  ========================================================= */

 const loadUserReports = () => {
  try {
    const currentEmail =
      user?.email?.trim().toLowerCase();

    const currentUserId = user?.id;
    const currentCommunityId = user?.communityId;
    const currentCommunityName = user?.communityName?.trim().toLowerCase();

    if (!currentEmail && !currentUserId && !currentCommunityId && !currentCommunityName) {
      setUserReports([]);
      return;
    }

    // =====================================================
    // ALL USER REPORTS
    // Civic + Crime
    // =====================================================

    const legacyReports = JSON.parse(
      localStorage.getItem("sociosphere_user_reports") || "[]"
    );
    const authorityIssues = getIssues();
    const storedReports = [
      ...authorityIssues,
      ...legacyReports.filter((report) =>
        !authorityIssues.some((issue) => issue.id === report.id)
      ),
    ];

    const filteredReports = storedReports
      .filter((report) => {
        const reportEmail =
          report?.reportedByEmail
            ?.trim()
            .toLowerCase();

        const emailMatches =
          currentEmail &&
          reportEmail === currentEmail;

        const idMatches =
          currentUserId &&
          report?.reportedById === currentUserId;

        const reportCommunityId = report?.communityId;
        const reportCommunityName = (
          report?.communityName ||
          report?.colonyName ||
          report?.society ||
          report?.community
        )?.trim().toLowerCase();

        const communityMatches =
          (currentCommunityId && reportCommunityId === currentCommunityId) ||
          (currentCommunityName && reportCommunityName === currentCommunityName);

        // Legacy records without society metadata remain visible only to their author.
        return communityMatches || (
          !reportCommunityId &&
          !reportCommunityName &&
          (emailMatches || idMatches)
        );
      })
      .map((report) => {
        const isCrime =
          report?.reportType === "crime" ||
          report?.id?.startsWith("CRM-");

        return {
          ...report,

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

          status:
            report.status ||
            "In Progress",

          statusClass:
            report.statusClass ||
            (
              report.status === "Resolved"
                ? "resolved"
                : "progress"
            ),

          date:
            report.date ||
            (
              report.createdAt ||
              report.timestamp
            )
              ? new Date(
                  report.createdAt ||
                  report.timestamp
                ).toLocaleDateString()
              : "Recently",

          eta:
            report.eta ||
            report.aiAnalysis
              ?.estimatedResolutionTime ||
            (isCrime
              ? "Security Dispatched"
              : "Pending Dispatch"),

          image:
            report.image || null,

          reportType:
            isCrime ? "crime" : "civic",
        };
      });

    setUserReports(filteredReports);
  } catch (error) {
    console.error(
      "Failed to load user reports:",
      error
    );

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

    if (title === "Maintenance") {
      setComingSoonFeature(title);
      return;
    }

    if (title === "Community Hub") {
      setComingSoonFeature(title);
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
                setActiveModal("emergency");
              }}
              aria-haspopup="dialog"
              aria-label="Open emergency call options"
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

      <section className="home-welcome">
        <h1>{timeGreeting}, {displayName}</h1>
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

      {/* =====================================================
          EMERGENCY CALL MODAL
      ===================================================== */}

      {activeModal === "emergency" && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/10 p-4 backdrop-blur-sm dark:bg-slate-950/15"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="emergency-title"
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-rose-500/40 bg-white p-6 shadow-2xl dark:bg-[#0D1524]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Close emergency options"
            >
              <X size={20} />
            </button>

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
              <PhoneCall size={27} />
            </div>

            <h2 id="emergency-title" className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">
              Emergency assistance
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              If there is immediate danger, call emergency services now. Your device will open its calling app.
            </p>

            <div className="mt-6 space-y-3">
              <a
                href="tel:112"
                onClick={() => setActiveModal(null)}
                className="flex items-center justify-between rounded-xl bg-rose-500 px-5 py-4 font-bold text-white transition hover:bg-rose-400"
              >
                <span className="flex items-center gap-3"><PhoneCall size={20} /> Call 112</span>
                <span className="text-sm">National Emergency</span>
              </a>
              <a
                href="tel:108"
                onClick={() => setActiveModal(null)}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 font-bold text-slate-900 transition hover:border-rose-400 hover:bg-rose-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <span className="flex items-center gap-3"><PhoneCall size={20} /> Call 108</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">Ambulance</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal("reportCrime")}
              className="mt-5 w-full text-sm font-semibold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              It is not immediate — report a crime or safety issue
            </button>
          </div>
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
