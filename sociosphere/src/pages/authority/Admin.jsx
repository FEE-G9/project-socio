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
  FileText
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import { mockFinance } from '../../data/mockFinance';
import { getIssues } from '../../data/mockIssues';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null); // 'reports', 'announcement', 'logs', 'members'
  const [isLoading, setIsLoading] = useState(false);
  
  // Dynamic Stats
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const loadIssues = () => setIssues(getIssues());
    loadIssues();
    window.addEventListener('sociosphere_data_updated', loadIssues);
    return () => window.removeEventListener('sociosphere_data_updated', loadIssues);
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

  return (
    <div className="space-y-8">
      {/* Header Info - Replaces the old fixed header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of your society's metrics and modules.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="text-sm" onClick={() => handleAction('reports')}>
            View Reports
          </Button>
          <Button className="text-sm" onClick={() => handleAction('announcement')}>
            Post Announcement
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

              <Link to="/authority/analytics" className="block p-5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all group shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                    <Activity size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Analytics Hub</h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">View comprehensive data, resource usage, and AI insights.</p>
              </Link>
            </div>
          </section>

          {/* System Alerts Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">System Alerts</h2>
              <Button variant="secondary" className="text-xs px-3 py-1.5 h-auto" onClick={() => handleAction('logs')}>Manage</Button>
            </div>
            
            <Card className="p-8 border-dashed flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center mb-3 border border-emerald-100 dark:border-emerald-500/20">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100">All Systems Operational</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                There are no critical system alerts at the moment. Community dashboard is running smoothly.
              </p>
              <Button variant="secondary" className="mt-4 text-xs h-8" onClick={() => handleAction('logs')}>
                View System Logs
              </Button>
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

      {/* Announcement Modal */}
      <Modal isOpen={activeModal === 'announcement'} onClose={closeModal} title="Post Announcement">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Title</label>
            <input 
              type="text" 
              placeholder="E.g. Water Supply Interruption" 
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Message</label>
            <textarea 
              rows={4}
              placeholder="Enter announcement details..." 
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-colors resize-none"
            />
          </div>
          <Button className="w-full" onClick={simulateLoadingAction} disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : "Publish to Community"}
          </Button>
        </div>
      </Modal>

      {/* Logs Modal */}
      <Modal isOpen={activeModal === 'logs'} onClose={closeModal} title="System Logs">
        <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <p><span className="text-emerald-600 dark:text-emerald-400">[OK]</span> 2023-10-27 10:15:00 - Database backup completed.</p>
          <p><span className="text-emerald-600 dark:text-emerald-400">[OK]</span> 2023-10-27 09:30:22 - Admin login successful.</p>
          <p><span className="text-emerald-600 dark:text-emerald-400">[OK]</span> 2023-10-27 08:00:00 - Daily cron job executed.</p>
          <p><span className="text-slate-500 dark:text-slate-500">[INFO]</span> 2023-10-26 23:59:59 - System stats aggregated.</p>
          <p><span className="text-amber-600 dark:text-amber-400">[WARN]</span> 2023-10-26 14:20:10 - High memory usage detected (82%).</p>
        </div>
        <Button variant="secondary" className="w-full mt-4" onClick={closeModal}>Close</Button>
      </Modal>

      {/* Members Modal */}
      <Modal isOpen={activeModal === 'members'} onClose={closeModal} title="Pending Approvals">
        <div className="space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No pending member approvals at the moment.</p>
          <Button variant="secondary" className="w-full" onClick={closeModal}>Close</Button>
        </div>
      </Modal>

    </div>
  );
};

export default AdminDashboard;
