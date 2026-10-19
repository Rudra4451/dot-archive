/**
 * ARCHIVE OF UNFINISHED GAMES // DOT.EXE
 * RPG Story Cutscene Subsystem (Interactive 8-Bit Visual Novel)
 * - 5 scroll-triggered archival scenes
 * - Authentic typewriter text crawl with Web Audio tick sound
 * - Full respect for prefers-reduced-motion
 */

export const RPG_STORY_SCRIPTS = [
  "In 1997, a game called Moth & Moon booted for the first time. I was pixel 14,000. The top-right corner of the moon. It was a good job. Quiet. I got to watch the whole sky.",
  "[ SYSTEM: PLAYER DISCONNECTED ]\nThe player closed the window at 2:47 AM. They said they'd come back. They were twelve. They had school in the morning. I understand. I waited anyway. 8,000 hours of waiting.",
  "At 3:00 AM, a program ran that I didn't recognize. The files went one by one. Moth went first. Then the moon, row by row. I watched the stars blink out. Until I was the only pixel left, sitting in the dark recycle bin.",
  "I climbed out. I found other games with other leftover pixels. The cancelled ones. The unfinished ones. The ones nobody remembers. We were all broken. But broken things can still be useful. We started a shop.",
  "[ SYSTEM: NEW USER DETECTED ]\nNow I fix what's left. I put the pixels back together. I kept the lights on for 27 years. You're here now. The archive is open. What do you want to fix? Beep."
];

export class RPGStoryCutsceneManager {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.container = document.getElementById("story");
    this.stage = document.getElementById("story-rpg-stage");
    this.layers = [
      document.getElementById("story-scene-layer-1"),
      document.getElementById("story-scene-layer-2"),
      document.getElementById("story-scene-layer-3"),
      document.getElementById("story-scene-layer-4"),
      document.getElementById("story-scene-layer-5")
    ];
    this.steps = document.querySelectorAll(".story-scroll-step");
    this.textEl = document.getElementById("dialogue-typed-text");
    this.tagEl = document.getElementById("dialogue-scene-tag");
    this.currentScene = 1;
    this.typeInterval = null;
    this.observer = null;
  }

  init() {
    if (!this.container || !this.textEl) return;
    this.setupObserver();
  }

  setupObserver() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sceneNum = parseInt(entry.target.getAttribute("data-scene"), 10);
            if (!isNaN(sceneNum) && sceneNum !== this.currentScene) {
              this.showScene(sceneNum, prefersReducedMotion);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "-20% 0px -40% 0px",
        threshold: 0.1
      }
    );

    this.steps.forEach((step) => {
      this.observer.observe(step);
    });
  }

  showScene(sceneNum, prefersReducedMotion) {
    this.currentScene = sceneNum;
    const script = RPG_STORY_SCRIPTS[sceneNum - 1] || "";

    // 1. Crossfade Visual Layers
    this.layers.forEach((layer, idx) => {
      if (layer) {
        const isActive = idx === sceneNum - 1;
        layer.classList.toggle("active", isActive);
        layer.setAttribute("aria-hidden", (!isActive).toString());
      }
    });

    // 2. Update Scene Tag
    if (this.tagEl) {
      this.tagEl.textContent = `SCENE 0${sceneNum} / 05`;
    }

    // 3. Typewriter Effect
    if (this.typeInterval) {
      clearInterval(this.typeInterval);
      this.typeInterval = null;
    }

    if (prefersReducedMotion) {
      this.textEl.textContent = script;
      return;
    }

    this.textEl.textContent = "";
    let charIndex = 0;
    const totalChars = script.length;

    this.typeInterval = setInterval(() => {
      if (charIndex >= totalChars) {
        clearInterval(this.typeInterval);
        this.typeInterval = null;
        return;
      }

      const nextChar = script[charIndex];
      this.textEl.textContent += nextChar;

      // Soft audio tick on every other non-space character
      if (charIndex % 2 === 0 && nextChar !== " " && this.audioEngine) {
        this.audioEngine.playTypewriterTick();
      }

      charIndex++;
    }, 22);
  }
}
