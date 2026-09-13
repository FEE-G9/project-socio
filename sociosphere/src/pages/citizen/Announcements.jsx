import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Calendar, 
  AlertCircle,
  Bell
} from 'lucide-react';
import { getAnnouncements } from '../../data/mockAnnouncements';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Load initially
    setAnnouncements(getAnnouncements());
    
    // Listen for cross-tab or dynamic updates if any
    const handleUpdate = () => {
      setAnnouncements(getAnnouncements());
    };
    window.addEventListener('sociosphere_data_updated', handleUpdate);
    return () => window.removeEventListener('sociosphere_data_updated', handleUpdate);
  }, []);

  const getCategoryColor = (cat) => {
    switch ((cat || '').toLowerCase()) {
      case 'maintenance': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
      case 'event': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
      case 'notice': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200 dark:border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Community Hub
            </p>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">Announcements</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official notices, updates, and events from the Society Authority.</p>
        </div>
      </div>

      <div className="space-y-4 max-w-4xl">
        {announcements.map(ann => (
          <div key={ann.id} className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0D1524] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryColor(ann.category)}`}>
                    {ann.category}
                  </span>
                  {ann.important && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20 flex items-center gap-1">
                      <AlertCircle size={12} /> Urgent
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/50">
                  <Calendar size={12} />
                  {new Date(ann.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3 leading-snug">
                {ann.title}
              </h3>
              
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {ann.content}
              </p>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Bell size={14} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{ann.author}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-500">{ann.authorRole}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {announcements.length === 0 && (
          <div className="text-center py-16 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl bg-slate-50 dark:bg-[#0D1524]">
            <Megaphone size={48} className="mx-auto text-slate-400 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">No Announcements</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500">There are no official updates at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
