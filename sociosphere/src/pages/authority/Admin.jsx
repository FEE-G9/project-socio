import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  AlertTriangle, 
  Wallet, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  ChevronRight,
  FileText,
  ShieldAlert,
  ArrowUpRight,
  Clock,
  MapPin,
  X,
  Building2,
  Briefcase,
  Phone,
  Mail,
  PhoneCall,
  HelpCircle,
  TrendingDown,
  Megaphone
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import UserAvatar from '../../components/ui/UserAvatar';
import { mockFinance } from '../../data/mockFinance';
import { getIssues } from '../../data/mockIssues';
import { getCrimes } from '../../data/mockCrimes';
import { getUsers, approveUser, deleteUser } from '../../data/mockUsers';
import { useAlert } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';

const TrendArrow = ({ direction = "up" }) => {
  const isUp = direction === "up";
  return (
    <svg
      viewBox="0 0 90 60"
      className={`h-10 w-14 ${isUp ? "text-emerald-400" : "text-rose-500"}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {isUp ? (
        <>
          <polyline points="6,40 25,50 48,27 62,38 84,8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="69,8 84,8 84,23" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <polyline points="6,15 27,7 47,30 61,20 84,48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="69,48 84,48 84,33" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
};

const AdminHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { triggerAdminAlert } = useAlert();

  const [activeModal, setActiveModal] = useState(null); // 'reports', 'redAlert'
  const [isLoading, setIsLoading] = useState(false);
  const [approvalToast, setApprovalToast] = useState(null);
  
  // Dynamic Stats
  const [issues, setIssues] = useState([]);
  const [crimes, setCrimes] = useState([]);

  useEffect(() => {
    const loadIssues = () => setIssues(getIssues());
    loadIssues();
    window.addEventListener('sociosphere_data_updated', loadIssues);
    window.addEventListener('storage', loadIssues);
    return () => {
      window.removeEventListener('sociosphere_data_updated', loadIssues);
      window.removeEventListener('storage', loadIssues);
    };
  }, []);

  useEffect(() => {
    const loadCrimes = () => setCrimes(getCrimes());
    loadCrimes();
    window.addEventListener('sociosphere_crimes_updated', loadCrimes);
    window.addEventListener('storage', loadCrimes);
    return () => {
      window.removeEventListener('sociosphere_crimes_updated', loadCrimes);
      window.removeEventListener('storage', loadCrimes);
    };
  }, []);

  const [usersList, setUsersList] = useState([]);
  useEffect(() => {
    const loadUsers = () => setUsersList(getUsers());
    loadUsers();
    window.addEventListener('sociosphere_users_updated', loadUsers);
    window.addEventListener('storage', loadUsers);
    return () => {
      window.removeEventListener('sociosphere_users_updated', loadUsers);
      window.removeEventListener('storage', loadUsers);
    };
  }, []);

  const adminSociety = user?.society || user?.communityName || 'Gandhi Colony';
  const adminSocietyCode = user?.societyCode || (
    adminSociety === 'Gandhi Colony' ? 'GC-101' :
    adminSociety === 'Shayam Nagar' ? 'SN-202' : 'DV-303'
  );

  const societyUsers = usersList.filter(u => 
    (u.society || u.communityName || '').toLowerCase() === adminSociety.toLowerCase()
  );
  const pendingRequests = societyUsers.filter(u => u.status === 'Pending Approval');
  const pendingRequestsCount = pendingRequests.length;

  const handleApproveApplicant = (applicantId, applicantName, e) => {
    if (e) e.stopPropagation();
    const applicant = societyUsers.find(u => u.id === applicantId);
    const isAuth = applicant?.role === 'authority' || applicant?.type === 'member';
    approveUser(applicantId);
    setApprovalToast({
      type: 'success',
      message: `✓ ${applicantName} has been approved and admitted to ${adminSociety}! ${isAuth ? 'Their administrative authority account is now active.' : 'Their resident account is now active.'}`
    });
    setTimeout(() => setApprovalToast(null), 5000);
  };

  const handleDeclineApplicant = (applicantId, applicantName, e) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Decline and remove join request from ${applicantName}?`)) {
      deleteUser(applicantId);
      setApprovalToast({
        type: 'info',
        message: `Application from ${applicantName} was declined.`
      });
      setTimeout(() => setApprovalToast(null), 4000);
    }
  };

  const societyIssues = issues.filter(i => 
    (i.society && i.society.toLowerCase() === adminSociety.toLowerCase()) ||
    (i.colonyName && i.colonyName.toLowerCase() === adminSociety.toLowerCase()) ||
    (i.colony && i.colony.toLowerCase() === adminSociety.toLowerCase())
  );

  const societyCrimes = crimes.filter(c =>
    (c.society && c.society.toLowerCase() === adminSociety.toLowerCase()) ||
    (c.colony && c.colony.toLowerCase() === adminSociety.toLowerCase()) ||
    (c.colonyName && c.colonyName.toLowerCase() === adminSociety.toLowerCase())
  );

  const totalIssues = societyIssues.length;
  const resolvedIssues = societyIssues.filter(i => i.status === 'Resolved').length;
  const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 100;

  const handleAction = (modalName) => {
    if (modalName === 'members') {
      navigate('/authority/members?tab=pending');
      return;
    }
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const simulateLoadingAction = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      closeModal();
    }, 1500);
  };

  const recentActivities = [...societyIssues.map(i => ({
    id: i.id, type: 'Issue', title: i.title, status: i.status, date: i.createdAt || new Date().toISOString()
  })), ...societyCrimes.map(c => ({
    id: c.id, type: 'Crime', title: c.title, status: c.status, date: c.timestamp || new Date().toISOString()
  }))].sort((a, b) => {
    const timeA = isNaN(new Date(a.date).getTime()) ? 0 : new Date(a.date).getTime();
    const timeB = isNaN(new Date(b.date).getTime()) ? 0 : new Date(b.date).getTime();
    return timeB - timeA;
  }).slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{adminSociety} Admin</h1>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-black text-emerald-600 dark:text-emerald-400">
              {adminSocietyCode}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of {adminSociety}'s metrics, resident directory, and civic modules.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAction('reports')}
            className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm border border-slate-200 transition-all hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            View Reports
          </button>
          <button
            onClick={() => handleAction('redAlert')}
            className="group relative flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 px-4 py-2 text-sm font-black tracking-wider text-white shadow-md shadow-red-600/30 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-600/40 active:scale-95 animate-pulse"
            title="Trigger Society Red Alert"
          >
            <AlertTriangle size={18} className="text-white shrink-0" />
            <span>RED ALERT</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Issues", value: totalIssues.toString(), trendLabel: "synced", trendDirection: "down", icon: AlertTriangle, iconBg: "bg-blue-500/10", iconColor: "text-blue-500 dark:text-blue-400", href: "/authority/issues" },
          { label: "Active Members", value: (societyUsers.length || 8).toString(), trendLabel: `${adminSociety} directory`, trendDirection: "up", icon: Users, iconBg: "bg-purple-500/10", iconColor: "text-purple-500 dark:text-purple-400", href: "/authority/members" },
          { label: "Total Collected", value: `₹${(mockFinance.totalCollected / 1000).toFixed(1)}k`, trendLabel: "vs last month", trendDirection: "up", icon: Wallet, iconBg: "bg-amber-500/10", iconColor: "text-amber-500 dark:text-amber-400", href: "/authority/fees" },
          { label: "Resolution Rate", value: `${resolutionRate}%`, trendLabel: "tracked", trendDirection: "up", icon: Activity, iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500 dark:text-emerald-400" }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              onClick={() => stat.href && navigate(stat.href)}
              className={`group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-[#0D1524] dark:hover:border-slate-700 ${stat.href ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
                  <Icon size={19} className={stat.iconColor} />
                </div>
                <div className="transition-transform duration-200 group-hover:scale-105">
                  <TrendArrow direction={stat.trendDirection} />
                </div>
              </div>
              <div className="mt-5">
                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">{stat.label}</p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{stat.trendLabel}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Toast Notification */}
          {approvalToast && (
            <div className={`p-4 rounded-xl border flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
              approvalToast.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
            }`}>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{approvalToast.message}</span>
              </div>
              <button 
                onClick={() => setApprovalToast(null)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Incoming Society Applications (Pending Approvals) */}
          {pendingRequests.length > 0 && (
            <section className="rounded-2xl border-2 border-amber-400/60 dark:border-amber-500/40 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/20 dark:from-amber-950/20 dark:via-[#0D1524] dark:to-amber-950/10 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-amber-200/60 dark:border-amber-700/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      Incoming Society Applications
                      <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
                        {pendingRequests.length} Pending
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      New signups awaiting verification to join {adminSociety}.
                    </p>
                  </div>
                </div>
                <Link
                  to="/authority/members?tab=pending"
                  className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  View in Directory <ChevronRight size={14} />
                </Link>
              </div>

              <div className="space-y-3">
                {pendingRequests.map(applicant => {
                  const isAuthApplicant = applicant.role === 'authority' || applicant.type === 'member';
                  return (
                    <div
                      key={applicant.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm gap-4 hover:border-amber-400 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <UserAvatar user={applicant} size="md" />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{applicant.name}</h4>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                              isAuthApplicant
                                ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700/50'
                                : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700/50'
                            }`}>
                              {isAuthApplicant ? 'Authority Request' : 'Resident Request'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Building2 size={13} className="text-slate-400" />
                              {isAuthApplicant
                                ? (applicant.designation || 'Board Committee Member')
                                : `${applicant.blockNumber || 'Block A'} • Flat ${applicant.houseOrFlatNo || applicant.unitNumber || 'N/A'}`
                              }
                            </span>
                            {applicant.occupation && (
                              <span className="flex items-center gap-1">
                                <Briefcase size={13} className="text-slate-400" />
                                {applicant.occupation}
                              </span>
                            )}
                            {applicant.phone && (
                              <span className="flex items-center gap-1">
                                <Phone size={13} className="text-slate-400" />
                                {applicant.phone}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                            <Mail size={13} className="text-slate-400" />
                            {applicant.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleDeclineApplicant(applicant.id, applicant.name, e)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleApproveApplicant(applicant.id, applicant.name, e)}
                          className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {isAuthApplicant ? 'Authorize Admin' : 'Approve & Admit'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* AUTHORITY OPERATIONAL MODULES */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Authority Operational Modules
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Essential Administration Suite
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Issues Tracker */}
              <Link to="/authority/issues" className="group relative flex flex-col items-start justify-between p-5 rounded-2xl border transition-all duration-300 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30 hover:-translate-y-1 hover:border-blue-500/60 hover:shadow-md">
                <div className="p-3 bg-blue-500 text-white rounded-xl shadow-md shadow-blue-500/40 mb-3 group-hover:scale-110 transition-transform">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">Issue Tracker</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Resolve civic complaints, assign technicians & track SLAs.</p>
                </div>
                <ChevronRight className="absolute bottom-5 right-5 text-blue-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={20} />
              </Link>

              {/* Crime & Security */}
              <Link to="/authority/crimes" className="group relative flex flex-col items-start justify-between p-5 rounded-2xl border transition-all duration-300 bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-rose-500/30 hover:-translate-y-1 hover:border-rose-500/60 hover:shadow-md">
                <div className="p-3 bg-rose-500 text-white rounded-xl shadow-md shadow-rose-500/40 mb-3 group-hover:scale-110 transition-transform">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">Crime & Security Log</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Incident investigations, guard dispatch & perimeter reports.</p>
                </div>
                <ChevronRight className="absolute bottom-5 right-5 text-rose-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={20} />
              </Link>

              {/* Resident Directory & Approvals */}
              <Link to="/authority/members" className="group relative flex flex-col items-start justify-between p-5 rounded-2xl border transition-all duration-300 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30 hover:-translate-y-1 hover:border-purple-500/60 hover:shadow-md">
                <div className="p-3 bg-purple-500 text-white rounded-xl shadow-md shadow-purple-500/40 mb-3 group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">Resident Directory & Approvals</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Verify new resident applications and manage flat owner roster.</p>
                </div>
                <ChevronRight className="absolute bottom-5 right-5 text-purple-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={20} />
              </Link>

              {/* Emergency Command Center */}
              <Link to="/authority/emergency" className="group relative flex flex-col items-start justify-between p-5 rounded-2xl border transition-all duration-300 bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/30 hover:-translate-y-1 hover:border-red-500/60 hover:shadow-md">
                <div className="p-3 bg-red-600 text-white rounded-xl shadow-md shadow-red-600/40 mb-3 group-hover:scale-110 transition-transform">
                  <PhoneCall size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">Emergency & Dispatch Center</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Live distress signals, Red Alert siren & guard deployments.</p>
                </div>
                <ChevronRight className="absolute bottom-5 right-5 text-red-600 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={20} />
              </Link>

              {/* Finance & Maintenance Hub */}
              <Link to="/authority/fees" className="group relative flex flex-col items-start justify-between p-5 rounded-2xl border transition-all duration-300 bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-indigo-500/10 border-amber-500/30 hover:-translate-y-1 hover:border-amber-500/60 hover:shadow-md md:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-amber-500 text-white rounded-xl shadow-md shadow-amber-500/40 group-hover:scale-110 transition-transform">
                    <Wallet size={24} />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    Unified Accounts & Maintenance Hub
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">Finance & Maintenance Hub</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Unified management of flat maintenance collections, offline receipts, vendor payouts, AMC contracts, and reserve fund audit.
                  </p>
                </div>
                <ChevronRight className="absolute bottom-5 right-5 text-amber-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={20} />
              </Link>
            </div>
          </section>

          {/* Recent Activities Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Activities</h2>
              <Button variant="secondary" className="text-xs px-3 py-1.5 h-auto" onClick={() => navigate('/authority/issues')}>View All</Button>
            </div>
            
            <Card className="p-0 overflow-hidden">
              {recentActivities.length > 0 ? (
                <div className="divide-y divide-slate-200 dark:divide-slate-700/60">
                  {recentActivities.map((activity, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activity.type === 'Crime' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'}`}>
                          {activity.type === 'Crime' ? <ShieldAlert size={18} /> : <AlertTriangle size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{activity.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{activity.type} • {isNaN(new Date(activity.date).getTime()) ? 'Unknown Date' : new Date(activity.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${activity.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : activity.status === 'In Progress' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' : 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'}`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">No recent activities found.</p>
                </div>
              )}
            </Card>
          </section>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Finance Overview */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Finance Overview</h2>
            <Card className="p-5">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700/60">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Pending Dues</span>
                  <span className="text-sm font-bold text-amber-500 dark:text-amber-400">₹{mockFinance.pendingDues.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700/60">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Monthly Expenses</span>
                  <span className="text-sm font-bold text-rose-500 dark:text-rose-400">₹{mockFinance.monthlyExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Reserve Fund</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₹{mockFinance.reserveFund.toLocaleString()}</span>
                </div>
              </div>
              <Button className="w-full mt-6" variant="secondary" onClick={() => navigate('/authority/fees')}>
                Manage Fees & Collections
              </Button>
            </Card>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h2>
            <Card className="p-0 overflow-hidden">
              <div className="divide-y divide-slate-200 dark:divide-slate-700/60">
                <button 
                  onClick={() => handleAction('members')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative p-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-lg group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                      <Users size={18} />
                      {pendingRequestsCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-500 animate-pulse border-2 border-white dark:border-slate-800" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100 block">Approve Members</span>
                      {pendingRequestsCount > 0 ? (
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                          {pendingRequestsCount} Pending Approval {pendingRequestsCount === 1 ? 'Request' : 'Requests'}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          All requests reviewed
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                </button>

                <button 
                  onClick={() => navigate('/authority/emergency')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 rounded-lg group-hover:bg-rose-100 dark:group-hover:bg-rose-500/20 transition-colors">
                      <PhoneCall size={18} />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Emergency Command Center</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                </button>

                <button 
                  onClick={() => navigate('/authority/fees')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 rounded-lg group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20 transition-colors">
                      <Wallet size={18} />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Finance & Maintenance Hub</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                </button>

                <button 
                  onClick={() => navigate('/authority/faqs')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
                      <HelpCircle size={18} />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">RWA Governance Guidelines</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                </button>
              </div>
            </Card>
          </section>

        </div>
      </div>

      {/* Modals */}
      
      {/* Reports Modal */}
      <Modal isOpen={activeModal === 'reports'} onClose={closeModal} title="Generate Report">
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Select the type of report you want to generate.</p>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
              <FileText className="text-blue-500 dark:text-blue-400" />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Financial Summary</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors">
              <Activity className="text-emerald-500 dark:text-emerald-400" />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Issue Statistics</span>
            </button>
          </div>
          <Button className="w-full mt-2" onClick={simulateLoadingAction} disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : "Download PDF"}
          </Button>
        </div>
      </Modal>

      {/* Red Alert Modal */}
      <Modal isOpen={activeModal === 'redAlert'} onClose={closeModal} title="Initialize Red Alert">
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Send a mass emergency warning to all residents. This will immediately override their screens with a high-priority alarm.
          </p>
          
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-900 dark:text-slate-100">Emergency Category</label>
            <select id="redAlertCategory" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none text-slate-900 dark:text-slate-100">
              <option value="Fire">🔥 Fire</option>
              <option value="Robbery / Intruder">🦹 Robbery / Intruder</option>
              <option value="Medical Emergency">🚑 Medical Emergency</option>
              <option value="Natural Disaster">🌪️ Natural Disaster</option>
              <option value="Other">⚠️ Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-900 dark:text-slate-100">Directive to Residents</label>
            <input 
              type="text" 
              id="redAlertDirective" 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-slate-100" 
              placeholder="e.g., Block C Evacuation: Avoid Main Elevator" 
            />
          </div>
          
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white mt-4 border-0" 
            onClick={() => {
              const category = document.getElementById('redAlertCategory').value;
              const directive = document.getElementById('redAlertDirective').value || 'Please evacuate the area and follow standard emergency procedures.';
              triggerAdminAlert(category, directive);
              closeModal();
            }}
          >
            Dispatch Red Alert
          </Button>
        </div>
      </Modal>

    </div>
  );
};

export default AdminHome;
