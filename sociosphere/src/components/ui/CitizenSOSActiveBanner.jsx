import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  XCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PhoneCall, 
  AlertCircle 
} from 'lucide-react';
import { useAlert } from '../../context/AlertContext';
import soundAlarm from '../../utils/audioAlarm';

export default function CitizenSOSActiveBanner() {
  const { citizenSOS, cancelCitizenSOS, resolveCitizenSOS } = useAlert();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (citizenSOS && citizenSOS.status !== 'RESOLVED') {
      // Start audio warning on citizen trigger
      soundAlarm.startWarningBeeps(0.08);
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
      soundAlarm.startWarningBeeps(0.08);
      setIsAudioPlaying(true);
    }
  };

  const isDispatched = citizenSOS.status === 'DISPATCHED';

  const formatElapsed = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl animate-in slide-in-from-top-6 duration-300">
      <div className={`relative overflow-hidden rounded-3xl border-2 p-4 sm:p-5 shadow-2xl backdrop-blur-xl transition-all ${
        isDispatched 
          ? 'bg-amber-950/90 border-amber-500 text-amber-50 shadow-[0_0_40px_rgba(245,158,11,0.3)]'
          : 'bg-red-950/95 border-red-500 text-red-50 shadow-[0_0_50px_rgba(239,68,68,0.4)]'
      }`}>
        {/* Pulsing indicator background light */}
        <div className={`absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full blur-3xl ${
          isDispatched ? 'bg-amber-500/30' : 'bg-red-500/40 animate-pulse'
        }`} />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Status badge & detail */}
          <div className="flex items-start gap-3.5">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              isDispatched 
                ? 'bg-amber-500/20 border border-amber-400/40 text-amber-300' 
                : 'bg-red-500/20 border border-red-400/40 text-red-300 animate-bounce'
            }`}>
              {isDispatched ? <ShieldCheck size={26} /> : <Radio size={26} />}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider uppercase ${
                  isDispatched 
                    ? 'bg-amber-500 text-amber-950 animate-pulse' 
                    : 'bg-red-600 text-white animate-pulse'
                }`}>
                  {isDispatched ? 'SECURITY DISPATCHED' : 'LIVE SOS ACTIVE'}
                </span>
                
                <span className="text-xs text-slate-300 flex items-center gap-1 font-mono">
                  <Clock size={12} /> {formatElapsed(elapsedSeconds)} elapsed
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black tracking-tight mt-1 text-white flex items-center gap-2">
                {citizenSOS.type}
              </h3>

              <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                {isDispatched 
                  ? (citizenSOS.responderNote || 'Admin has dispatched emergency personnel to your unit.')
                  : 'Alert is broadcasting in real-time to the Admin & Security Control Room.'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
              title={isAudioPlaying ? 'Mute alert sound' : 'Unmute alert sound'}
            >
              {isAudioPlaying ? (
                <>
                  <Volume2 size={16} className="text-emerald-400 animate-pulse" />
                  <span className="hidden sm:inline">Siren On</span>
                </>
              ) : (
                <>
                  <VolumeX size={16} className="text-slate-400" />
                  <span className="hidden sm:inline">Muted</span>
                </>
              )}
            </button>

            {/* Cancel / I Am Safe Button */}
            <button
              onClick={() => resolveCitizenSOS(citizenSOS.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs sm:text-sm shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <CheckCircle2 size={16} className="text-emerald-600" />
              I Am Safe / Resolve SOS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
