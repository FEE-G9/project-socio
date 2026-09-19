import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useAlert } from '../../context/AlertContext';
import { AlertTriangle, CheckCircle2, Clock, Volume2, VolumeX } from 'lucide-react';
import soundAlarm from '../../utils/audioAlarm';

export default function RedAlertOverlay() {
  const { adminAlert, dismissAdminAlert } = useAlert();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    if (adminAlert) {
      soundAlarm.startSiren(0.18);
      setIsAudioPlaying(true);
    } else {
      soundAlarm.stop();
      setIsAudioPlaying(false);
    }
    
    return () => {
      soundAlarm.stop();
      setIsAudioPlaying(false);
    };
  }, [adminAlert?.id]);

  if (!adminAlert) return null;

  const toggleAudio = () => {
    if (isAudioPlaying) {
      soundAlarm.stop();
      setIsAudioPlaying(false);
    } else {
      soundAlarm.startSiren(0.18);
      setIsAudioPlaying(true);
    }
  };

  const handleDismiss = () => {
    soundAlarm.stop();
    dismissAdminAlert();
  };

  const overlayContent = (
    <div className="fixed inset-0 bg-red-950/95 backdrop-blur-lg z-[9999] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      {/* Audio toggle button */}
      <button
        onClick={toggleAudio}
        className="absolute top-6 right-6 flex items-center gap-2 bg-black/40 hover:bg-black/60 px-4 py-2 rounded-full border border-red-500/30 text-white transition-colors"
      >
        {isAudioPlaying ? (
          <>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <Volume2 className="w-5 h-5 text-red-200" />
            <span className="text-sm font-bold text-red-200">Siren Playing</span>
          </>
        ) : (
          <>
            <VolumeX className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-bold text-slate-400">Muted</span>
          </>
        )}
      </button>

      <div className="animate-pulse bg-red-600 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center mb-6 shadow-[0_0_80px_rgba(239,68,68,1)] border-4 border-white/20">
        <AlertTriangle className="w-14 h-14 sm:w-16 sm:h-16 text-white" />
      </div>
      
      <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 uppercase tracking-widest" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
        RED ALERT BROADCAST
      </h1>
      
      <div className="bg-red-900/60 border border-red-500/60 rounded-3xl p-6 sm:p-8 w-full max-w-lg mb-8 shadow-2xl backdrop-blur-md">
        <span className="inline-block px-3 py-1 rounded-full bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider mb-3">
          {adminAlert.type}
        </span>
        <p className="text-white text-lg sm:text-2xl font-bold leading-relaxed">
          {adminAlert.directive}
        </p>
        <p className="text-red-300 text-xs sm:text-sm mt-4 flex items-center justify-center gap-1 font-mono">
          <Clock className="w-4 h-4" /> 
          <span>Issued at {new Date(adminAlert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </p>
      </div>
      
      <button 
        onClick={handleDismiss}
        className="bg-white text-red-900 font-black text-base sm:text-lg px-8 py-4 rounded-2xl shadow-2xl hover:bg-red-50 transition-all hover:scale-105 active:scale-95 w-full max-w-lg flex items-center justify-center gap-3"
      >
        <CheckCircle2 className="w-6 h-6 text-red-600" />
        I Understand & Silence Alarm
      </button>
    </div>
  );

  return ReactDOM.createPortal(overlayContent, document.body);
}
