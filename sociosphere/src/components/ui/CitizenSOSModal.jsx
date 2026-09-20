import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Flame, 
  HeartPulse, 
  PhoneCall, 
  X, 
  MapPin, 
  User, 
  Phone, 
  Radio
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import soundAlarm from '../../utils/audioAlarm';

const EMERGENCY_TYPES = [
  {
    id: 'Security Threat',
    label: 'Security / Threat',
    desc: 'Intruder, trespassing, harassment, or physical violence',
    icon: ShieldAlert,
    color: 'border-rose-500 bg-rose-500/10 text-rose-500 dark:text-rose-400'
  },
  {
    id: 'Medical Emergency',
    label: 'Medical Crisis',
    desc: 'Severe injury, cardiac arrest, unresponsiveness',
    icon: HeartPulse,
    color: 'border-red-500 bg-red-500/10 text-red-500 dark:text-red-400'
  },
  {
    id: 'Fire / Hazard',
    label: 'Fire or Gas Hazard',
    desc: 'Flames, thick smoke, or severe gas leakage',
    icon: Flame,
    color: 'border-amber-500 bg-amber-500/10 text-amber-500 dark:text-amber-400'
  },
  {
    id: 'Urgent Assistance',
    label: 'Immediate SOS',
    desc: 'Stuck in elevator, power hazard, or urgent distress',
    icon: AlertTriangle,
    color: 'border-orange-500 bg-orange-500/10 text-orange-500 dark:text-orange-400'
  }
];

export default function CitizenSOSModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const { triggerCitizenSOS } = useAlert();

  const [selectedType, setSelectedType] = useState('Security Threat');
  const [customNote, setCustomNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTriggerSOS = () => {
    setIsSubmitting(true);
    soundAlarm.playChime();

    const sosPayload = {
      senderName: user?.name || 'Resident',
      senderPhone: user?.phone || '+91 98765 43210',
      residence: user?.residence || 'Unit 402',
      block: user?.block || 'Block B',
      type: selectedType,
      note: customNote.trim() || `Urgent ${selectedType} reported at ${user?.residence || 'resident premises'}.`,
      location: `${user?.block || 'Block B'}, ${user?.residence || 'Flat 402'}`
    };

    triggerCitizenSOS(sosPayload);
    setIsSubmitting(false);
    onClose();
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="relative w-full max-w-xl my-auto overflow-hidden rounded-3xl border-2 border-red-500/50 bg-white dark:bg-slate-900 shadow-[0_0_60px_rgba(239,68,68,0.35)] dark:shadow-[0_0_70px_rgba(239,68,68,0.45)] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sos-modal-title"
      >
        {/* Top Danger Gradient Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 shadow-inner backdrop-blur-sm animate-pulse">
                <Radio className="h-6 w-6 text-white" />
              </span>
              <div>
                <h2 id="sos-modal-title" className="text-xl font-extrabold tracking-tight">
                  EMERGENCY SOS DISPATCH
                </h2>
                <p className="text-xs text-red-100 font-medium">
                  Direct live line to Society Admin, Security Guard & Control Room
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Instruction */}
          <div className="flex items-start gap-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 p-3.5">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-red-900 dark:text-red-200">
              Triggering this alert will instantly sound a siren on the <strong>Admin & Security Dashboard</strong> with your live flat details and dispatched alert.
            </p>
          </div>

          {/* Select Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              1. Select Emergency Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EMERGENCY_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-start gap-3 rounded-2xl border-2 p-3 text-left transition-all ${
                      isSelected 
                        ? 'border-red-600 bg-red-500/10 shadow-md ring-2 ring-red-500/20' 
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${type.color}`}>
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold ${isSelected ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                        {type.label}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug">
                        {type.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resident Identity Preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              2. Your Location & Info (Transmitted Automatically)
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-100 dark:bg-slate-800/70 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <User size={14} className="text-slate-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name || 'Resident'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-slate-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.block || 'Block B'} • {user?.residence || 'Flat 402'}</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <Phone size={14} className="text-slate-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.phone || '+91 98765 43210'}</span>
              </div>
            </div>
          </div>

          {/* Additional note / optional */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              3. Quick Details / Specific Location (Optional)
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Near 4th floor staircase, urgent medical kit needed"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* Direct Hotlines Call */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <PhoneCall size={12} /> Direct Emergency Numbers
            </p>
            <div className="grid grid-cols-4 gap-2">
              <a href="tel:100" className="flex flex-col items-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-center transition-colors">
                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">100</span>
                <span className="text-[10px] text-slate-500">Police</span>
              </a>
              <a href="tel:102" className="flex flex-col items-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-center transition-colors">
                <span className="text-xs font-extrabold text-red-600 dark:text-red-400">102</span>
                <span className="text-[10px] text-slate-500">Ambulance</span>
              </a>
              <a href="tel:101" className="flex flex-col items-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-center transition-colors">
                <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">101</span>
                <span className="text-[10px] text-slate-500">Fire</span>
              </a>
              <a href="tel:9876543210" className="flex flex-col items-center p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-center transition-colors">
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">Gate #1</span>
                <span className="text-[10px] text-slate-500">Security</span>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-300 dark:border-slate-700 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTriggerSOS}
              disabled={isSubmitting}
              className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-base py-3.5 shadow-lg shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Radio className="h-5 w-5 animate-pulse" />
              TRANSMIT SOS ALARM
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
