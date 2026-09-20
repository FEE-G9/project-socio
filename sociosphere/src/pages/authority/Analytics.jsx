import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Droplets,
  Zap,
  Users,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Spinner from '../../components/ui/Spinner';
import { getIssues } from '../../data/mockIssues';

// Placeholder AIInsight since it might not be exported from UI or have standard theme applied
const AIInsight = ({ title, description, type }) => (
  <div className={`p-4 rounded-xl border ${type === 'warning' ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' : 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20'}`}>
    <h4 className={`text-sm font-bold mb-1 ${type === 'warning' ? 'text-amber-800 dark:text-amber-400' : 'text-blue-800 dark:text-blue-400'}`}>{title}</h4>
    <p className={`text-xs leading-relaxed ${type === 'warning' ? 'text-amber-700 dark:text-amber-300/80' : 'text-blue-700 dark:text-blue-300/80'}`}>{description}</p>
  </div>
);

const Analytics = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  
  const [issues, setIssues] = useState([]);

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

  const totalIssues = issues.length;
  const criticalIssues = issues.filter(i => (i.severity || '').toLowerCase() === 'high' || (i.severity || '').toLowerCase() === 'critical').length;
  const resolvedIssues = issues.filter(i => i.status === 'Resolved').length;
  
  // Dummy math to make the stats look alive based on actual numbers
  const avgResTime = totalIssues > 0 ? Math.max(2, Math.round(48 - (resolvedIssues * 1.5))) : 24;

  const handleGeneratePDF = () => {
    setIsGeneratingPDF(true);
    setTimeout(() => {
      setIsGeneratingPDF(false);
      setPdfGenerated(true);
      setTimeout(() => setPdfGenerated(false), 3000);
    }, 2000);
  };

  // Mock data for charts
  const weeklyResolution = [
    { day: 'Mon', count: Math.floor(resolvedIssues * 0.2), height: '40%' },
    { day: 'Tue', count: Math.floor(resolvedIssues * 0.3), height: '60%' },
    { day: 'Wed', count: Math.floor(resolvedIssues * 0.4), height: '80%' },
    { day: 'Thu', count: Math.floor(resolvedIssues * 0.25), height: '50%' },
    { day: 'Fri', count: Math.floor(resolvedIssues * 0.45), height: '95%' },
    { day: 'Sat', count: Math.floor(resolvedIssues * 0.1), height: '25%' },
    { day: 'Sun', count: Math.floor(resolvedIssues * 0.05), height: '15%' },
  ];

  const resourceUsage = [
    { label: 'Water (Block A)', value: '85%', color: 'bg-blue-500' },
    { label: 'Electricity (Common)', value: '62%', color: 'bg-amber-500' },
    { label: 'Maintenance Staff', value: '90%', color: 'bg-emerald-500' },
    { label: 'Waste Capacity', value: '75%', color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Society Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AI-powered insights and comprehensive statistics.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI Analysis Mode</span>
          <div className="w-10 h-5 bg-emerald-100 dark:bg-emerald-500/20 rounded-full border border-emerald-200 dark:border-emerald-500/30 flex items-center px-0.5">
            <div className="w-4 h-4 bg-emerald-500 dark:bg-emerald-400 rounded-full shadow-sm translate-x-5" />
          </div>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Community Health Score"
          value="92/100"
          icon={Activity}
          trend="+5pts"
          trendLabel="vs last month"
          trendUp={true}
        />
        <StatCard 
          title="Avg. Resolution Time"
          value={`${avgResTime}h`}
          icon={TrendingDown}
          trend="Live"
          trendLabel="synced tracker"
          trendUp={true}
        />
        <StatCard 
          title="Resident Engagement"
          value="68%"
          icon={Users}
          trend="+12%"
          trendLabel="active this week"
          trendUp={true}
        />
        <StatCard 
          title="High/Critical Issues"
          value={criticalIssues.toString()}
          icon={AlertOctagon}
          trend="Live"
          trendLabel="synced tracker"
          trendUp={false}
        />
      </div>

      {/* AI Insights Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">SocioSphere AI Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AIInsight 
            title="Predictive Maintenance"
            description="Based on the past 3 months of data, Elevator B in Tower 2 is highly likely to require maintenance next week. Scheduling a preemptive check is recommended."
            type="warning"
          />
          <AIInsight 
            title="Resource Optimization"
            description="Electricity usage in common areas peaks between 6 PM and 10 PM. Consider dimming alternating corridor lights to save approx. ₹4,500 monthly."
            type="insight"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Issue Resolution Volume</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Tickets resolved per day over the last week</p>
              </div>
              <select className="bg-slate-50 dark:bg-[#111A2B] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-300 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-blue-500">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            
            {/* CSS Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {weeklyResolution.map((data, i) => (
                <div key={i} className="flex flex-col items-center flex-1 gap-3 group">
                  <div className="w-full relative flex items-end justify-center h-48 bg-slate-100 dark:bg-slate-800/30 rounded-t-lg overflow-hidden group-hover:bg-slate-200 dark:group-hover:bg-slate-800/50 transition-colors">
                    <div 
                      className="w-full bg-blue-500/80 rounded-t-md transition-all duration-500 relative"
                      style={{ height: data.height }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-200 text-xs py-1 px-2 rounded font-medium border border-slate-700 pointer-events-none whitespace-nowrap">
                        {data.count} resolved
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-300">
                    {data.day}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Quick Info block */}
             <Card className="p-6">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                   <TrendingUp size={20} />
                 </div>
                 <h3 className="font-semibold text-slate-900 dark:text-slate-100">Top Complaint Categories</h3>
               </div>
               <div className="space-y-4">
                 {['Plumbing (32%)', 'Parking (24%)', 'Security (18%)', 'Electrical (15%)'].map((item, i) => (
                   <div key={i} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-2 last:border-0">
                     <span className="text-sm text-slate-700 dark:text-slate-300">{item.split(' ')[0]}</span>
                     <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.split(' ')[1]}</span>
                   </div>
                 ))}
               </div>
             </Card>

             <Card className="p-6 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-[#0D1524] dark:to-[#111A2B]">
               <div className="flex flex-col h-full justify-center text-center space-y-3">
                 <div className="mx-auto p-3 bg-purple-100 dark:bg-purple-500/10 rounded-full w-min border border-purple-200 dark:border-purple-500/20">
                   <Users size={24} className="text-purple-600 dark:text-purple-400" />
                 </div>
                 <div>
                   <p className="text-sm text-slate-500 dark:text-slate-400">Net Promoter Score</p>
                   <p className="text-4xl font-bold text-slate-900 dark:text-slate-50 mt-1">74</p>
                 </div>
                 <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Excellent Community Satisfaction</p>
               </div>
             </Card>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-6">Resource Utilization</h3>
            <div className="space-y-6">
              {resourceUsage.map((resource, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      {resource.label.includes('Water') && <Droplets size={14} className="text-blue-500 dark:text-blue-400" />}
                      {resource.label.includes('Elec') && <Zap size={14} className="text-amber-500 dark:text-amber-400" />}
                      {resource.label}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">{resource.value}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${resource.color}`} 
                      style={{ width: resource.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-slate-50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 border-dashed">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                {pdfGenerated ? <CheckCircle2 className="text-emerald-500 dark:text-emerald-400" /> : <BarChart3 className="text-slate-400 dark:text-slate-400" />}
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-200">
                  {pdfGenerated ? 'Report Exported Successfully' : 'Export Complete Report'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                  {pdfGenerated ? 'Your file has been downloaded.' : 'Download PDF containing full monthly analytics, financials, and AI insights.'}
                </p>
                <button 
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF || pdfGenerated}
                  className="w-full flex items-center justify-center h-9 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-900 dark:text-slate-200 text-sm font-medium rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
                >
                  {isGeneratingPDF ? <Spinner size="sm" /> : pdfGenerated ? 'Downloaded' : 'Generate PDF'}
                </button>
              </div>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
};

export default Analytics;
