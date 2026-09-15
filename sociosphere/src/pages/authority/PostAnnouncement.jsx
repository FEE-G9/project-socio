import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Send, 
  Calendar, 
  AlertCircle,
  CheckCircle2,
  Bell
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getAnnouncements, addAnnouncement } from '../../data/mockAnnouncements';

const PostAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Notice',
    important: false,
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    setAnnouncements(getAnnouncements());
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      const newAnn = {
        ...formData,
        author: 'Society Welfare Board',
        authorRole: 'Society Authority',
        colonyId: 'colony-1' // hardcoded for demo
      };
      
      const updatedList = addAnnouncement(newAnn);
      setAnnouncements(updatedList);
      setIsSubmitting(false);
      setSuccessMsg(true);
      
      // Reset form
      setFormData({
        title: '',
        category: 'Notice',
        important: false,
        content: ''
      });

      setTimeout(() => setSuccessMsg(false), 3000);
    }, 800);
  };

  const getCategoryColor = (cat) => {
    switch (cat.toLowerCase()) {
      case 'maintenance': return 'amber';
      case 'event': return 'blue';
      case 'notice': return 'emerald';
      default: return 'slate';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Announcements</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Broadcast important notices and updates to the community.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Post Form */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 sticky top-24 shadow-sm border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-lg">
                <Megaphone size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">New Broadcast</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Subject Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="E.g. Scheduled Power Outage" 
                  required
                  className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors appearance-none"
                  >
                    <option value="Notice">General Notice</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Event">Event</option>
                  </select>
                </div>
                <div>
                   <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Priority</label>
                   <label className="flex items-center gap-2 h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                     <input 
                       type="checkbox" 
                       name="important"
                       checked={formData.important}
                       onChange={handleInputChange}
                       className="rounded border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-blue-500"
                     />
                     <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Mark Important</span>
                   </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Message Body</label>
                <textarea 
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={5}
                  required
                  placeholder="Enter announcement details..." 
                  className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                {successMsg ? (
                  <div className="flex items-center justify-center gap-2 w-full h-10 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium rounded-xl border border-emerald-200 dark:border-emerald-500/20 text-sm">
                    <CheckCircle2 size={18} />
                    Broadcast Sent!
                  </div>
                ) : (
                  <Button type="submit" disabled={isSubmitting} className="w-full h-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                       <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Sending...</span>
                    ) : (
                      <><Send size={16} /> Publish Announcement</>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Existing Announcements */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
             <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Broadcast History</h2>
             <Badge variant="slate" className="font-normal">{announcements.length} Published</Badge>
          </div>

          <div className="space-y-4">
            {announcements.map(ann => (
              <Card key={ann.id} className="p-0 overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700/60">
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant={getCategoryColor(ann.category)}>{ann.category}</Badge>
                      {ann.important && (
                        <Badge variant="rose" className="flex items-center gap-1">
                          <AlertCircle size={10} /> Urgent
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/50">
                      <Calendar size={12} />
                      {new Date(ann.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2 leading-snug">
                    {ann.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {ann.content}
                  </p>

                  <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Bell size={12} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{ann.author}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-500">{ann.authorRole}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            {announcements.length === 0 && (
              <div className="text-center py-12 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl bg-slate-50 dark:bg-[#0D1524]">
                <Megaphone size={48} className="mx-auto text-slate-400 dark:text-slate-700 mb-4" />
                <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">No Announcements</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500">You haven't broadcasted any announcements yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PostAnnouncement;
