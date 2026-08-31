import React, { useState } from "react";
import "./home.css";
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
} from "lucide-react";
import "./home.css";

const issuesData = [
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
  {
    id: "ISSUE-8419",
    title: "Broken Storm Drain Grate on North Boulevard",
    category: "Drainage",
    description:
      "Heavy cast-iron grate collapsed inward creating a 2-foot open hole in the vehicle driveway.",
    location: "Block B - North Boulevard Curve",
    priority: "CRITICAL PRIORITY",
    priorityClass: "critical",
    status: "In Progress",
    statusClass: "progress",
    date: "Yesterday, 04:15 PM",
    eta: "Tomorrow, 11:00 AM",
    icon: AlertTriangle,
    image:
      "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ISSUE-8390",
    title: "Flickering High-Mast Streetlight at Gate 3",
    category: "Streetlight",
    description:
      "Main LED luminaire strobing erratically since evening storm. Replacement driver scheduled.",
    location: "Gate 3 Visitor Entrance",
    priority: "MEDIUM PRIORITY",
    priorityClass: "medium",
    status: "Resolved",
    statusClass: "resolved",
    date: "Aug 25, 07:20 PM",
    eta: "Resolved",
    icon: Zap,
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ISSUE-8354",
    title: "Overflowing Recycling Bin near Clubhouse Wing",
    category: "Garbage",
    description:
      "Cardboard packing boxes and plastic containers overflowing after weekend community event.",
    location: "Clubhouse Lawn East Wing",
    priority: "LOW PRIORITY",
    priorityClass: "low",
    status: "Resolved",
    statusClass: "resolved",
    date: "Aug 24, 10:30 AM",
    eta: "Resolved",
    icon: Trash2,
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
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
  const [activeTab, setActiveTab] = useState("all");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const handleQuickAction = (title) => {
    if (title === "Report Issue") {
      setShowReportModal(true);
      return;
    }

    showToast(`${title} feature opened`);
  };

  const filteredIssues = issuesData.filter((issue) => {
    if (activeTab === "progress") return issue.status === "In Progress";
    if (activeTab === "resolved") return issue.status === "Resolved";
    if (activeTab === "high") {
      return (
        issue.priorityClass === "high" || issue.priorityClass === "critical"
      );
    }

    return true;
  });

  return (
    <div className="home-page">
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

          <nav className="main-nav">
            <button className="nav-item active">
              <Building2 size={17} />
              Home
            </button>

            <button
              className="nav-item"
              onClick={() => showToast("Community Hub opened")}
            >
              <Users size={17} />
              Community
            </button>

            <button
              className="nav-item"
              onClick={() => showToast("Live map opened")}
            >
              <Compass size={17} />
              Map
            </button>

            <button
              className="nav-item"
              onClick={() => showToast("Announcements opened")}
            >
              <Bell size={17} />
              Announcements
            </button>
          </nav>

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
              onClick={() => showToast("Emergency services activated")}
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

        <section className="issues-section">
          <div className="issues-heading">
            <div>
              <h2>
                My Reported Issues
                <span className="count-badge">{issuesData.length}</span>
              </h2>

              <p>
                Track real-time progress, municipal technician dispatch, and
                resolution
              </p>
            </div>

            <div className="filter-tabs">
              <button
                className={activeTab === "all" ? "active" : ""}
                onClick={() => setActiveTab("all")}
              >
                All Issues (4)
              </button>

              <button
                className={activeTab === "progress" ? "active" : ""}
                onClick={() => setActiveTab("progress")}
              >
                In Progress (2)
              </button>

              <button
                className={activeTab === "resolved" ? "active" : ""}
                onClick={() => setActiveTab("resolved")}
              >
                Resolved (2)
              </button>

              <button
                className={activeTab === "high" ? "active" : ""}
                onClick={() => setActiveTab("high")}
              >
                High / Critical (2)
              </button>
            </div>
          </div>

          <div className="issues-grid">
            {filteredIssues.map((issue) => {
              const Icon = issue.icon;

              return (
                <article className="issue-card" key={issue.id}>
                  <div className="issue-top">
                    <div className={`category-badge ${issue.priorityClass}`}>
                      <Icon size={15} />
                      {issue.category}
                    </div>

                    <div className={`priority-badge ${issue.priorityClass}`}>
                      {issue.priority}
                    </div>

                    <div className={`status-badge ${issue.statusClass}`}>
                      {issue.status === "Resolved" ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Clock size={14} />
                      )}
                      {issue.status}
                    </div>
                  </div>

                  <div className="issue-body">
                    <img
                      className="issue-image"
                      src={issue.image}
                      alt={issue.title}
                    />

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
                      <strong>ETA: {issue.eta}</strong>
                    </div>

                    <button
                      className="timeline-button"
                      onClick={() => showToast(`Timeline: ${issue.id}`)}
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

        <section className="community-overview">
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

      {showReportModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowReportModal(false)}
        >
          <div className="report-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowReportModal(false)}
            >
              <X size={20} />
            </button>

            <div className="modal-icon">
              <Plus size={24} />
            </div>

            <h2>Report a Community Issue</h2>

            <p>
              Help your community by reporting infrastructure or maintenance
              problems.
            </p>

            <label>Issue Title</label>
            <input placeholder="e.g. Broken streetlight near gate" />

            <label>Category</label>
            <select>
              <option>Water Leakage</option>
              <option>Drainage</option>
              <option>Garbage</option>
              <option>Streetlight</option>
              <option>Other</option>
            </select>

            <label>Description</label>
            <textarea
              rows="4"
              placeholder="Describe the issue..."
            />

            <button
              className="submit-report"
              onClick={() => {
                setShowReportModal(false);
                showToast("Issue submitted successfully");
              }}
            >
              Submit Issue
            </button>
          </div>
        </div>
      )}

      {toast && <div className="home-toast">{toast}</div>}
    </div>
  );
}