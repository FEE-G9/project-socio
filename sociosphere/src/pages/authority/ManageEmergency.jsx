import React, { useState, useEffect, useMemo } from 'react';
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
  Volume2,
  VolumeX
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';

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
  const { 
    activeSOSList, 
    acknowledgeCitizenSOS, 
    resolveCitizenSOS, 
    triggerAdminAlert 
  } = useAlert();

  const adminSociety = user?.society || user?.communityName || 'Gandhi Colony';
  const adminSocietyCode = user?.societyCode || (
    adminSociety === 'Gandhi Colony' ? 'GC-101' :
    adminSociety === 'Shayam Nagar' ? 'SN-202' : 'DV-303'
  );

  // Filter active distress calls for current society
  const societySOSList = useMemo(() => {
    if (!activeSOSList || !Array.isArray(activeSOSList)) return [];
    return activeSOSList.filter(item => {
      if (!item) return false;
      const s = (item.society || '').toLowerCase();
      return !s || s === adminSociety.toLowerCase();
    });
  }, [activeSOSList, adminSociety]);

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

  // Handle Dispatch Guard
  const handleDispatchGuard = (sosId, residentName, unit) => {
    acknowledgeCitizenSOS(sosId, `Security Response Guard dispatched to ${unit}.`);
    showToast(`Rapid Response Team dispatched to ${unit} (${residentName})!`);
  };

  // Handle Resolve SOS (User marks handled)
  const handleResolveSOS = (sosId) => {
    resolveCitizenSOS(sosId);
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
          className="group relative flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-red-600/30 transition-all duration-200 hover:scale-105 hover:shadow-red-600/50 active:scale-95 animate-pulse"
        >
          <AlertTriangle size={18} className="text-white shrink-0" />
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
          { 
            label: "Active Distress Calls", 
            value: societySOSList.length, 
            desc: "Unresolved resident emergencies", 
            icon: AlertTriangle, 
            color: "text-rose-500", 
            bg: "bg-rose-500/10", 
            alert: societySOSList.length > 0 
          },
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
              Live Resident SOS Distress Monitor ({societySOSList.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immediate distress calls triggered by residents within {adminSociety}. Remains active until marked handled.
            </p>
          </div>
        </div>

        {societySOSList.length === 0 ? (
          <Card className="p-8 text-center border-slate-200 dark:border-slate-800">
            <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-2" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">All Quiet on Society Campus</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">No active resident SOS alerts at this time.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {societySOSList.map(sos => {
              const residentName = sos.residentName || sos.senderName || 'Resident';
              const unit = sos.unit || `${sos.block || 'Block'} - ${sos.residence || 'Unit'}`;
              const phone = sos.phone || sos.senderPhone || 'N/A';
              const isSilenced = sos.status === 'Alarm Silenced' || sos.silenced;
              const isDispatched = sos.status === 'Guards Dispatched' || sos.status === 'Guards On Site';

              return (
                <div 
                  key={sos.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border-2 shadow-md gap-4 transition-all ${
                    isSilenced
                      ? 'border-amber-400/80 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/30 dark:from-amber-950/20 dark:via-[#0D1524] dark:to-amber-950/10'
                      : isDispatched
                      ? 'border-blue-400/80 bg-gradient-to-r from-blue-50/70 via-white to-blue-50/30 dark:from-blue-950/20 dark:via-[#0D1524] dark:to-blue-950/10'
                      : 'border-rose-500 bg-gradient-to-r from-rose-50/80 via-white to-rose-50/40 dark:from-rose-950/30 dark:via-[#0D1524] dark:to-rose-950/20'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md shrink-0 ${
                      isSilenced 
                        ? 'bg-amber-500 shadow-amber-500/30' 
                        : isDispatched 
                        ? 'bg-blue-600 shadow-blue-600/30' 
                        : 'bg-rose-600 shadow-rose-600/30 animate-pulse'
                    }`}>
                      {isSilenced ? (
                        <VolumeX size={22} />
                      ) : (
                        <AlertTriangle size={22} className={!isDispatched ? "animate-bounce" : ""} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">{residentName}</h3>
                        <span className="font-bold text-xs px-2.5 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                          {unit}
                        </span>
                        <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300">
                          {sos.type || 'Emergency SOS'}
                        </span>

                        {/* Status Badge */}
                        {isSilenced ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 flex items-center gap-1">
                            <VolumeX size={11} />
                            Alarm Silenced (Active)
                          </span>
                        ) : isDispatched ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/40 flex items-center gap-1">
                            <Shield size={11} />
                            Guards Dispatched
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                            Live Emergency
                          </span>
                        )}
                      </div>

                      {sos.note && (
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 italic bg-white/70 dark:bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-800">
                          "{sos.note}"
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2 flex-wrap">
                        <a 
                          href={`tel:${phone}`} 
                          className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <Phone size={12} /> {phone}
                        </a>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {new Date(sos.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-slate-400 text-[11px]">{sos.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions on this distress call */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDispatchGuard(sos.id, residentName, unit)}
                      className={`px-4 py-2.5 text-xs font-bold rounded-xl text-white shadow-md transition-all flex items-center gap-1.5 ${
                        isDispatched 
                          ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30' 
                          : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                      }`}
                    >
                      <Shield size={14} />
                      {isDispatched ? 'Update Dispatch' : 'Dispatch Guards'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleResolveSOS(sos.id)}
                      className="px-4 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                      title="Mark situation handled and remove from active list"
                    >
                      <CheckCircle2 size={14} />
                      Mark Handled
                    </button>
                  </div>
                </div>
              );
            })}
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

        {/* Emergency Hotlines Directory */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <PhoneCall size={18} className="text-purple-500" />
              Emergency Hotlines & Speed-Dials
            </h2>
          </div>

          <Card className="p-0 overflow-hidden border-slate-200 dark:border-slate-800">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {EMERGENCY_HOTLINES.map((hotline, idx) => {
                const Icon = hotline.icon;
                return (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${hotline.color}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{hotline.name}</p>
                        <p className="text-[11px] text-slate-400">{hotline.category}</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${hotline.number}`}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                    >
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
        size="md"
      >
        <form onSubmit={handleSendRedAlert} className="space-y-4">
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5">
            <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
              <strong>Caution:</strong> This will trigger an immediate high-priority audio-visual alarm that will override resident screens across <strong>{adminSociety}</strong>.
            </p>
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

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setIsRedAlertModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold flex items-center gap-1.5 shadow-md shadow-rose-600/30">
              <Send size={15} />
              Confirm & Blast Alarm
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageEmergency;
