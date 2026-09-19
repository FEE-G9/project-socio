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
  ArrowUpRight
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import { mockFinance } from '../../data/mockFinance';
import { getIssues } from '../../data/mockIssues';
import { getCrimes } from '../../data/mockCrimes';
import { useAlert } from '../../context/AlertContext';

const AdminHome = () => {
  const navigate = useNavigate();
  const { triggerAdminAlert } = useAlert();
  const [activeModal, setActiveModal] = useState(null); // 'reports', 'announcement', 'logs', 'members'
  const [isLoading, setIsLoading] = useState(false);
  
  // Dynamic Stats
  const [issues, setIssues] = useState([]);
  const [crimes, setCrimes] = useState([]);

  useEffect(() => {
    const loadIssues = () => setIssues(getIssues());
    loadIssues();
    window.addEventListener('sociosphere_data_updated', loadIssues);
    return () => window.removeEventListener('sociosphere_data_updated', loadIssues);
  }, []);

  useEffect(() => {
    const loadCrimes = () => setCrimes(getCrimes());
    loadCrimes();
    window.addEventListener('sociosphere_crimes_updated', loadCrimes);
    return () => window.removeEventListener('sociosphere_crimes_updated', loadCrimes);
  }, []);

  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'Resolved').length;
  const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 100;

  const handleAction = (modalName) => {
    if (modalName === 'announcement') {
      navigate('/authority/announcements');
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

  const recentActivities = [...issues.map(i => ({
    id: i.id, type: 'Issue', title: i.title, status: i.status, date: i.createdAt || new Date().toISOString()
  })), ...crimes.map(c => ({
    id: c.id, type: 'Crime', title: c.title, status: c.status, date: c.timestamp || new Date().toISOString()
  }))].sort((a, b) => {
    const timeA = isNaN(new Date(a.date).getTime()) ? 0 : new Date(a.date).getTime();
    const timeB = isNaN(new Date(b.date).getTime()) ? 0 : new Date(b.date).getTime();
    return timeB - timeA;
  }).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Header Info - Replaces the old fixed header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Admin Home</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of your society's metrics and modules.</p>
        </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="text-sm" onClick={() => handleAction('reports')}>
              View Reports
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white text-sm border-0 flex items-center gap-2" onClick={() => handleAction('redAlert')}>
              <AlertTriangle size={16} className="animate-pulse" />
              Red Alert
            </Button>
          </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Issues"
          value={totalIssues.toString()}
          icon={AlertTriangle}
          trend="Live"
          trendLabel="synced"
          trendUp={false}
        />
        <StatCard 
          title="Active Members"
          value="892"
          icon={Users}
          trend="+4"
          trendLabel="new this week"
          trendUp={true}
        />
        <StatCard 
          title="Total Collected"
          value={`₹${(mockFinance.totalCollected / 1000).toFixed(1)}k`}
          icon={Wallet}
          trend="+8%"
          trendLabel="vs last month"
          trendUp={true}
        />
        <StatCard 
          title="Resolution Rate"
          value={`${resolutionRate}%`}
          icon={Activity}
          trend="Live"
          trendLabel="tracked"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Authority Modules */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Authority Modules</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/authority/issues" className="block p-5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 rounded-2xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                    <AlertTriangle size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Issue Tracker</h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage and update all society issues reported by citizens.</p>
              </Link>

              <Link to="/authority/crimes" className="block p-5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all group shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 rounded-xl group-hover:scale-110 transition-transform">
                    <ShieldAlert size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Crime Log</h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">View and update statuses for security and crime reports.</p>
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
              <Button className="w-full mt-6" variant="secondary" onClick={() => handleAction('reports')}>
                View Full Report
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
                    <div className="p-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-lg group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                      <Users size={18} />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Approve Members</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                </button>
                <button 
                  onClick={() => handleAction('reports')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
                      <TrendingUp size={18} />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Generate Reports</span>
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