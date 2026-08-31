import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  MapPin,
  AlertTriangle,
  DollarSign,
  FileText,
  ChevronRight,
  MessageSquare,
  Heart,
  Eye,
  ArrowRight,
  Calendar,
  Zap,
  Settings,
  Bell,
  BarChart3,
} from 'lucide-react';

/**
 * Dashboard Component
 * 
 * Personalized citizen dashboard for SocioSphere.
 * Displays user's reported issues, activity, fees, and AI insights.
 * Designed to match Home.jsx visual language and styling.
 */

// Mock data - will be replaced with API calls
const mockUserStats = [
  {
    label: 'Issues Reported',
    value: 8,
    icon: AlertCircle,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    trend: '+2 this month',
  },
  {
    label: 'Resolved Issues',
    value: 5,
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    trend: '+1 this week',
  },
  {
    label: 'In Progress',
    value: 3,
    icon: Clock,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    trend: 'Avg 3.2 days',
  },
  {
    label: 'Community Score',
    value: '8.5',
    icon: TrendingUp,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    trend: 'Active contributor',
  },
];

const mockMyIssues = [
  {
    id: 1,
    title: 'Pothole on Main Street',
    description: 'Large pothole affecting traffic flow near my home',
    category: 'Infrastructure',
    priority: 'High',
    status: 'In Progress',
    location: 'Main St & 5th Ave',
    date: '2024-08-28',
    daysOld: 2,
    views: 34,
    upvotes: 24,
  },
  {
    id: 2,
    title: 'Street Light Malfunction',
    description: 'Streetlight at corner has stopped working',
    category: 'Utilities',
    priority: 'High',
    status: 'Reported',
    location: 'Oak Street',
    date: '2024-08-27',
    daysOld: 3,
    views: 12,
    upvotes: 12,
  },
  {
    id: 3,
    title: 'Park Playground Repairs',
    description: 'Swing set needs maintenance',
    category: 'Parks',
    priority: 'Medium',
    status: 'Resolved',
    location: 'Central Park',
    date: '2024-08-25',
    daysOld: 5,
    views: 8,
    upvotes: 8,
  },
];

const mockStatusBreakdown = [
  {
    status: 'Reported',
    count: 2,
    percentage: 25,
    color: 'bg-slate-500',
  },
  {
    status: 'In Progress',
    count: 3,
    percentage: 37.5,
    color: 'bg-amber-500',
  },
  {
    status: 'Resolved',
    count: 3,
    percentage: 37.5,
    color: 'bg-emerald-500',
  },
];

const mockRecentActivity = [
  {
    id: 1,
    action: 'Reported',
    issue: 'Pothole on Main Street',
    timestamp: '2 days ago',
    status: 'In Progress',
  },
  {
    id: 2,
    action: 'Reported',
    issue: 'Street Light Malfunction',
    timestamp: '3 days ago',
    status: 'Reported',
  },
  {
    id: 3,
    action: 'Issue Resolved',
    issue: 'Park Playground Repairs',
    timestamp: '5 days ago',
    status: 'Resolved',
  },
  {
    id: 4,
    action: 'Comment Added',
    issue: 'Pothole on Main Street',
    timestamp: '1 day ago',
    status: 'In Progress',
  },
];

const mockFeeData = [
  {
    title: 'Community Fee',
    amount: '$45.00',
    dueDate: '2024-09-30',
    status: 'Pending',
    color: 'text-amber-400',
  },
  {
    title: 'Maintenance Fund',
    amount: '$120.00',
    dueDate: '2024-10-15',
    status: 'Pending',
    color: 'text-amber-400',
  },
  {
    title: 'Previous Fee',
    amount: '$45.00',
    dueDate: '2024-08-31',
    status: 'Paid',
    color: 'text-emerald-400',
  },
];

const mockNotifications = [
  {
    id: 1,
    title: 'Issue Update',
    message: 'Pothole on Main Street - In Progress',
    type: 'Update',
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    title: 'Community Event',
    message: 'Community Clean-up Day - This Saturday',
    type: 'Event',
    timestamp: '1 day ago',
  },
  {
    id: 3,
    title: 'Fee Due Soon',
    message: 'Community fee due on September 30',
    type: 'Alert',
    timestamp: '3 days ago',
  },
];

// Status badge colors
const getStatusColor = (status) => {
  switch (status) {
    case 'Resolved':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'In Progress':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'Reported':
      return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    default:
      return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  }
};

// Priority badge colors
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Critical':
      return 'text-rose-400';
    case 'High':
      return 'text-amber-400';
    case 'Medium':
      return 'text-blue-400';
    case 'Low':
      return 'text-slate-400';
    default:
      return 'text-slate-400';
  }
};

// Notification type colors
const getNotificationTypeColor = (type) => {
  switch (type) {
    case 'Alert':
      return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    case 'Event':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Update':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    default:
      return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  }
};

