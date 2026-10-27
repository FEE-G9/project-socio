import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  ShieldAlert, 
  Radio, 
  Flame, 
  Ambulance, 
  Shield, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Building2, 
  CheckCircle2, 
  Zap, 
  Droplets, 
  Send,
  Eye,
  X,
  Volume2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';

const SOS_STORAGE_KEY = 'sociosphere_active_sos_alerts';

const INITIAL_GUARD_POSTS = [
  { id: 'gp-1', post: 'Main Gate 1 Entrance', guard: 'Head Guard Vikram Singh', shift: 'Day Shift (08:00 - 20:00)', phone: '+91 98000 00001', status: 'Active on Post' },
  { id: 'gp-2', post: 'Gate 2 Service Entry', guard: 'Guard Rameshwar Lal', shift: 'Day Shift (08:00 - 20:00)', phone: '+91 98000 00002', status: 'Active on Post' },
  { id: 'gp-3', post: 'Basement B1 & B2 Parking', guard: 'Patrol Guard Kuldeep', shift: 'Patrol Active', phone: '+91 98000 00003', status: 'On Roving Patrol' },
  { id: 'gp-4', post: 'Clubhouse & Central Park', guard: 'Guard Suraj Pal', shift: 'Day Shift (08:00 - 20:00)', phone: '+91 98000 00004', status: 'Active on Post' },
];

const EMERGENCY_HOTLINES = [
  { name: 'National Emergency', number: '112', category: 'Government', icon: Shield, color: 'text-rose-500 bg-rose-500/10' },
  { name: 'Local Police Sub-Station', number: '01762-224100', category: 'Police', icon: Shield, color: 'text-blue-500 bg-blue-500/10' },
  { name: 'Civil Hospital Emergency', number: '01762-224205', category: 'Medical', icon: Ambulance, color: 'text-rose-500 bg-rose-500/10' },
  { name: 'Fire Station Control Room', number: '101', category: 'Fire', icon: Flame, color: 'text-orange-500 bg-orange-500/10' },
  { name: 'Colony Electrician (Substation)', number: '+91 98111 22334', category: 'Utilities', icon: Zap, color: 'text-amber-500 bg-amber-500/10' },
  { name: 'Colony Plumber & Sump Pump', number: '+91 98111 22335', category: 'Utilities', icon: Droplets, color: 'text-cyan-500 bg-cyan-500/10' },
  { name: 'Schindler Lift Breakdown Hotline', number: '1800-200-1122', category: 'Lift AMC', icon: PhoneCall, color: 'text-emerald-500 bg-emerald-500/10' },
];

