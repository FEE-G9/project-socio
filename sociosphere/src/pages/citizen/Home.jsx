import React, { useState, useEffect } from "react";
import "./home.css";
import Report from "./Report";
import ReportCrime from "./ReportCrime";
import {
  Shield,
  MapPin,
  Bell,
  Users,
  Building2,
  Compass,
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
  Phone,
  Calendar,
  MessageSquare,
  Sun,
  Moon,
  FileText,
  ShieldAlert,
} from "lucide-react";

const defaultMockIssue = [
  {
    id: "ISSUE-8492",
    title: "Major Water Leakage near Basement P2 Entrance",
    category: "Water Leakage",
    description:
      "Continuous fresh water gushing from overhead pipe junction near ramp. Slippery floor causing safety hazard for incoming vehicles.",
    location: "Basement P2, Pillar B-14",
    priority: "HIGH PRIORITY",
    priorityClass: "high",
    status: "In Progress",
    statusClass: "progress",
    date: "Today, 08:30 AM",
    eta: "Today, 2:00 PM",
    icon: Droplets,
    image:
      "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
  },
];

const defaultMockCrime = [
  {
    id: "CRM-2026-8819",
    title: "Suspicious Activity & Vehicle Inspection near Gate 3",
    category: "Suspicious Activity",
    description:
      "Unidentified individual observing parked vehicles near North Drive. Security patrol dispatched for site verification.",
    location: "Sector 4 - Visitor Parking Gate 3",
    priority: "CRITICAL THREAT",
    priorityClass: "critical",
    status: "Security Dispatched",
    statusClass: "progress",
    date: "Today, 10:15 PM",
    eta: "Patrol En Route",
    icon: ShieldAlert,
    image:
      "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80",
  },
];

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
  const [activeModal, setActiveModal] = useState(null); // 'report' | 'reportCrime' | null
  const [toast, setToast] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [userReports, setUserReports] = useState([]);

  const loadUserReports = () => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("sociosphere_user_reports") || "[]"
      );
      setUserReports(stored);
    } catch (e) {
      console.error("Failed to load user reports:", e);
      setUserReports([]);
    }
  };

  useEffect(() => {
    loadUserReports();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    showToast(`Switched to ${isDarkMode ? "Light" : "Dark"} mode`);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const handleQuickAction = (title) => {
    if (title === "Report Issue") {
      setActiveModal("report");
      return;
    }
    if (title === "Report Crime") {
      setActiveModal("reportCrime");
      return;
    }

    showToast(`${title} feature opened`);
  };

  // Separate user reports into Civic Issues vs Crime & Safety Reports
  const userCivicReports = userReports.filter(
    (item) => item.id && (item.id.startsWith("ISSUE-") || !item.id.startsWith("CRM-"))
  );

  const userCrimeReports = userReports.filter(
    (item) => item.id && item.id.startsWith("CRM-")
  );

  // If there are user reported items, show all of them. Otherwise, show 1 mock item fallback.
  const displayedCivicIssues =
    userCivicReports.length > 0 ? userCivicReports : defaultMockIssue;

  const displayedCrimeIssues =
    userCrimeReports.length > 0 ? userCrimeReports : defaultMockCrime;

  const getIssueIcon = (issue) => {
    if (issue.icon) return issue.icon;
    const cat = (issue.category || "").toLowerCase();
    if (cat.includes("water") || cat.includes("leak")) return Droplets;
    if (cat.includes("drain")) return AlertTriangle;
    if (cat.includes("light") || cat.includes("electric")) return Zap;
    if (cat.includes("waste") || cat.includes("garbage") || cat.includes("bin"))
      return Trash2;
    if (
      cat.includes("crime") ||
      cat.includes("theft") ||
      cat.includes("vandalism") ||
      cat.includes("harassment") ||
      cat.includes("safety") ||
      cat.includes("nuisance") ||
      cat.includes("cyber")
    )
      return ShieldAlert;
    return AlertTriangle;
  };

  // Civic issues filtering
  const filteredCivicIssues = displayedCivicIssues.filter((issue) => {
    if (activeCivicTab === "progress")
      return (
        issue.status === "In Progress" || issue.status === "Pending Dispatch"
      );
    if (activeCivicTab === "resolved") return issue.status === "Resolved";
    if (activeCivicTab === "high") {
      return (
        issue.priorityClass === "high" ||
        issue.priorityClass === "critical" ||
        (issue.priority && issue.priority.includes("HIGH")) ||
        (issue.priority && issue.priority.includes("CRITICAL"))
      );
    }
    return true;
  });

  const civicInProgressCount = displayedCivicIssues.filter(
    (i) => i.status === "In Progress" || i.status === "Pending Dispatch"
  ).length;

  const civicResolvedCount = displayedCivicIssues.filter(
    (i) => i.status === "Resolved"
  ).length;

  const civicHighCriticalCount = displayedCivicIssues.filter(
    (i) =>
      i.priorityClass === "high" ||
      i.priorityClass === "critical" ||
      (i.priority && i.priority.includes("HIGH")) ||
      (i.priority && i.priority.includes("CRITICAL"))
  ).length;

  // Crime reports filtering
  const filteredCrimeIssues = displayedCrimeIssues.filter((crime) => {
    if (activeCrimeTab === "active")
      return (
        crime.status === "In Progress" ||
        crime.status === "Security Dispatched" ||
        crime.status === "Pending Dispatch"
      );
    if (activeCrimeTab === "resolved")
      return crime.status === "Resolved" || crime.status === "Logged";
    if (activeCrimeTab === "critical") {
      return (
        crime.priorityClass === "critical" ||
        (crime.priority && crime.priority.includes("CRITICAL")) ||
        (crime.priority && crime.priority.includes("HIGH"))
      );
    }
    return true;
  });

  const crimeActiveCount = displayedCrimeIssues.filter(
    (i) =>
      i.status === "In Progress" ||
      i.status === "Security Dispatched" ||
      i.status === "Pending Dispatch"
  ).length;

  const crimeResolvedCount = displayedCrimeIssues.filter(
    (i) => i.status === "Resolved" || i.status === "Logged"
  ).length;

  const crimeCriticalCount = displayedCrimeIssues.filter(
    (i) =>
      i.priorityClass === "critical" ||
      (i.priority && i.priority.includes("CRITICAL")) ||
      (i.priority && i.priority.includes("HIGH"))
  ).length;

  return (
    <div className={`home-page ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <header className="home-navbar">
        <div className="navbar-inner">
          <div className="brand-section">
            <div className="brand-logo">
              <Shield size={22} />
            </div>

            <div className="brand-name">
              Socio<span>Sphere</span>
            </div>

            <div className="citizen-badge">CITIZEN</div>
          </div>

          <div className="location-section">
            <MapPin size={16} />
            <span>
              Greenwood Heights,
              <br />
              Sector 4
            </span>
            <span className="online-dot" />
          </div>

          <div className="navbar-actions">
            <button
              className="notification-button"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={18} />
              <span>3</span>
            </button>

            <button
              className="emergency-button"
              onClick={() => {
                setActiveModal("reportCrime");
                showToast("Emergency Crime & Safety portal opened");
              }}
            >
              <span className="emergency-icon">!</span>
              SOS
              <strong>Emergency</strong>
            </button>

            <div className="profile">
              <div className="profile-avatar">
                AS
                <span />
              </div>

              <div className="profile-info">
                <strong>Aarav Sharma</strong>
                <small>
                  Flat B-402 •
                  <br />
                  Resident
                </small>
              </div>
            </div>
          </div>
        </div>
      </header>

      {showNotifications && (
        <div className="notification-panel">
          <div className="notification-header">
            <strong>Notifications</strong>
            <button onClick={() => setShowNotifications(false)}>
              <X size={16} />
            </button>
          </div>

          <div className="notification-item">
            <CheckCircle2 size={17} />
            <span>Your streetlight issue has been resolved.</span>
          </div>

          <div className="notification-item">
            <Bell size={17} />
            <span>New community announcement available.</span>
          </div>

          <div className="notification-item">
            <AlertTriangle size={17} />
            <span>Drainage issue reported near Block B.</span>
          </div>
        </div>
      )}

      <main className="home-main">
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
                onClick={() => handleQuickAction(action.title)}
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

        {/* Section 1: My Reported Civic Issues */}
        <section className="issues-section">
          <div className="issues-heading">
            <div>
              <h2>
                My Reported Civic Issues
                <span className="count-badge">{displayedCivicIssues.length}</span>
              </h2>

              <p>
                Track real-time progress, municipal technician dispatch, and
                infrastructure resolution
              </p>
            </div>

            <div className="filter-tabs">
              <button
                className={activeCivicTab === "all" ? "active" : ""}
                onClick={() => setActiveCivicTab("all")}
              >
                All Issues ({displayedCivicIssues.length})
              </button>

              <button
                className={activeCivicTab === "progress" ? "active" : ""}
                onClick={() => setActiveCivicTab("progress")}
              >
                In Progress ({civicInProgressCount})
              </button>

              <button
                className={activeCivicTab === "resolved" ? "active" : ""}
                onClick={() => setActiveCivicTab("resolved")}
              >
                Resolved ({civicResolvedCount})
              </button>

              <button
                className={activeCivicTab === "high" ? "active" : ""}
                onClick={() => setActiveCivicTab("high")}
              >
                High / Critical ({civicHighCriticalCount})
              </button>
            </div>
          </div>

          <div className="issues-grid">
            {filteredCivicIssues.map((issue) => {
              const Icon = getIssueIcon(issue);

              return (
                <article className="issue-card" key={issue.id}>
                  <div className="issue-top">
                    <div className={`category-badge ${issue.priorityClass || "high"}`}>
                      <Icon size={15} />
                      {issue.category}
                    </div>

                    <div className={`priority-badge ${issue.priorityClass || "medium"}`}>
                      {issue.priority}
                    </div>

                    <div className={`status-badge ${issue.statusClass || "progress"}`}>
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
                      <span className="issue-id">{issue.id}</span>

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
                      <strong>ETA: {issue.eta || "Pending"}</strong>
                    </div>

                    <button
                      className="timeline-button"
                      onClick={() => showToast(`Tracking timeline for ${issue.id}`)}
                    >
                      View Timeline
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Section 2: Reported Crimes & Safety Incidents (Separated below Reported Issues) */}
        <section className="issues-section mt-10">
          <div className="issues-heading">
            <div>
              <h2 className="text-rose-400 flex items-center gap-2">
                <ShieldAlert size={22} className="text-rose-400" />
                Reported Crime & Safety Incidents
                <span className="count-badge crime-badge">{displayedCrimeIssues.length}</span>
              </h2>

              <p>
                Live security patrol dispatch, threat level triage, and law enforcement logging
              </p>
            </div>

            <div className="filter-tabs">
              <button
                className={activeCrimeTab === "all" ? "active-crime" : ""}
                onClick={() => setActiveCrimeTab("all")}
              >
                All Incidents ({displayedCrimeIssues.length})
              </button>

              <button
                className={activeCrimeTab === "active" ? "active-crime" : ""}
                onClick={() => setActiveCrimeTab("active")}
              >
                Security Active ({crimeActiveCount})
              </button>

              <button
                className={activeCrimeTab === "resolved" ? "active-crime" : ""}
                onClick={() => setActiveCrimeTab("resolved")}
              >
                Resolved ({crimeResolvedCount})
              </button>

              <button
                className={activeCrimeTab === "critical" ? "active-crime" : ""}
                onClick={() => setActiveCrimeTab("critical")}
              >
                Critical Threats ({crimeCriticalCount})
              </button>
            </div>
          </div>

          <div className="issues-grid">
            {filteredCrimeIssues.map((crime) => {
              const Icon = getIssueIcon(crime);

              return (
                <article className="issue-card border-rose-500/30" key={crime.id}>
                  <div className="issue-top">
                    <div className="category-badge critical">
                      <Icon size={15} />
                      {crime.category}
                    </div>

                    <div className={`priority-badge ${crime.priorityClass || "critical"}`}>
                      {crime.priority}
                    </div>

                    <div className={`status-badge ${crime.statusClass || "progress"}`}>
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
                      <span className="issue-id text-rose-400">{crime.id}</span>

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
                      <strong className="text-rose-300">Status: {crime.eta || "Security Dispatched"}</strong>
                    </div>

                    <button
                      className="timeline-button text-rose-400 hover:text-rose-300"
                      onClick={() => showToast(`Tracking security dispatch for ${crime.id}`)}
                    >
                      View Timeline
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="community-overview mt-10">
          <div className="overview-card health-card">
            <div className="overview-icon">
              <Sparkles size={20} />
            </div>

            <div>
              <span>COMMUNITY HEALTH</span>
              <strong>94%</strong>
              <p>Excellent neighborhood health index</p>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">
              <Calendar size={20} />
            </div>

            <div>
              <span>UPCOMING</span>
              <strong>Holi Milan & Spring Carnival</strong>
              <p>Tomorrow • 10:00 AM • Open Amphitheatre</p>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">
              <MessageSquare size={20} />
            </div>

            <div>
              <span>COMMUNITY ACTIVITY</span>
              <strong>24 new discussions</strong>
              <p>Residents are actively discussing local issues</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div>
          <Shield size={16} />
          <strong>SocioSphere Citizen Dashboard</strong>
          <span>• Greenwood Heights Sector 4</span>
        </div>

        <div>
          <span>Powered by SocioAI Civic Engine</span>
          <span>•</span>
          <button onClick={() => showToast("Privacy Policy")}>Privacy</button>
          <button onClick={() => showToast("Terms of Civic Service")}>
            Terms
          </button>
          <button onClick={() => showToast("RWA Constitution")}>
            Bylaws
          </button>
        </div>
      </footer>

      {/* Connected Report Issue Modal */}
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
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
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
                showToast("Issue report logged & saved!");
              }}
            />
          </div>
        </div>
      )}

      {/* Connected Report Crime Modal */}
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
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
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
                showToast("Crime report logged & security notified!");
              }}
            />
          </div>
        </div>
      )}

      {toast && <div className="home-toast">{toast}</div>}
    </div>
  );
}