const Dashboard = () => {
  const [likedIssues, setLikedIssues] = useState(new Set());

  const toggleLike = (issueId) => {
    const newLiked = new Set(likedIssues);
    if (newLiked.has(issueId)) {
      newLiked.delete(issueId);
    } else {
      newLiked.add(issueId);
    }
    setLikedIssues(newLiked);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="space-y-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-2">
            Your Dashboard
          </h1>
          <p className="text-slate-400 text-lg">
            Track your issues, manage fees, and stay connected with your community
          </p>
        </div>
      </section>

      {/* Personal Stats */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">Your Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockUserStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-[#0D1524] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} strokeWidth={1.5} />
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-100 mb-1">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.trend}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* My Reported Issues */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100">My Reported Issues</h2>
          <a
            href="/citizen/issues"
            className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center gap-1 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <div className="space-y-4">
          {mockMyIssues.map((issue) => (
            <a
              key={issue.id}
              href={`/citizen/issue/${issue.id}`}
              className="group bg-[#0D1524] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 hover:bg-[#111A2B] transition-all duration-200 hover:translate-y-[-2px]"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2 flex-wrap">
                    <span className="px-3 py-1 bg-slate-800/50 text-slate-300 text-xs font-semibold rounded-full flex-shrink-0">
                      {issue.category}
                    </span>
                    <span className={`px-3 py-1 border rounded-full text-xs font-semibold flex-shrink-0 ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                    <span className="text-xs text-slate-500 flex-shrink-0">
                      {issue.daysOld}d old
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mb-1 group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {issue.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                    {issue.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {issue.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={getPriorityColor(issue.priority)}>
                        {issue.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-shrink-0 justify-end">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-400">{issue.views}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleLike(issue.id);
                    }}
                    className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        likedIssues.has(issue.id)
                          ? 'fill-rose-400 text-rose-400'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    />
                  </button>
                  <span className="text-sm font-semibold text-slate-400">
                    {issue.upvotes}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Issue Status Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Status Chart */}
        <div className="lg:col-span-2 bg-[#0D1524] border border-slate-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Issue Status Breakdown</h2>
          <div className="space-y-4">
            {mockStatusBreakdown.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-200">
                    {item.status}
                  </span>
                  <span className="text-sm font-bold text-slate-400">
                    {item.count} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800/50 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stat Box */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-8 flex flex-col justify-between">
          <div>
            <p className="text-slate-400 text-sm mb-2">Average Resolution Time</p>
            <p className="text-3xl font-bold text-emerald-400 mb-4">3.2 days</p>
            <p className="text-xs text-slate-500">
              Community avg: 4.2 days
            </p>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mt-4">
            <TrendingUp className="w-4 h-4" />
            You're faster than average
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">Recent Activity</h2>
        <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-6">
          <div className="space-y-4">
            {mockRecentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-4 pb-4 border-b border-slate-800/50 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center flex-shrink-0">
                  {activity.status === 'Resolved' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
                  ) : activity.status === 'In Progress' ? (
                    <Clock className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200 mb-1">
                    {activity.action}
                  </p>
                  <p className="text-sm text-slate-400 truncate">
                    {activity.issue}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fee/Maintenance Summary */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100">Fees & Payments</h2>
          <a
            href="/citizen/fees"
            className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center gap-1 transition-colors"
          >
            Manage <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockFeeData.map((fee, idx) => (
            <a
              key={idx}
              href="/citizen/fees"
              className="group bg-[#0D1524] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 hover:bg-[#111A2B] transition-all duration-200 hover:translate-y-[-2px]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-800/50 rounded-xl">
                  <DollarSign className={`w-6 h-6 ${fee.color}`} strokeWidth={1.5} />
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${fee.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {fee.status}
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-1">{fee.title}</p>
              <p className="text-2xl font-bold text-slate-100 mb-2">{fee.amount}</p>
              <p className="text-xs text-slate-500">
                Due: {new Date(fee.dueDate).toLocaleDateString()}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100">Notifications</h2>
          <a
            href="/citizen/notifications"
            className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center gap-1 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <div className="space-y-3">
          {mockNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-[#0D1524] border rounded-2xl p-4 hover:bg-[#111A2B] transition-all duration-200 ${getNotificationTypeColor(notif.type).replace('bg-', 'border-').replace('text-', '')}`}
            >
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-400" strokeWidth={1.5} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-100">
                    {notif.title}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {notif.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {notif.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/citizen/report"
            className="group bg-gradient-to-br from-rose-500/20 to-rose-500/5 border border-rose-500/30 rounded-2xl p-6 hover:border-rose-500/50 transition-all duration-200 hover:translate-y-[-2px]"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-500/30 rounded-xl flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-rose-400" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 mb-1">Report New Issue</h3>
                <p className="text-slate-400 text-sm">
                  Report a new community issue
                </p>
              </div>
            </div>
          </a>

          <a
            href="/citizen/profile"
            className="group bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-200 hover:translate-y-[-2px]"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/30 rounded-xl flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-400" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 mb-1">View Profile</h3>
                <p className="text-slate-400 text-sm">
                  Manage your account settings
                </p>
              </div>
            </div>
          </a>

          <a
            href="/citizen/map"
            className="group bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-200 hover:translate-y-[-2px]"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/30 rounded-xl flex-shrink-0">
                <MapPin className="w-6 h-6 text-purple-400" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 mb-1">View Map</h3>
                <p className="text-slate-400 text-sm">
                  Explore community issues on map
                </p>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* AI Insight */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">Your Community Insights</h2>
        <div className="bg-gradient-to-br from-[#0D1524] to-[#111A2B] border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
          {/* Subtle background accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10" />

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Zap className="w-6 h-6 text-purple-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-400">AI Analysis</p>
                <h3 className="text-xl font-bold text-slate-100">Your Impact</h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-slate-200 font-semibold mb-1">Your Contributions</p>
                  <p className="text-slate-400 text-sm">
                    You've reported 8 issues, helping improve community safety and infrastructure
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-slate-200 font-semibold mb-1">Community Score</p>
                  <p className="text-slate-400 text-sm">
                    Your community engagement is above average - keep it up!
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-slate-200 font-semibold mb-1">Next Steps</p>
                  <p className="text-slate-400 text-sm">
                    3 of your issues are in progress - check back for updates soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
