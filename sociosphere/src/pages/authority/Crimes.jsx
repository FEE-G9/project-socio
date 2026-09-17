import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  MoreVertical,
  Activity,
  AlertTriangle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { getCrimes, updateCrimeStatus } from '../../data/mockCrimes';

const Crimes = () => {
  const [crimes, setCrimes] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  
  // Modal states
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCrimeId, setSelectedCrimeId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    setCrimes(getCrimes());
    
    const handleUpdate = () => setCrimes(getCrimes());
    window.addEventListener('sociosphere_crimes_updated', handleUpdate);
    return () => window.removeEventListener('sociosphere_crimes_updated', handleUpdate);
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

  const getPriorityColor = (priorityClass) => {
    switch ((priorityClass || '').toLowerCase()) {
      case 'critical': return 'rose';
      case 'high': return 'amber';
      case 'medium': return 'blue';
      case 'low': return 'slate';
      default: return 'slate';
    }
  };

  const categories = ['All', ...new Set(crimes.map(i => i.category))];

  const filteredCrimes = activeTab === 'All' 
    ? crimes 
    : crimes.filter(crime => crime.category === activeTab);

  const openStatusModal = (crime) => {
    setSelectedCrimeId(crime.id);
    setNewStatus(crime.status);
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatus = () => {
    if (selectedCrimeId && newStatus) {
      updateCrimeStatus(selectedCrimeId, newStatus);
    }
    setIsStatusModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Crime & Security Log</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage security incidents reported by residents.</p>
        </div>
        <div className="flex items-center gap-4 border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/90 rounded-xl px-3 py-1.5 focus-within:border-rose-500 transition-colors">
          <Search size={16} className="text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder="Search reports..." 
            className="bg-transparent border-none outline-none text-sm w-48 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Detailed Tracker */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Incident Logs</h2>
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto max-w-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === cat 
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredCrimes.map(crime => (
            <Card key={crime.id} className="p-0 overflow-hidden">
              <div className="p-5 sm:p-6">
                <div className="flex flex-col lg:flex-row gap-6 justify-between">
                  
                  {/* Left Column: Info */}
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700/50">{crime.id}</span>
                      <Badge variant={getPriorityColor(crime.priorityClass)}>{crime.priority || "High"}</Badge>
                      <Badge variant={getStatusColor(crime.status)}>{crime.status}</Badge>
                      <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-2 py-0.5 rounded-full">{crime.category}</span>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">{crime.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                        {crime.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#070B14] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        <MapPin size={14} className="text-slate-400 dark:text-slate-500" />
                        {crime.location}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#070B14] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        <Clock size={14} className="text-slate-400 dark:text-slate-500" />
                        Raised: {crime.date || crime.timestamp}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#070B14] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        <ShieldAlert size={14} className="text-slate-400 dark:text-slate-500" />
                        {crime.eta || 'Pending Assignment'}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Metrics & Actions */}
                  <div className="lg:w-64 shrink-0 flex flex-col justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1">Reporter</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                          {crime.reporterName ? crime.reporterName : "Anonymous Resident"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        className="w-full text-xs h-9 bg-rose-600 hover:bg-rose-700 text-white border-0" 
                        onClick={() => openStatusModal(crime)}
                      >
                        Update Status
                      </Button>
                    </div>
                  </div>

                </div>
              </div>
              
              {/* Expandable Footer for latest update */}
              {crime.timeline && crime.timeline.length > 0 && (
                <div className="bg-slate-50 dark:bg-[#111A2B] border-t border-slate-200 dark:border-slate-800 px-5 sm:px-6 py-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">Latest Update:</span> 
                    <span className="truncate">{crime.timeline[crime.timeline.length - 1].note}</span>
                  </p>
                </div>
              )}
            </Card>
          ))}
          
          {filteredCrimes.length === 0 && (
            <div className="text-center py-12 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl bg-slate-50 dark:bg-[#0D1524]">
              <ShieldAlert size={48} className="mx-auto text-slate-400 dark:text-slate-700 mb-4" />
              <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">No crimes reported</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500">There are no security incidents in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Update Status Modal */}
      <Modal 
        isOpen={isStatusModalOpen} 
        onClose={() => setIsStatusModalOpen(false)}
        title="Update Incident Status"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Select the new status for incident <span className="font-mono text-slate-900 dark:text-slate-200">{selectedCrimeId}</span></p>
          
          <div className="space-y-2">
            {['Pending', 'In Progress', 'Resolved'].map(statusOption => (
              <label 
                key={statusOption}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  newStatus === statusOption 
                    ? 'bg-rose-50 border-rose-300 dark:bg-rose-500/10 dark:border-rose-500/30' 
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
                  newStatus === statusOption ? 'border-rose-500' : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {newStatus === statusOption && <div className="w-2 h-2 rounded-full bg-rose-500" />}
                </div>
                <span className={`text-sm font-medium ${newStatus === statusOption ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {statusOption}
                </span>
              </label>
            ))}
          </div>

          <div className="pt-4 flex gap-3">
            <Button variant="secondary" className="w-full" onClick={() => setIsStatusModalOpen(false)}>Cancel</Button>
            <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white border-0" onClick={handleUpdateStatus}>Save Changes</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Crimes;
