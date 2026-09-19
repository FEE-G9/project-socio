// Web Audio API emergency alarm & siren sound synthesizer
// No external MP3 dependencies required.

class SoundAlarm {
  constructor() {
    this.audioCtx = null;
    this.oscillator = null;
    this.gainNode = null;
    this.intervalId = null;
    this.isPlaying = false;
  }

  _initContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Start dual-tone emergency siren (sweeping frequency 520Hz <-> 960Hz)
   * @param {number} volume - Volume between 0.0 and 1.0 (defaults to 0.15 for comfort)
   */
  startSiren(volume = 0.15) {
    if (this.isPlaying) return;
    try {
      this._initContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      gain.gain.value = Math.max(0.01, Math.min(volume, 0.4));

      const now = this.audioCtx.currentTime;
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.linearRampToValueAtTime(960, now + 0.6);

      let step = 0;
      this.intervalId = setInterval(() => {
        if (!this.audioCtx || this.audioCtx.state !== 'running') return;
        const t = this.audioCtx.currentTime;
        step = (step + 1) % 2;
        if (step === 0) {
          osc.frequency.setValueAtTime(520, t);
          osc.frequency.linearRampToValueAtTime(960, t + 0.6);
        } else {
          osc.frequency.setValueAtTime(960, t);
          osc.frequency.linearRampToValueAtTime(520, t + 0.6);
        }
      }, 650);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();

      this.oscillator = osc;
      this.gainNode = gain;
      this.isPlaying = true;
    } catch (err) {
      console.warn('Audio alarm playback could not start automatically (user gesture required):', err);
    }
  }

  /**
   * Start intermittent rapid warning beeps
   */
  startWarningBeeps(volume = 0.12) {
    if (this.isPlaying) return;
    try {
      this._initContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      gain.gain.value = 0;

      let beepState = false;
      this.intervalId = setInterval(() => {
        if (!this.audioCtx || this.audioCtx.state !== 'running') return;
        beepState = !beepState;
        gain.gain.setValueAtTime(beepState ? volume : 0.0001, this.audioCtx.currentTime);
      }, 250);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();

      this.oscillator = osc;
      this.gainNode = gain;
      this.isPlaying = true;
    } catch (err) {
      console.warn('Audio alarm beeps could not start:', err);
    }
  }

  /**
   * Play single short alert chime
   */
  playChime() {
    try {
      this._initContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, this.audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.45);
    } catch (e) {
      // ignore
    }
  }

  /**
   * Stop current playing alarm and clean up
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch (e) {
        // ignore
      }
      this.oscillator = null;
    }
    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch (e) {
        // ignore
      }
      this.gainNode = null;
    }
    this.isPlaying = false;
  }
}

export const soundAlarm = new SoundAlarm();
export default soundAlarm;