const ManageEmergency = () => {
  const { user } = useAuth();
  const { triggerAdminAlert } = useAlert();

  const adminSociety = user?.society || user?.communityName || 'Gandhi Colony';
  const adminSocietyCode = user?.societyCode || (
    adminSociety === 'Gandhi Colony' ? 'GC-101' :
    adminSociety === 'Shayam Nagar' ? 'SN-202' : 'DV-303'
  );

  const [activeSOSList, setActiveSOSList] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(SOS_STORAGE_KEY) || '[]');
      if (stored.length > 0) return stored;
    } catch { /* ignore */ }
    // Initial sample alert for demonstration
    return [
      {
        id: 'SOS-901',
        residentName: 'Aarav Sharma',
        unit: 'Block B - Flat 402',
        phone: '+91 98765 43210',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        type: 'Medical / Panic Call',
        status: 'Guards Dispatched',
        society: 'Gandhi Colony'
      }
    ];
  });

  const [isRedAlertModalOpen, setIsRedAlertModalOpen] = useState(false);
  const [redAlertForm, setRedAlertForm] = useState({
    category: 'Fire',
    directive: 'Block C Evacuation: Avoid Main Elevator. Proceed to Central Lawn assembly point.'
  });
  const [guardPosts, setGuardPosts] = useState(INITIAL_GUARD_POSTS);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMsg({ text: msg, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  useEffect(() => {
    localStorage.setItem(SOS_STORAGE_KEY, JSON.stringify(activeSOSList));
  }, [activeSOSList]);

  // Handle Dispatch Guard
  const handleDispatchGuard = (sosId, residentName, unit) => {
    setActiveSOSList(prev => prev.map(item => {
      if (item.id === sosId) {
        return { ...item, status: 'Guards On Site' };
      }
      return item;
    }));
    showToast(`Rapid Response Team dispatched to ${unit} (${residentName})!`);
  };

  // Handle Resolve SOS
  const handleResolveSOS = (sosId) => {
    setActiveSOSList(prev => prev.filter(item => item.id !== sosId));
    showToast('Situation marked as handled & resolved.');
  };

  // Dispatch Red Alert
  const handleSendRedAlert = (e) => {
    e.preventDefault();
    triggerAdminAlert(redAlertForm.category, redAlertForm.directive);
    setIsRedAlertModalOpen(false);
    showToast(`High-Priority Red Alert broadcasted to all ${adminSociety} screens!`, 'error');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Emergency Command & Guard Dispatch Center
            </h1>
            <span className="rounded-full bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 text-xs font-black text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <ShieldAlert size={12} />
              {adminSociety} ({adminSocietyCode})
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            24×7 Security Operations, Live Distress Signals, Emergency Siren Broadcast, and Guard Post Deployments.
          </p>
        </div>

        <button
          onClick={() => setIsRedAlertModalOpen(true)}
          className="group relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 px-5 py-2.5 text-xs font-black tracking-wider text-white shadow-lg shadow-red-600/30 transition-all duration-200 hover:scale-105 active:scale-95 animate-pulse"
        >
          <Radio size={16} className="text-white shrink-0" />
          <span>BROADCAST RED ALERT</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toastMsg && (
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
          toastMsg.type === 'error'
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200'
            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
        }`}>
          <div className="flex items-center gap-2">
            {toastMsg.type === 'error' ? (
              <AlertTriangle size={18} className="text-rose-500 shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            )}
            <span className="font-semibold text-sm">{toastMsg.text}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Distress Calls", value: activeSOSList.length, desc: "Real-time resident alerts", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10", alert: activeSOSList.length > 0 },
          { label: "On-Duty Guard Posts", value: guardPosts.length, desc: "Active checkpoints manned", icon: Shield, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Security Response Time", value: "< 3 Mins", desc: "Average campus dispatch", icon: Clock, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Emergency Hotlines", value: EMERGENCY_HOTLINES.length, desc: "Verified speed-dials", icon: PhoneCall, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                stat.alert 
                  ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/20 dark:border-rose-800' 
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0D1524]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  <Icon size={20} className={stat.color} />
                </div>
                {stat.alert && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white animate-pulse">
                    Live SOS
                  </span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">{stat.value}</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">{stat.label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{stat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* LIVE SOS DISTRESS FEED */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Radio size={20} className="text-rose-500 animate-pulse" />
              Live Resident SOS Distress Monitor ({activeSOSList.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immediate distress calls triggered by residents within {adminSociety}.
            </p>
          </div>
        </div>

        {activeSOSList.length === 0 ? (
          <Card className="p-8 text-center border-slate-200 dark:border-slate-800">
            <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-2" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">All Quiet on Society Campus</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">No active resident SOS alerts at this time.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {activeSOSList.map(sos => (
              <div 
                key={sos.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border-2 border-rose-400 bg-gradient-to-r from-rose-50/70 via-white to-rose-50/30 dark:from-rose-950/30 dark:via-[#0D1524] dark:to-rose-950/20 shadow-md gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/30 shrink-0">
                    <AlertTriangle size={22} className="animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">{sos.residentName}</h3>
                      <span className="font-bold text-xs px-2.5 py-0.5 rounded-full bg-rose-600 text-white">
                        {sos.unit}
                      </span>
                      <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300">
                        {sos.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                        <Phone size={12} className="text-rose-500" /> {sos.phone}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {new Date(sos.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-slate-400">{sos.id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleDispatchGuard(sos.id, sos.residentName, sos.unit)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5"
                  >
                    <Shield size={14} />
                    Dispatch Guards
                  </button>
                  <button
                    onClick={() => handleResolveSOS(sos.id)}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Mark Handled
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* GUARD POST DEPLOYMENTS & HOTLINES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Guard Deployment Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Shield size={18} className="text-blue-500" />
              Guard Post Deployments ({adminSociety})
            </h2>
          </div>

          <Card className="p-0 overflow-hidden border-slate-200 dark:border-slate-800">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {guardPosts.map(gp => (
                <div key={gp.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{gp.post}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{gp.guard} • {gp.shift}</p>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                      <Phone size={11} /> {gp.phone}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {gp.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Emergency Speed Dials */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <PhoneCall size={18} className="text-rose-500" />
              Emergency Services Speed-Dial
            </h2>
          </div>

          <Card className="p-0 overflow-hidden border-slate-200 dark:border-slate-800">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {EMERGENCY_HOTLINES.map(hotline => {
                const Icon = hotline.icon;
                return (
                  <div key={hotline.name} className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${hotline.color}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{hotline.name}</p>
                        <p className="text-[11px] text-slate-400">{hotline.category}</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${hotline.number}`}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
                    >
                      <Phone size={12} />
                      {hotline.number}
                    </a>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

      </div>

      {/* RED ALERT BROADCAST MODAL */}
      <Modal
        isOpen={isRedAlertModalOpen}
        onClose={() => setIsRedAlertModalOpen(false)}
        title="Broadcast Emergency Red Alert"
      >
        <form onSubmit={handleSendRedAlert} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs leading-relaxed">
            <p className="font-bold flex items-center gap-1.5 mb-1">
              <AlertTriangle size={15} /> HIGH-PRIORITY EMERGENCY OVERRIDE
            </p>
            This siren alert immediately flashes on the screens of all residents logged into {adminSociety}. Use only for genuine critical emergencies.
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Emergency Category *
            </label>
            <select
              value={redAlertForm.category}
              onChange={(e) => setRedAlertForm(prev => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-rose-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="Fire">Fire Incident / Evacuation</option>
              <option value="Robbery / Intruder">Security Breach / Intruder Alert</option>
              <option value="Medical Emergency">Medical Emergency / Ambulance Entry</option>
              <option value="Gas / Power Grid Failure">LPG Gas Leak / Transformer Explosion</option>
              <option value="Natural Disaster">Earthquake / Severe Weather Alert</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Immediate Directive to Residents *
            </label>
            <textarea
              rows={3}
              required
              value={redAlertForm.directive}
              onChange={(e) => setRedAlertForm(prev => ({ ...prev, directive: e.target.value }))}
              placeholder="e.g., Immediate evacuation of Block C. Do not use elevators. Gather at Central Lawn."
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-rose-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setIsRedAlertModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-black tracking-wide">
              DISPATCH RED ALERT NOW
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageEmergency;
