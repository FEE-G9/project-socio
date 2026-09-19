import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { 
  ShieldAlert, 
  Phone, 
  MapPin, 
  User, 
  Clock, 
  Volume2, 
  VolumeX, 
  Send, 
  CheckCircle2, 
  AlertTriangle,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useAlert } from '../../context/AlertContext';
import soundAlarm from '../../utils/audioAlarm';

export default function AdminSOSReceiver() {
  const { citizenSOS, acknowledgeCitizenSOS, resolveCitizenSOS } = useAlert();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [responderNote, setResponderNote] = useState('');

  useEffect(() => {
    if (citizenSOS && citizenSOS.status !== 'RESOLVED') {
      // Start siren alarm sound on Admin screen
      soundAlarm.startSiren(0.18);
      setIsAudioPlaying(true);

      const timer = setInterval(() => {
        const start = new Date(citizenSOS.timestamp).getTime();
        const diff = Math.floor((Date.now() - start) / 1000);
        setElapsedSeconds(diff >= 0 ? diff : 0);
      }, 1000);

      return () => {
        clearInterval(timer);
        soundAlarm.stop();
        setIsAudioPlaying(false);
      };
    } else {
      soundAlarm.stop();
      setIsAudioPlaying(false);
    }
  }, [citizenSOS?.id]);

  if (!citizenSOS || citizenSOS.status === 'RESOLVED') return null;

  const toggleAudio = () => {
    if (isAudioPlaying) {
      soundAlarm.stop();
      setIsAudioPlaying(false);
    } else {
      soundAlarm.startSiren(0.18);
      setIsAudioPlaying(true);
    }
  };

  const handleDispatch = () => {
    const note = responderNote.trim() || 'Security Quick Response Team has been dispatched to your unit.';
    acknowledgeCitizenSOS(citizenSOS.id, note);
  };

  const isDispatched = citizenSOS.status === 'DISPATCHED';

  const formatElapsed = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-red-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-2xl my-auto overflow-hidden rounded-3xl border-4 border-red-600 bg-white dark:bg-slate-900 shadow-[0_0_90px_rgba(239,68,68,0.55)]">
        
        {/* Pulsing Flashing Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 shadow-inner backdrop-blur-sm animate-ping">
                <ShieldAlert className="h-7 w-7 text-white" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-white text-red-900 text-xs font-black uppercase tracking-wider">
                    PRIORITY 1 EMERGENCY
                  </span>
                  <span className="font-mono text-xs text-red-100 flex items-center gap-1">
                    <Clock size={12} /> {formatElapsed(elapsedSeconds)} ago
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                  CITIZEN SOS ALARM TRIGGERED
                </h2>
              </div>
            </div>

            {/* Siren Audio Toggle */}
            <button
              onClick={toggleAudio}
              className="flex items-center gap-2 rounded-xl bg-black/30 hover:bg-black/40 px-3 py-2 text-xs font-bold text-white border border-white/20 transition-colors"
            >
              {isAudioPlaying ? (
                <>
                  <Volume2 size={16} className="text-red-300 animate-pulse" />
                  <span>Siren Playing</span>
                </>
              ) : (
                <>
                  <VolumeX size={16} className="text-slate-400" />
                  <span>Muted</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* SOS Details Body */}
        <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          
          {/* Main Alert Card */}
          <div className="rounded-2xl border-2 border-red-500/30 bg-red-50/50 dark:bg-red-950/20 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-red-200 dark:border-red-900/40">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
                Incident Classification
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-600 text-white uppercase tracking-wider">
                {citizenSOS.type}
              </span>
            </div>

            <div className="mt-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Citizen Distress Message:
              </p>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                "{citizenSOS.note}"
              </p>
            </div>
          </div>

          {/* Resident Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <User size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-400">Resident Name</p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{citizenSOS.senderName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <MapPin size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-400">Apartment / Unit</p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{citizenSOS.block} • {citizenSOS.residence}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Phone size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-400">Direct Contact</p>
                <a href={`tel:${citizenSOS.senderPhone}`} className="text-sm font-extrabold text-blue-600 dark:text-blue-400 hover:underline truncate block">
                  {citizenSOS.senderPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Dispatch Note Input */}
          {!isDispatched ? (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Dispatch Instruction / Response Note to Resident
              </label>
              <input
                type="text"
                value={responderNote}
                onChange={(e) => setResponderNote(e.target.value)}
                placeholder="e.g. Guard Sunil & Team dispatched to Flat 402 with First Aid kit."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/50 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Security Dispatched</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">{citizenSOS.responderNote}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {!isDispatched ? (
              <button
                type="button"
                onClick={handleDispatch}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm sm:text-base py-3.5 shadow-lg shadow-red-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <ShieldAlert className="h-5 w-5" />
                DISPATCH SECURITY & ACKNOWLEDGE
              </button>
            ) : (
              <button
                type="button"
                onClick={() => resolveCitizenSOS(citizenSOS.id)}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base py-3.5 shadow-lg shadow-emerald-600/30 transition-all"
              >
                <CheckCircle2 className="h-5 w-5" />
                MARK RESOLVED & CLOSE ALARM
              </button>
            )}

            <button
              type="button"
              onClick={() => resolveCitizenSOS(citizenSOS.id)}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm transition-colors"
            >
              Silence & Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
