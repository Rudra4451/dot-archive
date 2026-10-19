/**
 * ARCHIVE OF UNFINISHED GAMES // DOT.EXE
 * Audio Subsystem: Web Audio API Synthesizer & Master Sound Controls
 */

export class ArchiveAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = true;
    this.activeOscillators = [];
    this.activeTimeouts = [];
    this.currentTrackId = null;
    this.kalimbaStep = 0;
    this.lastHoverTick = 0;
  }

  // Pure Web Audio API: AudioContext created lazily ONLY inside user gesture
  ensureContext() {
    if (!this.ctx) {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
          this.masterGain = this.ctx.createGain();
          const vol = this.isMuted ? 0 : 0.85;
          this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
          this.masterGain.gain.value = vol;
          this.masterGain.connect(this.ctx.destination);
        }
      } catch (err) {
        return null;
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      try {
        this.ctx.resume();
      } catch (e) {}
    }
    return this.ctx;
  }

  setMuted(muted, playSound = true) {
    this.isMuted = muted;
    if (this.ctx && this.masterGain) {
      try {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        const vol = this.isMuted ? 0 : 0.85;
        this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
        this.masterGain.gain.value = vol;
      } catch (e) {}
    }
    if (this.isMuted) {
      // Immediately stop any active chiptune oscillator / scheduler
      this.stopAll();
    } else if (playSound) {
      // Turning sound ON plays a soft, quiet 2-note power-on blip (C5 -> G5)
      this.playPowerOnBlip();
    }
  }

  stopAll() {
    this.activeTimeouts.forEach((t) => clearTimeout(t));
    this.activeTimeouts = [];

    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.activeOscillators = [];
  }

  trackNode(osc) {
    this.activeOscillators.push(osc);
    osc.onended = () => {
      const idx = this.activeOscillators.indexOf(osc);
      if (idx !== -1) this.activeOscillators.splice(idx, 1);
    };
  }

  // Soft, quiet 2-note power-on blip (C5 -> G5)
  playPowerOnBlip() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(783.99, now + 0.08); // G5

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.02);
      gain.gain.setValueAtTime(0.035, now + 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.19);
      this.trackNode(osc);
    } catch (e) {}
  }

  // Repairing a pixel in the Sprite Repair Shop: soothing warm kalimba tone with wooden overtone
  playPixelRepair(repairCount) {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880.00, 987.77, 1046.50, 1174.66];
    const freq = PENTATONIC[(repairCount - 1) % PENTATONIC.length];

    try {
      const now = ctx.currentTime;
      // Fundamental warm sine
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, now);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.045, now + 0.012);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc1.connect(gain1);
      gain1.connect(this.masterGain);
      osc1.start(now);
      osc1.stop(now + 0.23);
      this.trackNode(osc1);

      // Delicate wooden overtone
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 2, now);
      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(0.016, now + 0.005);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc2.connect(gain2);
      gain2.connect(this.masterGain);
      osc2.start(now);
      osc2.stop(now + 0.07);
      this.trackNode(osc2);
    } catch (e) {}
  }

  // Joyful yet soothing 4-note chord when all pixels are restored
  playRestorationFanfare() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chord = [
        { f: 523.25, delay: 0.00, dur: 0.45 }, // C5
        { f: 659.25, delay: 0.09, dur: 0.42 }, // E5
        { f: 783.99, delay: 0.18, dur: 0.40 }, // G5
        { f: 1046.50, delay: 0.27, dur: 0.60 } // C6
      ];

      chord.forEach(({ f, delay, dur }) => {
        const t = now + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.042, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + dur);
        this.trackNode(osc);
      });
    } catch (e) {}
  }

  // Soothing kalimba / music-box note that cycles through peaceful pentatonic melody
  playSoothingKalimba() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const MELODY = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 880.00, 783.99];
    const freq = MELODY[this.kalimbaStep % MELODY.length];
    this.kalimbaStep = (this.kalimbaStep + 1) % MELODY.length;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.042, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.27);
      this.trackNode(osc);
    } catch (e) {}
  }

  // Soothing organic water droplet / dewdrop plop
  playDewdrop() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1420, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.045);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.042, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.13);
      this.trackNode(osc);
    } catch (e) {}
  }

  // Ethereal, dreamy dusk / dawn transition harp for Day & 3:00 AM Night mode
  playDuskDawnHarp(isNight) {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = isNight
        ? [783.99, 659.25, 523.25] // Descending twilight lullaby: G5 -> E5 -> C5
        : [523.25, 659.25, 783.99, 1046.50]; // Ascending dawn chime: C5 -> E5 -> G5 -> C6

      notes.forEach((freq, idx) => {
        const start = now + idx * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.038, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(start);
        osc.stop(start + 0.36);
        this.trackNode(osc);
      });
    } catch (e) {}
  }

  // Gentle velvet hover sound for interactive cards & primary buttons
  playVelvetHoverTick() {
    if (this.isMuted) return;
    const nowMs = performance.now();
    if (this.lastHoverTick && nowMs - this.lastHoverTick < 120) return;
    this.lastHoverTick = nowMs;

    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(950, now);

      gain.gain.setValueAtTime(0.0005, now);
      gain.gain.linearRampToValueAtTime(0.012, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.03);
      this.trackNode(osc);
    } catch (e) {}
  }

  // Gentle wind chime bell for chat chips and suggestions
  playWhisperWindChime() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [1180, 1480].forEach((freq, idx) => {
        const start = now + idx * 0.04;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.025, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(start);
        osc.stop(start + 0.29);
        this.trackNode(osc);
      });
    } catch (e) {}
  }

  // Clicking a node on The Lost Levels Map: soft triangle-wave map blip
  playMapBlip() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(520, now + 0.05);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.07);
      this.trackNode(osc);
    } catch (e) {}
  }

  // Clicking Dot (beep): cute two-step pitch bend (660Hz -> 880Hz, 70ms)
  playDotBeep() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.setValueAtTime(880, now + 0.035);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.01);
      gain.gain.setValueAtTime(0.04, now + 0.055);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.075);
      this.trackNode(osc);
    } catch (e) {}
  }

  // Pressing PRESS START: classic coin/start chime
  playPressStartChime() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.06); // E6

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.01);
      gain.gain.setValueAtTime(0.045, now + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.26);
      this.trackNode(osc);
    } catch (e) {}
  }

  // 8-bit RPG typewriter text crawl tick (triangle wave, soft micro-chime)
  playTypewriterTick() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(740 + Math.random() * 80, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.025);
      this.trackNode(osc);
    } catch (e) {}
  }

  // Sparkle chime when giving Dot a star: sparkling 4-note ascending arpeggio
  playStarChime() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    try {
      const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
      const now = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.055;
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.045, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(start);
        osc.stop(start + 0.17);
        this.trackNode(osc);
      });
    } catch (e) {}
  }

  // Soft cat purr / happy chirrup for Byte the archive cat
  playCatPurr() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.08);
      osc.frequency.linearRampToValueAtTime(130, now + 0.18);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.23);
      this.trackNode(osc);
    } catch (e) {}
  }

  // Soft crisp paper tick for desk sticky notes
  playPaperTick() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1174, now + 0.02);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.045);
      this.trackNode(osc);
    } catch (e) {}
  }

  // Three Original Chiptune Sequences in the Jukebox:
  // Track 0: loading — Brisk, cheerful 8-bit pulse arpeggio loop with sub-bass
  // Track 1: boss — Driving retro action battle theme in D minor with bite
  // Track 2: credits — Warm, nostalgic 8-bit ending credits lullaby
  playJukeboxTrack(trackIndex, durationSeconds, onFinished) {
    this.stopAll();

    // Ensure audio is unmuted cleanly without feedback blip
    if (this.isMuted) {
      this.setMuted(false, false);
    }

    const ctx = this.ensureContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      try {
        ctx.resume();
      } catch (e) {}
    }

    if (this.masterGain && ctx) {
      try {
        this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
        this.masterGain.gain.setValueAtTime(0.85, ctx.currentTime);
        this.masterGain.gain.value = 0.85;
      } catch (e) {}
    }

    this.currentTrackId = trackIndex;
    let trackNotes = [];
    let oscType = "square";
    let baseGain = 0.32;

    if (trackIndex === 0) {
      oscType = "square";
      baseGain = 0.30;
      trackNotes = [
        { f: 523.25, d: 0.12, bass: 261.63 }, // C5 + C4
        { f: 659.25, d: 0.12, bass: 261.63 }, // E5
        { f: 783.99, d: 0.12, bass: 329.63 }, // G5 + E4
        { f: 1046.50, d: 0.16, bass: 392.00 }, // C6 + G4
        { f: 987.77, d: 0.12, bass: 392.00 }, // B5
        { f: 783.99, d: 0.12, bass: 329.63 }, // G5
        { f: 880.00, d: 0.14, bass: 293.66 }, // A5 + D4
        { f: 698.46, d: 0.14, bass: 261.63 }, // F5 + C4
        { f: 783.99, d: 0.16, bass: 392.00 }, // G5
        { f: 659.25, d: 0.14, bass: 329.63 }, // E5
        { f: 587.33, d: 0.14, bass: 293.66 }, // D5
        { f: 523.25, d: 0.22, bass: 261.63 }  // C5
      ];
    } else if (trackIndex === 1) {
      oscType = "square";
      baseGain = 0.34;
      trackNotes = [
        { f: 293.66, d: 0.14, bass: 146.83 }, // D4 + D3
        { f: 293.66, d: 0.14, bass: 146.83 }, // D4
        { f: 349.23, d: 0.16, bass: 174.61 }, // F4 + F3
        { f: 392.00, d: 0.16, bass: 196.00 }, // G4 + G3
        { f: 415.30, d: 0.20, bass: 207.65 }, // Ab4 + Ab3
        { f: 392.00, d: 0.16, bass: 196.00 }, // G4
        { f: 349.23, d: 0.16, bass: 174.61 }, // F4
        { f: 293.66, d: 0.20, bass: 146.83 }, // D4
        { f: 261.63, d: 0.16, bass: 130.81 }, // C4 + C3
        { f: 311.13, d: 0.18, bass: 155.56 }, // Eb4 + Eb3
        { f: 293.66, d: 0.26, bass: 146.83 }, // D4
        { f: 349.23, d: 0.16, bass: 174.61 }, // F4
        { f: 440.00, d: 0.20, bass: 220.00 }, // A4 + A3
        { f: 587.33, d: 0.30, bass: 293.66 }  // D5 + D4
      ];
    } else {
      oscType = "square";
      baseGain = 0.30;
      trackNotes = [
        { f: 329.63, d: 0.26, bass: 164.81 }, // E4 + E3
        { f: 392.00, d: 0.26, bass: 196.00 }, // G4 + G3
        { f: 440.00, d: 0.30, bass: 220.00 }, // A4 + A3
        { f: 493.88, d: 0.34, bass: 246.94 }, // B4 + B3
        { f: 587.33, d: 0.28, bass: 293.66 }, // D5 + D4
        { f: 493.88, d: 0.28, bass: 246.94 }, // B4
        { f: 440.00, d: 0.30, bass: 220.00 }, // A4
        { f: 392.00, d: 0.30, bass: 196.00 }, // G4
        { f: 329.63, d: 0.34, bass: 164.81 }, // E4
        { f: 293.66, d: 0.26, bass: 146.83 }, // D4
        { f: 329.63, d: 0.44, bass: 164.81 }  // E4
      ];
    }

    let noteIdx = 0;
    const playNextNote = () => {
      if (this.currentTrackId !== trackIndex || this.isMuted) return;
      const note = trackNotes[noteIdx % trackNotes.length];
      noteIdx++;

      try {
        const now = Math.max(ctx.currentTime, 0.001);
        const startTime = now + 0.004;
        const attackEnd = startTime + 0.008;
        const sustainEnd = startTime + (note.d * 0.82);
        const releaseEnd = startTime + note.d;

        // Lead Melodic Voice: crisp 8-bit pulse wave
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = oscType;
        osc.frequency.setValueAtTime(note.f, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(baseGain, attackEnd);
        gain.gain.setValueAtTime(baseGain, sustainEnd);
        gain.gain.linearRampToValueAtTime(0.0001, releaseEnd);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(releaseEnd + 0.01);
        this.trackNode(osc);

        // Sub/Bass Complementary Voice
        if (note.bass) {
          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();

          bassOsc.type = "square";
          bassOsc.frequency.setValueAtTime(note.bass, startTime);

          bassGain.gain.setValueAtTime(0.001, startTime);
          bassGain.gain.linearRampToValueAtTime(baseGain * 0.38, attackEnd);
          bassGain.gain.setValueAtTime(baseGain * 0.38, sustainEnd);
          bassGain.gain.linearRampToValueAtTime(0.0001, releaseEnd);

          bassOsc.connect(bassGain);
          bassGain.connect(this.masterGain);

          bassOsc.start(startTime);
          bassOsc.stop(releaseEnd + 0.01);
          this.trackNode(bassOsc);
        }

        const nextTimer = setTimeout(playNextNote, (note.d + 0.018) * 1000);
        this.activeTimeouts.push(nextTimer);
      } catch (e) {}
    };

    playNextNote();

    if (onFinished && durationSeconds) {
      const finishTimer = setTimeout(() => {
        if (this.currentTrackId === trackIndex) {
          this.stopAll();
          onFinished();
        }
      }, durationSeconds * 1000);
      this.activeTimeouts.push(finishTimer);
    }
  }

  // Celebratory 6-note Web Audio fanfare when the Lost Level is revealed
  playLostLevelFanfare() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const fanfareNotes = [
        { f: 523.25, d: 0.12, pause: 0.02 }, // C5
        { f: 659.25, d: 0.12, pause: 0.02 }, // E5
        { f: 783.99, d: 0.12, pause: 0.02 }, // G5
        { f: 1046.50, d: 0.14, pause: 0.03 }, // C6
        { f: 987.77, d: 0.12, pause: 0.02 }, // B5
        { f: 1046.50, d: 0.44, pause: 0.00 }  // C6 sustained triumph
      ];

      let curTime = now + 0.03;
      for (const note of fanfareNotes) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "square";
        osc.frequency.setValueAtTime(note.f, curTime);

        gain.gain.setValueAtTime(0.001, curTime);
        gain.gain.linearRampToValueAtTime(0.048, curTime + 0.012);
        gain.gain.setValueAtTime(0.048, curTime + note.d - 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, curTime + note.d);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(curTime);
        osc.stop(curTime + note.d);
        this.trackNode(osc);

        curTime += note.d + note.pause;
      }
    } catch (e) {}
  }

  // Tactile synthetic audio chime for clicks, counters, stamps, and Easter eggs
  playChime(frequency = 600, type = "square", duration = 0.08) {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.01);
      this.trackNode(osc);
    } catch (e) {}
  }
}

