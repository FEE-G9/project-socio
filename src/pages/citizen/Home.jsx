import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  MapPin,
  AlertTriangle,
  Bell,
  Users,
  Zap,
  ChevronRight,
  MessageSquare,
  Heart,
  Share2,
  Play,
} from 'lucide-react';

/**
 * Home Component
 * 
 * Main citizen dashboard page for SocioSphere.
 * Displays community overview, issues, announcements, and AI insights.
 * Designed to be premium, modern, dark, civic-tech focused.
 */

// Mock data - will be replaced with API calls
const mockIssues = [
  {
    id: 1,
    title: 'Pothole on Main Street',
    description: 'Large pothole affecting traffic flow',
    category: 'Infrastructure',
    priority: 'High',
    status: 'In Progress',
    location: 'Main St & 5th Ave',
    date: '2024-08-28',
    image: null,
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
    image: null,
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
    image: null,
    upvotes: 8,
  },
];

const mockAnnouncements = [
  {
    id: 1,
    title: 'Community Clean-up Day',
    description: 'Join us for a community-wide cleanup event this Saturday',
    type: 'Event',
    date: '2024-09-02',
  },
  {
    id: 2,
    title: 'New Community Guidelines',
    description: 'Updated policies for issue reporting',
    type: 'Announcement',
    date: '2024-08-29',
  },
];

const mockStats = [
  {
    label: 'Reported Issues',
    value: 124,
    trend: '+12%',
    icon: AlertCircle,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
  },
  {
    label: 'In Progress',
    value: 34,
    trend: '+3%',
    icon: Clock,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    label: 'Resolved',
    value: 287,
    trend: '+24%',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
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

const Home = () => {
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
      {/* Hero/Welcome Section */}
      <section className="space-y-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-2">
            Welcome back
          </h1>
          <p className="text-slate-400 text-lg">
            Stay informed about your community and take action today
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            icon: AlertCircle,
            label: 'Report Issue',
            href: '/citizen/report',
            color: 'text-rose-400',
          },
          {
            icon: AlertTriangle,
            label: 'Report Crime',
            href: '/citizen/report-crime',
            color: 'text-red-400',
          },
          {
            icon: MapPin,
            label: 'View Map',
            href: '/citizen/map',
            color: 'text-blue-400',
          },
          {
            icon: Users,
            label: 'Community',
            href: '/citizen/community',
            color: 'text-purple-400',
          },
        ].map((action, idx) => (
          <a
            key={idx}
            href={action.href}
            className="group bg-[#0D1524] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 hover:bg-[#111A2B] transition-all duration-200 hover:translate-y-[-2px]"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <action.icon className={`w-8 h-8 ${action.color}`} strokeWidth={1.5} />
              <span className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                {action.label}
              </span>
            </div>
          </a>
        ))}
      </section>

      {/* Issue Statistics */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">Community Issues</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockStats.map((stat, idx) => {
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
                  <span className="text-xs font-semibold text-emerald-400">
                    {stat.trend}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-100">{stat.value}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Active Issues */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100">Active Issues</h2>
          <a
            href="/citizen/issues"
            className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center gap-1 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <div className="space-y-4">
          {mockIssues.map((issue) => (
            <a
              key={issue.id}
              href={`/citizen/issue/${issue.id}`}
              className="group bg-[#0D1524] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 hover:bg-[#111A2B] transition-all duration-200 hover:translate-y-[-2px]"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="px-3 py-1 bg-slate-800/50 text-slate-300 text-xs font-semibold rounded-full flex-shrink-0">
                      {issue.category}
                    </span>
                    <span className={`px-3 py-1 border rounded-full text-xs font-semibold flex-shrink-0 ${getStatusColor(issue.status)}`}>
                      {issue.status}
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
                <div className="flex items-center gap-2 flex-shrink-0">
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

      {/* Announcements & Events */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100">
            Announcements & Events
          </h2>
          <a
            href="/citizen/announcements"
            className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center gap-1 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockAnnouncements.map((announcement) => (
            <a
              key={announcement.id}
              href={`/citizen/announcements`}
              className="group bg-[#0D1524] border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 hover:bg-[#111A2B] transition-all duration-200 hover:translate-y-[-2px]"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  announcement.type === 'Event'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {announcement.type === 'Event' ? (
                    <Zap className="w-5 h-5" strokeWidth={1.5} />
                  ) : (
                    <Bell className="w-5 h-5" strokeWidth={1.5} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-400 mb-1 block">
                    {announcement.type}
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {announcement.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                    {announcement.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(announcement.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Community Health/Activity */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">Community Activity</h2>
        <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div>
                <p className="text-slate-400 text-sm mb-1">Community Participation</p>
                <p className="text-2xl font-bold text-slate-100">2,847 Active Members</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                +12%
              </div>
            </div>
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div>
                <p className="text-slate-400 text-sm mb-1">Issues This Month</p>
                <p className="text-2xl font-bold text-slate-100">47 Reported</p>
              </div>
              <div className="text-sm text-slate-400">28 resolved</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Community Health Score</p>
                <p className="text-2xl font-bold text-emerald-400">8.2/10</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Heart className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Community Insight */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">AI Community Insights</h2>
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
                <h3 className="text-xl font-bold text-slate-100">Top Issues This Week</h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-slate-200 font-semibold mb-1">Infrastructure</p>
                  <p className="text-slate-400 text-sm">
                    Street maintenance issues have increased by 18% this month
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-slate-200 font-semibold mb-1">Response Time</p>
                  <p className="text-slate-400 text-sm">
                    Average issue resolution time is 4.2 days (2 days faster than last month)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-slate-200 font-semibold mb-1">Community Growth</p>
                  <p className="text-slate-400 text-sm">
                    New member participation up 24% - your community is thriving!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency/Help Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">Need Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/citizen/report-crime"
            className="group bg-gradient-to-br from-rose-500/20 to-rose-500/5 border border-rose-500/30 rounded-2xl p-6 hover:border-rose-500/50 transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-500/30 rounded-xl flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-400" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 mb-1">Report Emergency</h3>
                <p className="text-slate-400 text-sm">
                  Report crimes and safety concerns directly to authorities
                </p>
              </div>
            </div>
          </a>

          <a
            href="/citizen/community"
            className="group bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/30 rounded-xl flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-blue-400" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 mb-1">Connect with Community</h3>
                <p className="text-slate-400 text-sm">
                  Find resources, meet neighbors, and get support
                </p>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center space-y-4">
        <h3 className="text-2xl font-bold text-slate-100">Make a Difference Today</h3>
        <p className="text-slate-400 mb-4">
          Report issues, volunteer, or attend community events to help strengthen our neighborhood
        </p>
        <a
          href="/citizen/report"
          className="inline-block px-6 py-3 bg-emerald-500 text-slate-950 text-sm font-bold rounded-xl hover:bg-emerald-400 transition-all duration-200 hover:translate-y-[-2px]"
        >
          Report an Issue Now
        </a>
      </section>
    </div>
  );
};

export default Home;
