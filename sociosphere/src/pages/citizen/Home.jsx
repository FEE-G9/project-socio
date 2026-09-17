import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

import Report from "./Report";
import ReportCrime from "./ReportCrime";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
// import Map from "./Map";

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

  const { theme } = useTheme();
  const { user } = useAuth();

  const loadUserReports = () => {
  try {
    const storedLocal = JSON.parse(
      localStorage.getItem("sociosphere_user_reports") || "[]"
    ).filter((report) => report?.id?.startsWith("CRM-"));

    const storedGlobal = JSON.parse(
      localStorage.getItem("sociosphere_issues") || "[]"
    ).map((issue) => ({
      id: issue.id,
      title: issue.title,
      category: issue.category,
      description: issue.description,
      location: issue.location,

      priority: issue.severity
        ? `${issue.severity} Priority`
        : "Medium Priority",

      priorityClass: (issue.severity || "medium").toLowerCase(),

      status: issue.status || "In Progress",

      statusClass:
        issue.status === "Resolved" ? "resolved" : "progress",

      date: issue.createdAt
        ? new Date(issue.createdAt).toLocaleDateString()
        : "Recently",

      eta: issue.aiAnalysis?.estimatedResolutionTime || "Pending",

      image: issue.image || null,

      reportedById: issue.reportedById,
      reportedByEmail: issue.reportedByEmail,
      communityId: issue.communityId,
    }));

    // Show all saved reports for now
    setUserReports([...storedGlobal, ...storedLocal]);

  } catch (error) {
    console.error("Failed to load user reports:", error);
    setUserReports([]);
  }
};

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
}, []);
  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

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

    showToast(`${title} feature opened`);
  };

  /*
   * Separate civic issues from crime reports.
   */
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

  /*
   * IMPORTANT:
   * No fake/default issue is used here.
   * If the user has not reported anything, the empty state is shown.
   */
  const displayedCivicIssues = userCivicReports;
  const displayedCrimeIssues = userCrimeReports;

  const getIssueIcon = (issue) => {
    if (issue.icon) return issue.icon;

    const category = (issue.category || "").toLowerCase();

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

  /*
   * Civic issue filtering
   */
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

  /*
   * Crime report filtering
   */
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

  return (
    <div
      className={`home-page ${
        theme === "dark" ? "dark-mode" : "light-mode"
      }`}
    >
      {/* HEADER */}
      <header className="home-navbar">
        <div className="navbar-inner">
          <div className="location-section">
            <MapPin size={16} />

            <span>
              {user?.communityName || "Your Community"}
            </span>

            <span className="online-dot" />
          </div>

          <div className="navbar-actions">
            <button
              className="emergency-button"
              onClick={() => {
                navigate("/citizen/report-crime");
              }}
            >
              <span className="emergency-icon">!</span>
              SOS
              <strong>Emergency</strong>
            </button>
          </div>
        </div>
      </header>

      {/* NOTIFICATIONS */}
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
        {/* QUICK ACTIONS */}
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

        {/* CIVIC ISSUES */}
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
                onClick={() =>
                  setActiveCivicTab("all")
                }
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
                onClick={() =>
                  setActiveCivicTab("high")
                }
              >
                High / Critical ({civicHighCriticalCount})
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
                          issue.priorityClass || "medium"
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

        {/* CRIME & SAFETY */}
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

        {/* COMMUNITY OVERVIEW */}
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
              <strong>24 new discussions</strong>
              <p>
                Residents are actively discussing local
                issues
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
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
          <span>Powered by SocioAI Civic Engine</span>
          <span>•</span>

          <button
            onClick={() => showToast("Privacy Policy")}
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

      {/* TOAST */}
      {toast && (
        <div className="home-toast">
          {toast}
        </div>
      )}
    </div>
  );
}