export class SoundMasterManager {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.toggleBtn = document.getElementById("sound-master-toggle");
    this.isMuted = true;
    this.listeners = [];
  }

  init() {
    if (!this.toggleBtn) return;

    try {
      const saved = localStorage.getItem("dotAudioMuted");
      // Default to true to prevent autoplay before user interaction
      this.isMuted = saved !== null ? saved === "true" : true;
    } catch (e) {
      this.isMuted = true;
    }

    if (this.audioEngine) {
      this.audioEngine.setMuted(this.isMuted, false);
    }

    this.updateUI();

    this.toggleBtn.addEventListener("click", () => {
      this.toggle();
    });

    // Keyboard support: Enter / Space
    this.toggleBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.toggle();
      }
    });

    // Global tactile sound effects on interactive elements
    this.bindTactileElements();
  }

  bindTactileElements() {
    const selector = ".card, .primary-cta, .btn, .map-index-btn, .color-swatch-btn, .jukebox-soft-key";
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener(
        "mouseenter",
        () => {
          if (this.audioEngine) this.audioEngine.playVelvetHoverTick();
        },
        { passive: true }
      );
    });
  }

  updateUI() {
    if (!this.toggleBtn) return;

    this.toggleBtn.setAttribute("aria-pressed", (!this.isMuted).toString());
    const label = this.toggleBtn.querySelector(".sound-label");

    if (this.isMuted) {
      this.toggleBtn.classList.remove("active");
      if (label) label.textContent = "Sound OFF";
    } else {
      this.toggleBtn.classList.add("active");
      if (label) label.textContent = "Sound ON";
    }
  }

  toggle() {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem("dotAudioMuted", this.isMuted.toString());
    } catch (e) {}

    this.updateUI();

    if (this.audioEngine) {
      this.audioEngine.setMuted(this.isMuted);
    }

    this.listeners.forEach((fn) => fn(this.isMuted));
  }

  onMuteChange(fn) {
    this.listeners.push(fn);
  }
}
