import React, { useState } from "react";

import "./home.css";

import Report from "./Report";
import ReportCrime from "./ReportCrime";
import Map from "./Map";

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useIssues } from "../../context/IssueContext";

import {
  Shield,
  MapPin,
  Bell,
  Users,
  CreditCard,
  Plus,
  AlertTriangle,
  Droplets,
  Zap,
  Trash2,
  Clock,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  X,
  Calendar,
  MessageSquare,
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
  {
    title: "View Map",
    description: "Live community problem heatmap",
    icon: MapPin,
    className: "action-blue",
  },
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
  const [activeCivicTab, setActiveCivicTab] = useState("all");
  const [activeCrimeTab, setActiveCrimeTab] = useState("all");
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [toast, setToast] = useState("");

  const { theme } = useTheme();
  const { user } = useAuth();
  const { issues } = useIssues();

  /* ============================================================
     USER ISSUES
     ============================================================ */

  const myIssues = issues.filter(
    (issue) =>
      issue.communityId === user?.communityId &&
      issue.reportedBy === user?.name
  );

  /* ============================================================
     COMMUNITY ISSUES
     ============================================================ */

  const communityIssues = issues.filter(
    (issue) => issue.communityId === user?.communityId
  );

  /* ============================================================
     SEPARATE CIVIC + CRIME REPORTS
     ============================================================ */

  const userCivicReports = communityIssues.filter(
    (issue) => issue.type !== "crime"
  );

  const userCrimeReports = communityIssues.filter(
    (issue) => issue.type === "crime"
  );

  const displayedCivicIssues = userCivicReports;
  const displayedCrimeIssues = userCrimeReports;

  /* ============================================================
     TOAST
     ============================================================ */

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  /* ============================================================
     QUICK ACTIONS
     ============================================================ */

  const handleQuickAction = (title) => {
    if (title === "Report Issue") {
      setActiveModal("report");
      return;
    }

    if (title === "Report Crime") {
      setActiveModal("reportCrime");
      return;
    }

    if (title === "View Map") {
      setActiveModal("map");
      return;
    }

    showToast(`${title} feature opened`);
  };

  /* ============================================================
     ISSUE ICON
     ============================================================ */

  const getIssueIcon = (issue) => {
    if (issue.icon) return issue.icon;

    const category = (issue.category || "").toLowerCase();

    if (category.includes("water") || category.includes("leak")) {
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

  /* ============================================================
     CIVIC FILTERING
     ============================================================ */

  const filteredCivicIssues = displayedCivicIssues.filter((issue) => {
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
          issue.priority.toUpperCase().includes("HIGH")) ||
        (issue.priority &&
          issue.priority.toUpperCase().includes("CRITICAL"))
      );
    }

    return true;
  });

  /* ============================================================
     CIVIC COUNTS
     ============================================================ */

  const civicInProgressCount = displayedCivicIssues.filter(
    (issue) =>
      issue.status === "In Progress" ||
      issue.status === "Pending Dispatch"
  ).length;

  const civicResolvedCount = displayedCivicIssues.filter(
    (issue) => issue.status === "Resolved"
  ).length;

  const civicHighCriticalCount = displayedCivicIssues.filter(
    (issue) =>
      issue.priorityClass === "high" ||
      issue.priorityClass === "critical" ||
      (issue.priority &&
        issue.priority.toUpperCase().includes("HIGH")) ||
      (issue.priority &&
        issue.priority.toUpperCase().includes("CRITICAL"))
  ).length;

  /* ============================================================
     CRIME FILTERING
     ============================================================ */

  const filteredCrimeIssues = displayedCrimeIssues.filter((crime) => {
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
          crime.priority.toUpperCase().includes("CRITICAL")) ||
        (crime.priority &&
          crime.priority.toUpperCase().includes("HIGH"))
      );
    }

    return true;
  });

  /* ============================================================
     CRIME COUNTS
     ============================================================ */

  const crimeActiveCount = displayedCrimeIssues.filter(
    (issue) =>
      issue.status === "In Progress" ||
      issue.status === "Security Dispatched" ||
      issue.status === "Pending Dispatch"
  ).length;

  const crimeResolvedCount = displayedCrimeIssues.filter(
    (issue) =>
      issue.status === "Resolved" ||
      issue.status === "Logged"
  ).length;

  const crimeCriticalCount = displayedCrimeIssues.filter(
    (issue) =>
      issue.priorityClass === "critical" ||
      (issue.priority &&
        issue.priority.toUpperCase().includes("CRITICAL")) ||
      (issue.priority &&
        issue.priority.toUpperCase().includes("HIGH"))
  ).length;

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div
      className={`home-page ${
        theme === "dark" ? "dark-mode" : "light-mode"
      }`}
    >
      {/* ========================================================
          LOCAL HOME HEADER
          ======================================================== */}

      <header className="home-navbar">
        <div className="navbar-inner">
          <div className="location-section">
            <MapPin size={16} />

            <span>
              {user?.communityName || "Your Community"}
              <br />
              {user?.unitNumber || "Resident"}
            </span>

            <span className="online-dot" />
          </div>

          <div className="navbar-actions">
            <button
              className="emergency-button"
              onClick={() => {
                setActiveModal("reportCrime");

                showToast(
                  "Emergency Crime & Safety portal opened"
                );
              }}
            >
              <span className="emergency-icon">!</span>
              SOS
              <strong>Emergency</strong>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          NOTIFICATIONS
          ======================================================== */}

      {showNotifications && (
        <div className="notification-panel">
          <div className="notification-header">
            <strong>Notifications</strong>

            <button
              onClick={() => setShowNotifications(false)}
              aria-label="Close notifications"
            >
              <X size={16} />
            </button>
          </div>

          {displayedCivicIssues.length === 0 &&
          displayedCrimeIssues.length === 0 ? (
            <div className="notification-item">
              <Bell size={17} />
              <span>
                No new community notifications.
              </span>
            </div>
          ) : (
            <>
              {displayedCivicIssues
                .filter(
                  (issue) => issue.status === "Resolved"
                )
                .slice(0, 2)
                .map((issue) => (
                  <div
                    className="notification-item"
                    key={`resolved-${issue.id}`}
                  >
                    <CheckCircle2 size={17} />

                    <span>
                      Your issue "{issue.title}" has been
                      resolved.
                    </span>
                  </div>
                ))}

              {displayedCrimeIssues
                .slice(0, 2)
                .map((crime) => (
                  <div
                    className="notification-item"
                    key={`crime-${crime.id}`}
                  >
                    <ShieldAlert size={17} />

                    <span>
                      Crime report "{crime.title}" is being
                      handled.
                    </span>
                  </div>
                ))}
            </>
          )}
        </div>
      )}

      <main className="home-main">

        {/* ======================================================
            QUICK ACTIONS
            ====================================================== */}

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

        {/* ======================================================
            CIVIC ISSUES
            ====================================================== */}

        <section className="issues-section">
          <div className="issues-heading">
            <div>
              <h2>
                My Reported Civic Issues

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
                  activeCivicTab === "all" ? "active" : ""
                }
                onClick={() => setActiveCivicTab("all")}
              >
                All Issues ({displayedCivicIssues.length})
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
                  activeCivicTab === "high" ? "active" : ""
                }
                onClick={() => setActiveCivicTab("high")}
              >
                High / Critical ({civicHighCriticalCount})
              </button>
            </div>
          </div>

          <div className="issues-grid">
            {filteredCivicIssues.length === 0 ? (
              /* ==================================================
                 CIVIC EMPTY STATE
                 ================================================== */

              <div className="empty-state">
                <div className="empty-state-content">
                  <div className="empty-state-icon">
                    <AlertTriangle size={27} />
                  </div>

                  <h3>
                    {displayedCivicIssues.length === 0
                      ? "No civic issues reported yet"
                      : "No issues match this filter"}
                  </h3>

                  <p>
                    {displayedCivicIssues.length === 0
                      ? "Your submitted civic issues will appear here."
                      : "Try selecting another filter."}
                  </p>
                </div>
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
                          issue.priorityClass || "high"
                        }`}
                      >
                        <Icon size={15} />
                        {issue.category}
                      </div>

                      <div
                        className={`priority-badge ${
                          issue.priorityClass || "medium"
                        }`}
                      >
                        {issue.priority}
                      </div>

                      <div
                        className={`status-badge ${
                          issue.statusClass || "progress"
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

                        <p>{issue.description}</p>

                        <div className="issue-location">
                          <MapPin size={15} />
                          {issue.location}
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
                  </article>
                );
              })
            )}
          </div>
        </section>

        {/* ======================================================
            CRIME & SAFETY
            ====================================================== */}

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
                onClick={() => setActiveCrimeTab("all")}
              >
                All Incidents ({displayedCrimeIssues.length})
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
              /* ==================================================
                 CRIME EMPTY STATE
                 ================================================== */

              <div className="empty-state crime-empty">
                <div className="empty-state-content">
                  <div className="empty-state-icon">
                    <ShieldAlert size={27} />
                  </div>

                  <h3>
                    {displayedCrimeIssues.length === 0
                      ? "No crime or safety reports"
                      : "No incidents match this filter"}
                  </h3>

                  <p>
                    {displayedCrimeIssues.length === 0
                      ? "Submitted crime and safety reports will appear here."
                      : "Try selecting another filter."}
                  </p>
                </div>
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
                          crime.priorityClass || "critical"
                        }`}
                      >
                        {crime.priority}
                      </div>

                      <div
                        className={`status-badge ${
                          crime.statusClass || "progress"
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

                        <p>{crime.description}</p>

                        <div className="issue-location text-rose-400">
                          <MapPin size={15} />
                          {crime.location}
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
                  </article>
                );
              })
            )}
          </div>
        </section>

        {/* ======================================================
            COMMUNITY OVERVIEW
            ====================================================== */}

        <section className="community-overview mt-10">
          <div className="overview-card health-card">
            <div className="overview-icon">
              <Sparkles size={20} />
            </div>

            <div>
              <span>COMMUNITY HEALTH</span>

              <strong>
                {displayedCivicIssues.length > 0
                  ? `${Math.round(
                      (civicResolvedCount /
                        displayedCivicIssues.length) *
                        100
                    )}%`
                  : "—"}
              </strong>

              <p>
                Based on current civic issue resolution
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
                Community announcements
              </strong>

              <p>
                Check the Announcements section for
                upcoming events.
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
                {communityIssues.length} reported item
                {communityIssues.length !== 1 ? "s" : ""}
              </strong>

              <p>
                Activity from your selected community
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================
          FOOTER
          ======================================================== */}

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

      {/* ========================================================
          REPORT ISSUE MODAL
          ======================================================== */}

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
            onClick={(e) => e.stopPropagation()}
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
                setActiveModal(null);
                showToast(
                  "Issue report logged & saved!"
                );
              }}
            />
          </div>
        </div>
      )}

      {/* ========================================================
          REPORT CRIME MODAL
          ======================================================== */}

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
            onClick={(e) => e.stopPropagation()}
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
                setActiveModal(null);

                showToast(
                  "Crime report logged & security notified!"
                );
              }}
            />
          </div>
        </div>
      )}

      {/* ========================================================
          MAP MODAL
          ======================================================== */}

      {activeModal === "map" && (
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
            onClick={(e) => e.stopPropagation()}
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

      {/* ========================================================
          TOAST
          ======================================================== */}

      {toast && (
        <div className="home-toast">
          {toast}
        </div>
      )}
    </div>
  );
}