import React, { useContext, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Users,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Bell,
  Check,
  Edit2,
  LogOut,
  ChevronRight,
  Building2,
  Calendar,
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

/**
 * Profile Component
 * 
 * User profile page for SocioSphere citizens.
 * Displays personal info, activity summary, payment status, and settings.
 * Designed to match Home.jsx and Dashboard.jsx visual language exactly.
 */

// Mock user profile data - will be replaced with API calls
const mockUserProfile = {
  id: 1,
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@email.com',
  phone: '+91 98765 43210',
  avatar: null,
  flatNumber: '402',
  societyName: 'Green Valley Residency',
  societyAddress: '45 Oak Lane, Downtown District',
  address: 'Block A, Flat 402, Green Valley Residency, 45 Oak Lane',
  joinDate: '2023-06-15',
  accountStatus: 'Active',
  communityScore: 8.5,
  memberSince: '1 year, 2 months',
};

// Mock user activity
const mockUserActivity = {
  issuesReported: 8,
  issuesResolved: 5,
  inProgress: 3,
  communityScore: 8.5,
  totalContributions: 16,
};

// Mock user issues
const mockMyRecentIssues = [
  {
    id: 1,
    title: 'Pothole on Main Street',
    status: 'In Progress',
    priority: 'High',
    daysOld: 2,
  },
  {
    id: 2,
    title: 'Street Light Malfunction',
    status: 'Reported',
    priority: 'High',
    daysOld: 3,
  },
  {
    id: 3,
    title: 'Park Playground Repairs',
    status: 'Resolved',
    priority: 'Medium',
    daysOld: 5,
  },
];

// Mock payment data
const mockPaymentStatus = [
  {
    title: 'Community Fee',
    amount: '$45.00',
    dueDate: '2024-09-30',
    status: 'Pending',
  },
  {
    title: 'Maintenance Fund',
    amount: '$120.00',
    dueDate: '2024-10-15',
    status: 'Pending',
  },
  {
    title: 'Previous Fee',
    amount: '$45.00',
    dueDate: '2024-08-31',
    status: 'Paid',
  },
];

// Mock notification preferences
const mockNotificationPrefs = [
  {
    id: 1,
    label: 'Issue Updates',
    description: 'Notifications about issues you reported',
    enabled: true,
  },
  {
    id: 2,
    label: 'Community Announcements',
    description: 'Announcements and news from management',
    enabled: true,
  },
  {
    id: 3,
    label: 'Fee Reminders',
    description: 'Reminders about upcoming fee payments',
    enabled: true,
  },
  {
    id: 4,
    label: 'Events & Meetings',
    description: 'Community events and meetings notifications',
    enabled: false,
  },
  {
    id: 5,
    label: 'Email Notifications',
    description: 'Receive notifications via email',
    enabled: true,
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
    case 'Active':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'Pending':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'Paid':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
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

const Profile = () => {
  const authContext = useContext(AuthContext);
  const [notificationPrefs, setNotificationPrefs] = useState(mockNotificationPrefs);

  const toggleNotificationPref = (id) => {
    setNotificationPrefs(
      notificationPrefs.map((pref) =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  const handleLogout = () => {
    if (authContext?.logout) {
      authContext.logout();
    }
    window.location.href = '/login';
  };

  return (
    <div className="space-y-8">
      {/* Profile Header Section */}
      <section className="space-y-4">
        <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-8">
          {/* Profile Header with Avatar */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-blue-500/30 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-emerald-400" strokeWidth={1.5} />
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">
                {mockUserProfile.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Home className="w-4 h-4" />
                  <span className="text-sm">
                    {mockUserProfile.flatNumber} • {mockUserProfile.societyName}
                  </span>
                </div>
                <span className={`px-3 py-1 border rounded-full text-xs font-semibold ${getStatusColor(mockUserProfile.accountStatus)}`}>
                  {mockUserProfile.accountStatus}
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                Community Score: <span className="font-bold text-emerald-400">{mockUserProfile.communityScore}/10</span> • Member for {mockUserProfile.memberSince}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 font-semibold rounded-xl hover:bg-emerald-400 transition-all duration-200">
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 font-semibold rounded-xl border border-slate-700 hover:bg-slate-700 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Information */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-2">Full Name</p>
            <p className="text-lg font-semibold text-slate-100">
              {mockUserProfile.name}
            </p>
          </div>

          {/* Join Date */}
          <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-2">Member Since</p>
            <p className="text-lg font-semibold text-slate-100">
              {new Date(mockUserProfile.joinDate).toLocaleDateString()}
            </p>
          </div>

          {/* Address */}
          <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-6 md:col-span-2">
            <p className="text-slate-400 text-sm mb-2">Residential Address</p>
            <p className="text-lg font-semibold text-slate-100">
              {mockUserProfile.address}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200">
            <div className="flex items-start gap-3 mb-2">
              <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-slate-400 text-sm">Email Address</p>
                <p className="text-lg font-semibold text-slate-100 break-all">
                  {mockUserProfile.email}
                </p>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200">
            <div className="flex items-start gap-3 mb-2">
              <Phone className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-slate-400 text-sm">Phone Number</p>
                <p className="text-lg font-semibold text-slate-100">
                  {mockUserProfile.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resident/Society Information */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">Resident & Society Information</h2>
        <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-8">
          <div className="space-y-6">
            {/* Society Info */}
            <div className="flex items-start gap-4 pb-6 border-b border-slate-800/50">
              <div className="p-3 bg-blue-500/20 rounded-xl flex-shrink-0">
                <Building2 className="w-6 h-6 text-blue-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Your Society</p>
                <p className="text-lg font-semibold text-slate-100 mb-2">
                  {mockUserProfile.societyName}
                </p>
                <p className="text-sm text-slate-400">
                  {mockUserProfile.societyAddress}
                </p>
              </div>
            </div>

            {/* Flat Info */}
            <div className="flex items-start gap-4 pb-6 border-b border-slate-800/50">
              <div className="p-3 bg-emerald-500/20 rounded-xl flex-shrink-0">
                <Home className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Flat/House Number</p>
                <p className="text-lg font-semibold text-slate-100">
                  {mockUserProfile.flatNumber}
                </p>
              </div>
            </div>

            {/* Community Stats */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl flex-shrink-0">
                <Users className="w-6 h-6 text-purple-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Community Engagement</p>
                <p className="text-lg font-semibold text-slate-100 mb-1">
                  Active Community Member
                </p>
                <p className="text-sm text-slate-400">
                  You've contributed {mockUserActivity.totalContributions} times to the community
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* My Activity Summary */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">Your Activity Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Issues Reported */}
          <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-rose-500/10 p-3 rounded-xl">
                <AlertCircle className="w-6 h-6 text-rose-400" strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Issues Reported</p>
            <p className="text-3xl font-bold text-slate-100">
              {mockUserActivity.issuesReported}
            </p>
            <p className="text-xs text-slate-500 mt-2">Community contributor</p>
          </div>

          {/* Issues Resolved */}
          <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-emerald-500/10 p-3 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Resolved Issues</p>
            <p className="text-3xl font-bold text-slate-100">
              {mockUserActivity.issuesResolved}
            </p>
            <p className="text-xs text-slate-500 mt-2">Successfully resolved</p>
          </div>

          {/* In Progress */}
          <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-amber-500/10 p-3 rounded-xl">
                <AlertCircle className="w-6 h-6 text-amber-400" strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">In Progress</p>
            <p className="text-3xl font-bold text-slate-100">
              {mockUserActivity.inProgress}
            </p>
            <p className="text-xs text-slate-500 mt-2">Awaiting resolution</p>
          </div>

          {/* Community Score */}
          <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-500/10 p-3 rounded-xl">
                <Users className="w-6 h-6 text-blue-400" strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Community Score</p>
            <p className="text-3xl font-bold text-slate-100">
              {mockUserActivity.communityScore}
            </p>
            <p className="text-xs text-slate-500 mt-2">Good standing</p>
          </div>
        </div>
      </section>

      {/* My Reported Issues Summary */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100">Your Recent Issues</h2>
          <a
            href="/citizen/issues"
            className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center gap-1 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <div className="space-y-3">
          {mockMyRecentIssues.map((issue) => (
            <a
              key={issue.id}
              href={`/citizen/issue/${issue.id}`}
              className="group bg-[#0D1524] border border-slate-800 rounded-2xl p-4 hover:border-slate-700 hover:bg-[#111A2B] transition-all duration-200 hover:translate-y-[-2px]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mb-2">
                    {issue.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 border rounded-full text-xs font-semibold ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                    <span className={`text-xs font-semibold ${getPriorityColor(issue.priority)}`}>
                      {issue.priority} Priority
                    </span>
                    <span className="text-xs text-slate-500">
                      {issue.daysOld}d old
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Maintenance/Payment Status */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100">Payment Status</h2>
          <a
            href="/citizen/fees"
            className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center gap-1 transition-colors"
          >
            Manage <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockPaymentStatus.map((payment, idx) => (
            <a
              key={idx}
              href="/citizen/fees"
              className="group bg-[#0D1524] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 hover:bg-[#111A2B] transition-all duration-200 hover:translate-y-[-2px]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-800/50 rounded-xl">
                  <DollarSign className={`w-6 h-6 ${payment.status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`} strokeWidth={1.5} />
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-1">{payment.title}</p>
              <p className="text-2xl font-bold text-slate-100 mb-2">{payment.amount}</p>
              <p className="text-xs text-slate-500">
                Due: {new Date(payment.dueDate).toLocaleDateString()}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">Notification Preferences</h2>
        <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-8">
          <div className="space-y-4">
            {notificationPrefs.map((pref) => (
              <div
                key={pref.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-800/50 hover:border-slate-700 transition-all duration-200 bg-slate-800/20"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-100 mb-1">
                    {pref.label}
                  </p>
                  <p className="text-xs text-slate-400">
                    {pref.description}
                  </p>
                </div>
                <button
                  onClick={() => toggleNotificationPref(pref.id)}
                  className={`flex-shrink-0 ml-4 w-10 h-6 rounded-full transition-all duration-200 flex items-center ${
                    pref.enabled
                      ? 'bg-emerald-500'
                      : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full transition-all duration-200 flex items-center justify-center ${
                    pref.enabled
                      ? 'ml-[18px] bg-white'
                      : 'ml-0.5 bg-slate-400'
                  }`}>
                    {pref.enabled && <Check className="w-3 h-3 text-emerald-500" strokeWidth={3} />}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
