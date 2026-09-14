import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  Filter,
  CheckCircle2,
  Clock,
  Wrench,
  MapPin,
  IndianRupee,
  Search,
  MoreVertical,
  Activity
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { getIssues, updateIssueStatus } from '../../data/mockIssues';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  
  // Modal states
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    setIssues(getIssues());
    
    const handleUpdate = () => setIssues(getIssues());
    window.addEventListener('sociosphere_data_updated', handleUpdate);
    return () => window.removeEventListener('sociosphere_data_updated', handleUpdate);
  }, []);
  
  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'resolved': return 'emerald';
      case 'in progress': return 'amber';
      case 'pending': return 'amber';
      case 'open': return 'blue';
      case 'critical': return 'rose';
      default: return 'slate';
    }
  };

  const getPriorityColor = (priority) => {
    switch ((priority || '').toLowerCase()) {
      case 'critical': return 'rose';
      case 'high': return 'amber';
      case 'medium': return 'blue';
      case 'low': return 'slate';
      default: return 'slate';
    }
  };

  const categories = ['All', ...new Set(issues.map(i => i.category))];

  const filteredIssues = activeTab === 'All' 
    ? issues 
    : issues.filter(issue => issue.category === activeTab);

  const openStatusModal = (issue) => {
    setSelectedIssueId(issue.id);
    setNewStatus(issue.status);
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatus = () => {
    if (selectedIssueId && newStatus) {
      updateIssueStatus(selectedIssueId, newStatus);
    }
    setIsStatusModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Issue Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and resolve complaints raised by citizens.</p>
        </div>
        <div className="flex items-center gap-4 border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/90 rounded-xl px-3 py-1.5 focus-within:border-emerald-500 transition-colors">
          <Search size={16} className="text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder="Search issues..." 
            className="bg-transparent border-none outline-none text-sm w-48 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Most Common Issues Overview */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Priority Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-0 overflow-hidden border-l-4 border-l-amber-500">
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Water Supply</span>
                <Badge variant="amber">High Volume</Badge>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Plumbing & Water</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                <Activity size={12} /> 12 tickets this month
              </p>
            </div>
          </Card>
          
          <Card className="p-0 overflow-hidden border-l-4 border-l-blue-500">
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sanitation Dept</span>
                <Badge variant="blue">Moderate</Badge>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Sanitation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                <Activity size={12} /> 5 tickets this month
              </p>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden border-l-4 border-l-rose-500">
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Security</span>
                <Badge variant="rose">Critical</Badge>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Infrastructure</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                <Activity size={12} /> 8 tickets this month
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Detailed Issue Tracker */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Detailed Issue Tracker</h2>
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto max-w-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === cat 
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredIssues.map(issue => (
            <Card key={issue.id} className="p-0 overflow-hidden">
              <div className="p-5 sm:p-6">
                <div className="flex flex-col lg:flex-row gap-6 justify-between">
                  
                  {/* Left Column: Info */}
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700/50">{issue.id}</span>
                      <Badge variant={getPriorityColor(issue.severity)}>{issue.severity}</Badge>
                      <Badge variant={getStatusColor(issue.status)}>{issue.status}</Badge>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-2 py-0.5 rounded-full">{issue.category}</span>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">{issue.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                        {issue.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#070B14] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        <MapPin size={14} className="text-slate-400 dark:text-slate-500" />
                        {issue.location}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#070B14] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        <Clock size={14} className="text-slate-400 dark:text-slate-500" />
                        Raised: {new Date(issue.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short'})}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#070B14] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        <Wrench size={14} className="text-slate-400 dark:text-slate-500" />
                        {issue.aiAnalysis?.assignedDepartment || 'Pending Assignment'}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Metrics & Actions */}
                  <div className="lg:w-64 shrink-0 flex flex-col justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1">Reporter</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                          <img src={issue.reporterAvatar} className="w-5 h-5 rounded-full object-cover" alt="avatar" />
                          {issue.reportedBy}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1">Est. Resolution Time</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {issue.aiAnalysis?.estimatedResolutionTime || <span className="text-amber-500 dark:text-amber-400">Ongoing</span>}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        className="w-full text-xs h-9" 
                        onClick={() => openStatusModal(issue)}
                      >
                        Update Status
                      </Button>
                      <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
              
              {/* Expandable Footer for latest update */}
              {issue.timeline && issue.timeline.length > 0 && (
                <div className="bg-slate-50 dark:bg-[#111A2B] border-t border-slate-200 dark:border-slate-800 px-5 sm:px-6 py-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">Latest Update:</span> 
                    <span className="truncate">{issue.timeline[issue.timeline.length - 1].note}</span>
                  </p>
                </div>
              )}
            </Card>
          ))}
          
          {filteredIssues.length === 0 && (
            <div className="text-center py-12 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl bg-slate-50 dark:bg-[#0D1524]">
              <CheckCircle2 size={48} className="mx-auto text-slate-400 dark:text-slate-700 mb-4" />
              <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">No issues found</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500">There are no issues reported in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Update Status Modal */}
      <Modal 
        isOpen={isStatusModalOpen} 
        onClose={() => setIsStatusModalOpen(false)}
        title="Update Issue Status"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Select the new status for issue <span className="font-mono text-slate-900 dark:text-slate-200">{selectedIssueId}</span></p>
          
          <div className="space-y-2">
            {['Pending', 'In Progress', 'Resolved'].map(statusOption => (
              <label 
                key={statusOption}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  newStatus === statusOption 
                    ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/30' 
                    : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-[#070B14] dark:border-slate-800 dark:hover:border-slate-700'
                }`}
              >
                <input 
                  type="radio" 
                  name="status"
                  value={statusOption}
                  checked={newStatus === statusOption}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="hidden"
                />
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  newStatus === statusOption ? 'border-emerald-500' : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {newStatus === statusOption && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                </div>
                <span className={`text-sm font-medium ${newStatus === statusOption ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {statusOption}
                </span>
              </label>
            ))}
          </div>

          <div className="pt-4 flex gap-3">
            <Button variant="secondary" className="w-full" onClick={() => setIsStatusModalOpen(false)}>Cancel</Button>
            <Button className="w-full" onClick={handleUpdateStatus}>Save Changes</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Issues;
