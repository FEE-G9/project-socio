import React, { useEffect, useRef } from 'react';
import { useAlert } from '../../context/AlertContext';
import { AlertTriangle, CheckCircle2, Clock, Volume2 } from 'lucide-react';

export default function RedAlertOverlay() {
  const { adminAlert, dismissAdminAlert } = useAlert();
  const audioRef = useRef(null);

  // We'll simulate the audio siren using a basic oscillator if needed, 
  // or just rely on the visual cue as requested in the design.
  // For a real implementation, you would load an audio file:
  // const audio = new Audio('/siren.mp3');

  useEffect(() => {
    if (adminAlert) {
      // Create a basic siren sound using Web Audio API
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // 440 Hz
        oscillator.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 1); // sweep to 880Hz
        
        // Loop the sweep
        setInterval(() => {
          if(audioCtx.state === 'running') {
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
            oscillator.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 1);
          }
        }, 1000);

        gainNode.gain.value = 0.1; // keep volume low for demo
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        
        audioRef.current = { oscillator, audioCtx };
      } catch (e) {
        console.log("Audio play blocked by browser. User needs to interact.");
      }
    } else {
      if (audioRef.current) {
        audioRef.current.oscillator.stop();
        audioRef.current.audioCtx.close();
        audioRef.current = null;
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.oscillator.stop();
        audioRef.current.audioCtx.close();
        audioRef.current = null;
      }
    }
  }, [adminAlert]);

  if (!adminAlert) return null;

  return (
    <div className="fixed inset-0 bg-red-950/90 backdrop-blur-lg z-[9999] flex flex-col items-center justify-center p-8 text-center">
      {/* Audio fallback cue */}
      <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-red-500/30">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        <Volume2 className="w-5 h-5 text-red-200" />
        <span className="text-sm font-bold text-red-200">Siren Playing</span>
      </div>

      <div className="animate-pulse bg-red-600 w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-[0_0_80px_rgba(239,68,68,1)] border-4 border-white/20">
        <AlertTriangle className="w-16 h-16 text-white" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-widest" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
        Red Alert
      </h1>
      
      <div className="bg-red-900/50 border border-red-500/50 rounded-2xl p-6 w-full max-w-lg mb-10 shadow-2xl">
        <p className="text-red-300 font-bold text-sm md:text-base uppercase tracking-wider mb-2">
          {adminAlert.type}
        </p>
        <p className="text-white text-xl md:text-2xl font-medium leading-relaxed">
          {adminAlert.directive}
        </p>
        <p className="text-red-400 text-sm mt-4 flex items-center justify-center gap-1">
          <Clock className="w-4 h-4" /> 
          <span>Issued at {new Date(adminAlert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </p>
      </div>
      
      <button 
        onClick={dismissAdminAlert}
        className="bg-white text-red-900 font-extrabold text-lg px-8 py-4 rounded-xl shadow-2xl hover:bg-red-50 transition-all hover:scale-105 active:scale-95 w-full max-w-lg flex items-center justify-center gap-3"
      >
        <CheckCircle2 className="w-6 h-6" />
        I Understand & Silence Alarm
      </button>
    </div>
  );
}
