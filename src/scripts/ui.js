/**
 * ARCHIVE OF UNFINISHED GAMES // DOT.EXE
 * UI Modules & Archival Interaction Components
 */

import confetti from "canvas-confetti";

// ---------------------------------------------------------------------------
// 1. BOOT SEQUENCE ENGINE
// ---------------------------------------------------------------------------
export const BOOT_LINES = [
  "OPENING ARCHIVE / 09...",
  "CHECKING SPRITES... 1 NEEDS REPAIR",
  "LOOKING FOR A LAST FRAME...",
  "DOT FOUND. BEEP."
];

export const STORAGE_KEY = "archive_boot_completed_v1";

export class BootSequenceManager {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.bootSection = document.getElementById("boot");
    this.terminalBox = document.getElementById("boot-terminal-box");
    this.screenEl = document.getElementById("terminal-screen");
    this.cursorEl = document.getElementById("term-cursor");
    this.skipBtn = document.getElementById("skip-boot-btn");
    this.replayBtn = document.getElementById("replay-boot-btn");
    this.pressStartBtn = document.getElementById("press-start-btn");
    this.dotSvg = document.getElementById("dot-svg-hero");

    this.timeouts = [];
    this.isBooting = false;
  }

  init() {
    if (!this.bootSection || !this.screenEl) return;

    this.setupEvents();

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasBootedBefore = this.getStorageFlag();

    if (prefersReducedMotion || hasBootedBefore) {
      this.resolveImmediately();
    } else {
      this.startSequence();
    }
  }

  getStorageFlag() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch (e) {
      return false;
    }
  }

  setStorageFlag() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch (e) {}
  }

  setupEvents() {
    if (this.skipBtn) {
      this.skipBtn.addEventListener("click", () => {
        this.skip();
      });
    }

    if (this.replayBtn) {
      this.replayBtn.addEventListener("click", () => {
        this.replay();
      });
    }

    if (this.pressStartBtn) {
      this.pressStartBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (this.audioEngine) {
          this.audioEngine.playPressStartChime();
        }
        const aboutEl = document.getElementById("about");
        if (aboutEl) {
          aboutEl.scrollIntoView({ behavior: "smooth" });
          aboutEl.setAttribute("tabindex", "-1");
          aboutEl.focus({ preventScroll: true });
          try {
            history.pushState(null, "", "#about");
          } catch (err) {}
        }
      });
    }

    if (this.dotSvg) {
      this.dotSvg.style.cursor = "pointer";
      this.dotSvg.addEventListener("click", () => {
        if (this.audioEngine) {
          this.audioEngine.playDotBeep();
        }
      });
    }
  }

  clearTimeouts() {
    this.timeouts.forEach((id) => clearTimeout(id));
    this.timeouts = [];
  }

  startSequence() {
    this.clearTimeouts();
    this.isBooting = true;

    if (this.skipBtn) this.skipBtn.style.display = "inline";
    if (this.replayBtn) this.replayBtn.style.display = "none";
    this.bootSection.classList.remove("boot-completed");

    this.screenEl.innerHTML = "";
    if (this.cursorEl) {
      this.cursorEl.style.display = "inline-block";
      this.screenEl.appendChild(this.cursorEl);
    }

    const stepDelays = [0, 400, 850, 1300];

    BOOT_LINES.forEach((lineText, index) => {
      const delay = stepDelays[index];
      const timerId = setTimeout(() => {
        this.appendTerminalLine(lineText, index === 3);
      }, delay);
      this.timeouts.push(timerId);
    });

    const completionTimer = setTimeout(() => {
      this.finishSequence();
    }, 1650);
    this.timeouts.push(completionTimer);
  }

  appendTerminalLine(text, isHighlight) {
    const line = document.createElement("div");
    line.className = "term-line" + (isHighlight ? " highlight" : "");
    line.textContent = text;

    if (this.cursorEl && this.cursorEl.parentNode === this.screenEl) {
      this.screenEl.insertBefore(line, this.cursorEl);
    } else {
      this.screenEl.appendChild(line);
      if (this.cursorEl) this.screenEl.appendChild(this.cursorEl);
    }
  }

  finishSequence() {
    this.isBooting = false;
    this.clearTimeouts();
    this.setStorageFlag();

    this.bootSection.classList.add("boot-completed");

    if (this.skipBtn) this.skipBtn.style.display = "none";
    if (this.replayBtn) this.replayBtn.style.display = "inline";

    if (this.dotSvg) {
      this.dotSvg.style.transform = "scale(1.05)";
      setTimeout(() => {
        if (this.dotSvg) this.dotSvg.style.transform = "scale(1)";
      }, 250);
    }
  }

  skip() {
    this.clearTimeouts();
    this.resolveImmediately();
  }

  replay() {
    this.startSequence();
  }

  resolveImmediately() {
    this.clearTimeouts();
    this.screenEl.innerHTML = "";

    BOOT_LINES.forEach((lineText, index) => {
      const line = document.createElement("div");
      line.className = "term-line" + (index === 3 ? " highlight" : "");
      line.textContent = lineText;
      this.screenEl.appendChild(line);
    });

    if (this.cursorEl) {
      this.cursorEl.style.display = "inline-block";
      this.screenEl.appendChild(this.cursorEl);
    }

    this.finishSequence();
  }
}

// ---------------------------------------------------------------------------
// 2. DOSSIER PORTRAIT INTERACTION
// ---------------------------------------------------------------------------
export const CANON_BEEPS = [
  '[ DOT: "beep! (excuse me)" ]',
  '[ DOT: "beep! duplicate glitch." ]',
  '[ DOT: "beep! saved a sprite." ]',
  '[ DOT: "beep! floppy disk safe." ]'
];

export class DossierPortraitManager {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.portraitBtn = document.getElementById("dossier-portrait-btn");
    this.speechStamp = document.getElementById("speech-stamp-text");
    this.speechSlot = document.getElementById("portrait-speech-slot");
    this.beepIndex = 0;
    this.isSneezing = false;
  }

  init() {
    if (!this.portraitBtn || !this.speechStamp) return;

    this.portraitBtn.addEventListener("click", () => {
      this.triggerSneezeGlitch();
    });
  }

  triggerSneezeGlitch() {
    if (this.isSneezing) return;
    this.isSneezing = true;

    if (this.audioEngine) {
      this.audioEngine.playDotBeep();
    }

    this.portraitBtn.classList.add("sneezing");

    const phrase = CANON_BEEPS[this.beepIndex % CANON_BEEPS.length];
    this.beepIndex++;

    this.speechStamp.textContent = phrase;
    this.speechStamp.classList.add("active");

    setTimeout(() => {
      this.portraitBtn.classList.remove("sneezing");
      this.isSneezing = false;
    }, 400);
  }
}

// ---------------------------------------------------------------------------
// 3. SPRITE REPAIR WORKSHOP
// ---------------------------------------------------------------------------
export const REPAIR_FILES = [
  {
    id: 0,
    tabLabel: "[01: MOON_88.SPR]",
    tabShort: "[01: MOON_88]",
    title: "CRESCENT MOON // MOTH & MOON (1997)",
    copy: "“I was pixel 14,000, row 88. I made the corner of the moon. It was a good job. I had one frame and a very small responsibility.”",
    damagedCount: 6,
    cells: [
      { r: 0, c: 0, fill: "transparent" },
      { r: 0, c: 1, fill: "transparent" },
      { r: 0, c: 2, fill: "#4fd1c5" },
      { r: 0, c: 3, fill: "#4fd1c5", corrupted: true },
      { r: 0, c: 4, fill: "transparent" },
      { r: 0, c: 5, fill: "transparent" },
      { r: 1, c: 0, fill: "transparent" },
      { r: 1, c: 1, fill: "#4fd1c5" },
      { r: 1, c: 2, fill: "#4fd1c5", corrupted: true },
      { r: 1, c: 3, fill: "#ffb347" },
      { r: 1, c: 4, fill: "transparent" },
      { r: 1, c: 5, fill: "transparent" },
      { r: 2, c: 0, fill: "#4fd1c5", corrupted: true },
      { r: 2, c: 1, fill: "#4fd1c5" },
      { r: 2, c: 2, fill: "transparent" },
      { r: 2, c: 3, fill: "transparent" },
      { r: 2, c: 4, fill: "transparent" },
      { r: 2, c: 5, fill: "transparent" },
      { r: 3, c: 0, fill: "#4fd1c5" },
      { r: 3, c: 1, fill: "#4fd1c5", corrupted: true },
      { r: 3, c: 2, fill: "transparent" },
      { r: 3, c: 3, fill: "transparent" },
      { r: 3, c: 4, fill: "transparent" },
      { r: 3, c: 5, fill: "transparent" },
      { r: 4, c: 0, fill: "transparent" },
      { r: 4, c: 1, fill: "#4fd1c5" },
      { r: 4, c: 2, fill: "#4fd1c5" },
      { r: 4, c: 3, fill: "#ffb347", corrupted: true },
      { r: 4, c: 4, fill: "transparent" },
      { r: 4, c: 5, fill: "transparent" },
      { r: 5, c: 0, fill: "transparent" },
      { r: 5, c: 1, fill: "transparent" },
      { r: 5, c: 2, fill: "#4fd1c5", corrupted: true },
      { r: 5, c: 3, fill: "#4fd1c5" },
      { r: 5, c: 4, fill: "transparent" },
      { r: 5, c: 5, fill: "transparent" }
    ]
  },
  {
    id: 1,
    tabLabel: "[02: SWORD_LV4.SPR]",
    tabShort: "[02: SWORD_LV4]",
    title: "BROKEN BROADSWORD // TAVERN HERO (1995)",
    copy: "“A level-four broadsword abandoned when the developer went to college. The tip is missing three pixels. It can still cut bread.”",
    damagedCount: 7,
    cells: [
      { r: 0, c: 0, fill: "transparent" },
      { r: 0, c: 1, fill: "transparent" },
      { r: 0, c: 2, fill: "transparent" },
      { r: 0, c: 3, fill: "#a34063", corrupted: true },
      { r: 0, c: 4, fill: "transparent" },
      { r: 0, c: 5, fill: "transparent" },
      { r: 1, c: 0, fill: "transparent" },
      { r: 1, c: 1, fill: "#a34063", corrupted: true },
      { r: 1, c: 2, fill: "#a34063" },
      { r: 1, c: 3, fill: "#a34063" },
      { r: 1, c: 4, fill: "#ffb347", corrupted: true },
      { r: 1, c: 5, fill: "#a34063" },
      { r: 2, c: 0, fill: "#a34063", corrupted: true },
      { r: 2, c: 1, fill: "#a34063" },
      { r: 2, c: 2, fill: "#a34063" },
      { r: 2, c: 3, fill: "#a34063", corrupted: true },
      { r: 2, c: 4, fill: "#a34063" },
      { r: 2, c: 5, fill: "#a34063" },
      { r: 3, c: 0, fill: "transparent" },
      { r: 3, c: 1, fill: "#a34063" },
      { r: 3, c: 2, fill: "#a34063", corrupted: true },
      { r: 3, c: 3, fill: "#a34063" },
      { r: 3, c: 4, fill: "#a34063" },
      { r: 3, c: 5, fill: "transparent" },
      { r: 4, c: 0, fill: "transparent" },
      { r: 4, c: 1, fill: "transparent" },
      { r: 4, c: 2, fill: "#a34063" },
      { r: 4, c: 3, fill: "#a34063", corrupted: true },
      { r: 4, c: 4, fill: "transparent" },
      { r: 4, c: 5, fill: "transparent" },
      { r: 5, c: 0, fill: "transparent" },
      { r: 5, c: 1, fill: "transparent" },
      { r: 5, c: 2, fill: "transparent" },
      { r: 5, c: 3, fill: "transparent" },
      { r: 5, c: 4, fill: "transparent" },
      { r: 5, c: 5, fill: "transparent" }
    ]
  },
  {
    id: 2,
    tabLabel: "[03: FLOPPY_99.SPR]",
    tabShort: "[03: FLOPPY_99]",
    title: "3.5\" SAVE DISK // PROJECT YESTERDAY (1999)",
    copy: "“A late-night build stamped 2:47 AM. Ink chassis, cyan shutter, cream label. Dot's most treasured artifact.”",
    damagedCount: 8,
    cells: [
      { r: 0, c: 0, fill: "#1a1a1a" },
      { r: 0, c: 1, fill: "#1a1a1a" },
      { r: 0, c: 2, fill: "#1a1a1a", corrupted: true },
      { r: 0, c: 3, fill: "#1a1a1a" },
      { r: 0, c: 4, fill: "#1a1a1a" },
      { r: 0, c: 5, fill: "transparent" },
      { r: 1, c: 0, fill: "#1a1a1a" },
      { r: 1, c: 1, fill: "#fff8f1" },
      { r: 1, c: 2, fill: "#fff8f1", corrupted: true },
      { r: 1, c: 3, fill: "#fff8f1" },
      { r: 1, c: 4, fill: "#1a1a1a" },
      { r: 1, c: 5, fill: "#1a1a1a" },
      { r: 2, c: 0, fill: "#1a1a1a" },
      { r: 2, c: 1, fill: "#fff8f1", corrupted: true },
      { r: 2, c: 2, fill: "#4fd1c5", corrupted: true },
      { r: 2, c: 3, fill: "#fff8f1" },
      { r: 2, c: 4, fill: "#1a1a1a" },
      { r: 2, c: 5, fill: "#1a1a1a" },
      { r: 3, c: 0, fill: "#1a1a1a" },
      { r: 3, c: 1, fill: "#1a1a1a" },
      { r: 3, c: 2, fill: "#1a1a1a" },
      { r: 3, c: 3, fill: "#1a1a1a" },
      { r: 3, c: 4, fill: "#1a1a1a", corrupted: true },
      { r: 3, c: 5, fill: "#1a1a1a" },
      { r: 4, c: 0, fill: "#1a1a1a" },
      { r: 4, c: 1, fill: "#4fd1c5", corrupted: true },
      { r: 4, c: 2, fill: "#4fd1c5" },
      { r: 4, c: 3, fill: "#4fd1c5", corrupted: true },
      { r: 4, c: 4, fill: "#1a1a1a" },
      { r: 4, c: 5, fill: "#1a1a1a" },
      { r: 5, c: 0, fill: "#1a1a1a" },
      { r: 5, c: 1, fill: "#1a1a1a" },
      { r: 5, c: 2, fill: "#1a1a1a" },
      { r: 5, c: 3, fill: "#1a1a1a", corrupted: true },
      { r: 5, c: 4, fill: "#1a1a1a" },
      { r: 5, c: 5, fill: "#1a1a1a" }
    ]
  }
];

export class SpriteRepairWorkshop {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.grid = document.getElementById("repair-grid");
    this.counterEl = document.getElementById("repair-counter");
    this.stampSlot = document.getElementById("repair-stamp-slot");
    this.resetBtn = document.getElementById("repair-reset-btn");
    this.statusTag = document.getElementById("repair-status-tag");
    this.fileTitleEl = document.getElementById("repair-file-title");
    this.benchCopyEl = document.getElementById("repair-bench-copy");
    this.heroDot = document.getElementById("dot-svg-hero");

    this.currentFileIndex = 0;
    this.fileStates = [
      { repairedIndices: new Set(), completed: false },
      { repairedIndices: new Set(), completed: false },
      { repairedIndices: new Set(), completed: false }
    ];

    this.tabButtons = [
      document.getElementById("tab-file-0"),
      document.getElementById("tab-file-1"),
      document.getElementById("tab-file-2")
    ];
  }

  init() {
    if (!this.grid) return;

    this.tabButtons.forEach((btn, idx) => {
      if (btn) {
        btn.addEventListener("click", () => {
          if (this.currentFileIndex !== idx) {
            if (this.audioEngine) this.audioEngine.playSoothingKalimba();
            this.loadFile(idx);
          }
        });
      }
    });

    if (this.resetBtn) {
      this.resetBtn.addEventListener("click", () => {
        if (this.audioEngine) this.audioEngine.playDewdrop();
        this.resetCurrentFile();
      });
    }

    this.loadFile(0);
  }

  loadFile(fileIdx) {
    this.currentFileIndex = fileIdx;
    const file = REPAIR_FILES[fileIdx];
    const state = this.fileStates[fileIdx];

    this.tabButtons.forEach((btn, idx) => {
      if (btn) {
        const isCurrent = idx === fileIdx;
        btn.classList.toggle("active", isCurrent);
        btn.setAttribute("aria-selected", isCurrent ? "true" : "false");
      }
    });

    if (this.fileTitleEl) this.fileTitleEl.textContent = file.title;
    if (this.benchCopyEl) this.benchCopyEl.textContent = file.copy;

    this.renderGrid(file, state);
    this.updateCounter(file, state);
    this.updateStampSlot(file, state);
  }

  renderGrid(file, state) {
    if (!this.grid) return;
    this.grid.innerHTML = "";

    file.cells.forEach((cellData, cellIdx) => {
      const cell = document.createElement("div");
      cell.className = "px-cell";
      cell.setAttribute("data-r", cellData.r);
      cell.setAttribute("data-c", cellData.c);
      cell.setAttribute("data-idx", cellIdx);

      if (cellData.fill === "transparent") {
        cell.classList.add("empty");
        cell.style.backgroundColor = "transparent";
        cell.style.borderColor = "rgba(26,26,26,0.06)";
        cell.setAttribute("aria-hidden", "true");
      } else if (!cellData.corrupted) {
        cell.classList.add("restored");
        cell.style.backgroundColor = cellData.fill;
        cell.setAttribute("role", "gridcell");
        cell.setAttribute(
          "aria-label",
          `Row ${cellData.r + 1}, Column ${cellData.c + 1}: Intact pixel`
        );
      } else {
        const isRepaired = state.repairedIndices.has(cellIdx);
        if (isRepaired) {
          cell.classList.add("restored");
          cell.style.backgroundColor = cellData.fill;
          cell.setAttribute("role", "button");
          cell.setAttribute("aria-pressed", "true");
          cell.setAttribute(
            "aria-label",
            `Row ${cellData.r + 1}, Column ${cellData.c + 1}: Restored pixel`
          );
        } else {
          cell.classList.add("corrupted");
          cell.style.backgroundColor = cellData.fill;
          cell.style.opacity = "0.3";
          cell.style.filter = "grayscale(1)";
          cell.textContent = "";
          cell.setAttribute("role", "button");
          cell.setAttribute("tabindex", "0");
          cell.setAttribute("aria-pressed", "false");
          cell.setAttribute(
            "aria-label",
            `Row ${cellData.r + 1}, Column ${cellData.c + 1}: Missing pixel, click to restore`
          );

          cell.addEventListener("click", () => {
            this.restoreCell(cell, cellIdx, cellData);
          });

          cell.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              this.restoreCell(cell, cellIdx, cellData);
            }
          });
        }
      }

      this.grid.appendChild(cell);
    });
  }

  restoreCell(cell, cellIdx, cellData) {
    if (!cell.classList.contains("corrupted")) return;

    const state = this.fileStates[this.currentFileIndex];
    const file = REPAIR_FILES[this.currentFileIndex];

    cell.classList.remove("corrupted");
    cell.classList.add("restored", "just-restored");
    cell.style.backgroundColor = cellData.fill;
    cell.style.opacity = "1";
    cell.style.filter = "none";
    cell.textContent = "";
    cell.setAttribute("aria-pressed", "true");
    cell.setAttribute(
      "aria-label",
      `Row ${cellData.r + 1}, Column ${cellData.c + 1}: Restored pixel`
    );

    setTimeout(() => {
      cell.classList.remove("just-restored");
    }, 300);

    state.repairedIndices.add(cellIdx);
    const repairedCount = state.repairedIndices.size;

    if (this.audioEngine) {
      this.audioEngine.playPixelRepair(repairedCount);
    }

    this.updateCounter(file, state);

    if (repairedCount >= file.damagedCount) {
      this.onFileCompleted(file, state);
    }
  }

  updateCounter(file, state) {
    const count = state.repairedIndices.size;
    const total = file.damagedCount;

    if (this.counterEl) {
      this.counterEl.innerHTML = `REPAIRED: <strong>${count}</strong> / ${total} PIXELS`;
    }

    if (this.statusTag) {
      if (count >= total) {
        this.statusTag.textContent = "RESTORED!";
        this.statusTag.classList.add("restored");
      } else {
        const remaining = total - count;
        this.statusTag.textContent = `${remaining} PIXEL${remaining === 1 ? "" : "S"} CORRUPTED`;
        this.statusTag.classList.remove("restored");
      }
    }
  }

  onFileCompleted(file, state) {
    state.completed = true;

    const currentTab = this.tabButtons[this.currentFileIndex];
    if (currentTab) {
      currentTab.classList.add("restored-tab");
      currentTab.textContent = `${file.tabShort} ✓`;
    }

    if (this.audioEngine) {
      this.audioEngine.playRestorationFanfare();
    }

    const repairCard = document.getElementById("project-repair");
    if (repairCard) {
      const rect = repairCard.getBoundingClientRect();
      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;
      try {
        if (typeof confetti === "function") {
          confetti({
            particleCount: 40,
            spread: 55,
            origin: { x: Math.max(0.1, Math.min(0.9, originX)), y: Math.max(0.1, Math.min(0.9, originY)) },
            shapes: ["square"],
            colors: ["#a34063", "#f2c94c", "#7ca982"],
            disableForReducedMotion: true
          });
        }
      } catch (e) {}
    }

    if (this.heroDot) {
      this.heroDot.style.transition = "transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      this.heroDot.style.transform = "scale(1.1) translateY(-4px)";
      setTimeout(() => {
        if (this.heroDot) this.heroDot.style.transform = "none";
      }, 400);
    }

    const dioramaSpeech = document.getElementById("diorama-speech-text");
    const moodPill = document.getElementById("hero-mood-pill");
    if (dioramaSpeech) {
      dioramaSpeech.textContent = `“We saved ${file.title.split("//")[0].trim()}! Another lost frame lives!”`;
    }
    if (moodPill) {
      moodPill.textContent = "[ STATUS: LEVEL RESTORED! ]";
    }

    this.updateStampSlot(file, state);
  }

  updateStampSlot(file, state) {
    if (!this.stampSlot) return;

    if (state.completed) {
      const nextIndex = (this.currentFileIndex + 1) % REPAIR_FILES.length;
      const nextFile = REPAIR_FILES[nextIndex];
      const allDone = this.fileStates.every((s) => s.completed);

      const nextLabel = allDone
        ? `Cycle: ${nextFile.tabShort} &rarr;`
        : `Next: ${nextFile.tabShort} &rarr;`;

      this.stampSlot.innerHTML = `
        <button id="repair-load-next-btn" class="repair-next-btn" type="button" aria-label="Load next sprite file in queue">
          <span>${nextLabel}</span>
        </button>
      `;

      const nextBtn = document.getElementById("repair-load-next-btn");
      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          if (this.audioEngine) this.audioEngine.playSoothingKalimba();
          this.loadFile(nextIndex);
        });
      }
    } else {
      this.stampSlot.innerHTML = "";
    }
  }

  resetCurrentFile() {
    const state = this.fileStates[this.currentFileIndex];
    const file = REPAIR_FILES[this.currentFileIndex];

    state.repairedIndices.clear();
    state.completed = false;

    const currentTab = this.tabButtons[this.currentFileIndex];
    if (currentTab) {
      currentTab.classList.remove("restored-tab");
      currentTab.textContent = file.tabLabel;
    }

    this.renderGrid(file, state);
    this.updateCounter(file, state);
    this.updateStampSlot(file, state);
  }
}

// ---------------------------------------------------------------------------
// 4. THE LOST LEVELS MAP
// ---------------------------------------------------------------------------
export const LOST_LEVEL_MARKERS = {
  bridge: {
    title: "SECTOR 01 // THE BRIDGE",
    reason: "Collision mask was never finished. You just fall through into the void."
  },
  rain: {
    title: "SECTOR 02 // RAIN CLOUD",
    reason: "The particle effects caused the 1997 servers to catch fire."
  },
  attic: {
    title: "SECTOR 03 // ATTIC WINDOW",
    reason: "Too many spiders. The animator quit."
  },
  boss: {
    title: "SECTOR 04 // BOSS CASTLE",
    reason: "The boss was just a giant, untextured red cube. We ran out of time."
  },
  save: {
    title: "SECTOR 05 // SAVE POINT",
    reason: "The save function deleted your game instead. We hid it."
  }
};

export class LostLevelsMapManager {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.mapMount = document.getElementById("lost-levels-map-mount");
    this.titleEl = document.getElementById("sticky-location-title");
    this.reasonEl = document.getElementById("sticky-cancellation-reason");
    this.markers = [];
  }

  init() {
    if (!this.mapMount || !this.titleEl || !this.reasonEl) return;

    this.markers = this.mapMount.querySelectorAll(".pixel-map-marker");
    this.markers.forEach((marker) => {
      marker.addEventListener("click", () => {
        const key = marker.getAttribute("data-marker");
        this.selectMarker(key, marker);
      });
      marker.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const key = marker.getAttribute("data-marker");
          this.selectMarker(key, marker);
        }
      });
    });
  }

  selectMarker(key, activeBtn) {
    const data = LOST_LEVEL_MARKERS[key];
    if (!data) return;

    if (this.audioEngine) {
      this.audioEngine.playMapBlip();
    }

    this.markers.forEach((m) => m.classList.remove("active"));
    if (activeBtn) {
      activeBtn.classList.add("active");
    }

    if (this.titleEl) {
      this.titleEl.textContent = data.title;
    }
    if (this.reasonEl) {
      this.reasonEl.textContent = `\u201C${data.reason}\u201D`;
    }
  }
}

// ---------------------------------------------------------------------------
// 5. PAINT BUCKET CURSOR & CHIMES MANAGER
// ---------------------------------------------------------------------------
export class PaintBucketManager {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.colors = ["berry", "gold", "sage", "reset"];
  }

  init() {
    const paintableElements = document.querySelectorAll(".paintable");
    paintableElements.forEach((el) => {
      let colorIndex = -1;

      el.addEventListener("click", (e) => {
        if (
          e.target.closest("button") ||
          e.target.closest("a") ||
          e.target.closest("input") ||
          e.target.closest(".px-cell") ||
          e.target.closest(".map-node") ||
          e.target.closest(".map-index-btn") ||
          e.target.closest(".jukebox-soft-key") ||
          e.target.closest(".jukebox-stop-pill") ||
          e.target.closest(".repair-tab-pill")
        ) {
          return;
        }

        colorIndex = (colorIndex + 1) % this.colors.length;
        const color = this.colors[colorIndex];

        el.classList.remove("painted-berry", "painted-gold", "painted-sage");
        if (color !== "reset") {
          el.classList.add(`painted-${color}`);
        }

        if (this.audioEngine) {
          this.audioEngine.playChime(520, "sine", 0.12);
        }
      });
    });
  }
}

// ---------------------------------------------------------------------------
// 6. CHIPTUNE JUKEBOX
// ---------------------------------------------------------------------------
export const JUKEBOX_TRACKS = [
  {
    num: "01",
    file: "01_loading_screen.wav",
    title: "Loading Screen (0:08)",
    duration: 8
  },
  {
    num: "02",
    file: "02_boss_that_never_was.mod",
    title: "Boss That Never Was (0:10)",
    duration: 10
  },
  {
    num: "03",
    file: "03_credits_from_another_ending.mid",
    title: "Credits From Another Ending (0:12)",
    duration: 12
  }
];

export const OSCILLOSCOPE_FRAMES = [
  "[||·|·||·]",
  "[·||·||·|]",
  "[|·||·||·]",
  "[||||·||·]",
  "[·|·||·||]",
  "[||··||··]",
  "[·||||··|]"
];

export class ChiptuneJukeboxManager {
  constructor(soundMaster, audioEngine) {
    this.soundMaster = soundMaster;
    this.audioEngine = audioEngine;
    this.displayLine = document.getElementById("jukebox-display-line");
    this.oscilloscope = document.getElementById("jukebox-oscilloscope");
    this.statusLine = document.getElementById("jukebox-status-line");
    this.stopBtn = document.getElementById("juke-stop");
    this.trackBtns = [
      document.getElementById("juke-track-1"),
      document.getElementById("juke-track-2"),
      document.getElementById("juke-track-3")
    ];

    this.currentTrackIndex = -1;
    this.tickerInterval = null;
    this.frameIndex = 0;
  }

  init() {
    this.trackBtns.forEach((btn, idx) => {
      if (!btn) return;
      btn.addEventListener("click", () => {
        this.playTrack(idx);
      });
    });

    if (this.stopBtn) {
      this.stopBtn.addEventListener("click", () => {
        this.stopPlayback(true);
      });
    }

    const heroPlayBtn = document.getElementById("hero-play-chiptune-btn");
    if (heroPlayBtn) {
      heroPlayBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const jukeboxEl = document.getElementById("project-jukebox");
        if (jukeboxEl) {
          jukeboxEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        if (this.currentTrackIndex === -1) {
          this.playTrack(0);
        } else {
          const nextIdx = (this.currentTrackIndex + 1) % JUKEBOX_TRACKS.length;
          this.playTrack(nextIdx);
        }
      });
    }

    const cardPlayBtn = document.getElementById("card-play-chiptune-btn");
    if (cardPlayBtn) {
      cardPlayBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (this.currentTrackIndex === -1) {
          this.playTrack(0);
        } else {
          const nextIdx = (this.currentTrackIndex + 1) % JUKEBOX_TRACKS.length;
          this.playTrack(nextIdx);
        }
      });
    }

    if (this.soundMaster) {
      this.soundMaster.onMuteChange((isMuted) => {
        if (this.currentTrackIndex !== -1) {
          if (isMuted) {
            if (this.audioEngine) this.audioEngine.stopAll();
            if (this.statusLine) {
              this.statusLine.textContent =
                "// NOTE: Master sound muted. Click [SOUND: OFF] in top header to re-enable.";
            }
          } else {
            const track = JUKEBOX_TRACKS[this.currentTrackIndex];
            if (this.statusLine) {
              this.statusLine.textContent =
                `// PLAYING: ${track.file} [Web Audio 8-bit synth active]`;
            }
            if (this.audioEngine) {
              this.audioEngine.playJukeboxTrack(this.currentTrackIndex, track.duration, () => {
                this.onTrackFinished();
              });
            }
          }
        }
      });
    }
  }

  playTrack(index) {
    if (index < 0 || index >= JUKEBOX_TRACKS.length) return;
    this.stopPlayback(false);

    this.currentTrackIndex = index;
    const track = JUKEBOX_TRACKS[index];

    if (this.audioEngine) {
      this.audioEngine.ensureContext();
      if (this.audioEngine.isMuted) {
        this.audioEngine.setMuted(false, false);
      }
    }

    if (this.soundMaster && this.soundMaster.isMuted) {
      this.soundMaster.isMuted = false;
      if (this.soundMaster.toggleBtn) {
        this.soundMaster.toggleBtn.classList.add("active");
        this.soundMaster.toggleBtn.setAttribute("aria-pressed", "true");
        const label = this.soundMaster.toggleBtn?.querySelector(".sound-label");
        if (label) label.textContent = "SOUND ON";
      }
    }

    this.trackBtns.forEach((btn, idx) => {
      if (btn) {
        const isActive = idx === index;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-pressed", isActive.toString());
      }
    });

    if (this.displayLine) {
      this.displayLine.textContent = `PLAYING: [${track.num}] ${track.file}`;
    }

    this.frameIndex = 0;
    if (this.oscilloscope) {
      this.oscilloscope.textContent = OSCILLOSCOPE_FRAMES[0];
    }
    this.tickerInterval = setInterval(() => {
      this.frameIndex = (this.frameIndex + 1) % OSCILLOSCOPE_FRAMES.length;
      if (this.oscilloscope) {
        this.oscilloscope.textContent = OSCILLOSCOPE_FRAMES[this.frameIndex];
      }
    }, 180);

    if (this.statusLine) {
      this.statusLine.textContent = `// PLAYING: ${track.file} [Web Audio 8-bit synth active]`;
    }

    if (this.audioEngine) {
      this.audioEngine.playJukeboxTrack(index, track.duration, () => {
        this.onTrackFinished();
      });
    }
  }

  stopPlayback(userTriggered) {
    if (this.tickerInterval) {
      clearInterval(this.tickerInterval);
      this.tickerInterval = null;
    }

    if (this.audioEngine) {
      this.audioEngine.stopAll();
    }
    this.currentTrackIndex = -1;

    this.trackBtns.forEach((btn) => {
      if (btn) {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      }
    });

    if (this.oscilloscope) {
      this.oscilloscope.textContent = "[--------]";
    }

    if (userTriggered) {
      if (this.displayLine) {
        this.displayLine.textContent = "STOPPED // STANDBY";
      }
      if (this.statusLine) {
        this.statusLine.textContent = "// Playback stopped. Deck ready.";
      }
    }
  }

  onTrackFinished() {
    this.stopPlayback(false);
    if (this.displayLine) {
      this.displayLine.textContent = "TAPE END // REWOUND";
    }
    if (this.statusLine) {
      this.statusLine.textContent = "// Track complete. Standby for next tape.";
    }
  }
}

// ---------------------------------------------------------------------------
// 7. DOT POINTER REACTION, DIORAMA PROPS & EYE-TRACKING
// ---------------------------------------------------------------------------
export const FLOPPY_QUOTES = [
  "“Found a 1998 save file! Still warm. Beep!”",
  "“Sector 97 sector scan complete: 0 bad sectors, 1 happy Dot.”",
  "“Whoa, this 3.5\" disk has a deleted secret boss fight inside!”"
];

export const COCOA_QUOTES = [
  "“Careful, the steam is only 4 pixels tall!”",
  "“Pixel cocoa keeps my stray crumbs from falling off!”",
  "“Mmm, tastes like 8-bit cinnamon and warm scanlines.”"
];

export const MOON_QUOTES = [
  "“Pixel #14,000 reporting for duty!”",
  "“The corner of the moon is still shining in Sector 88.”",
  "“I polished the crescent edge! No jagged pixels today.”"
];

export const BEEP_QUOTES = [
  "“Beep! That felt like 440Hz right through my pixels!”",
  "“Beep is short for: 'Thank you for keeping old games alive!'”",
  "“Beep-boop! My frame rate just hit a smooth 60fps.”"
];

export const TAP_QUOTES = [
  "“Hi! Did you bring any broken sprites? Beep.”",
  "“Tickled right on my chipped corner!”",
  "“Beep! Ready to restore another frame!”"
];

export class DotPointerReactionManager {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.heroDot = document.getElementById("dot-svg-hero");
    this.dotMount = document.getElementById("dot-hero-canvas-mount");
    this.dotEyes = document.getElementById("dot-eyes-container");
    this.reactionLabel = document.getElementById("dot-reaction-label");

    this.makeDotBeepBtn = document.getElementById("make-dot-beep-btn");
    this.propFloppyBtn = document.getElementById("prop-floppy-btn");
    this.propCocoaBtn = document.getElementById("prop-cocoa-btn");
    this.propMoonBtn = document.getElementById("prop-moon-btn");
    this.speechTextEl = document.getElementById("diorama-speech-text");
    this.heroMoodPill = document.getElementById("hero-mood-pill");
    this.dotCheeks = document.querySelectorAll(".dot-cheeks");

    this.rafPending = false;
    this.targetShiftX = 0;
    this.targetShiftY = 0;
    this.isBlinking = false;
    this.labelTimeout = null;
    this.floppyIndex = 0;
    this.cocoaIndex = 0;
    this.moonIndex = 0;
    this.beepIndex = 0;
    this.tapIndex = 0;
  }

  init() {
    if (!this.heroDot || !this.dotEyes) return;

    const handleTap = (e) => {
      if (e.type === "touchstart") e.preventDefault();
      this.triggerTapReaction(true);
    };

    this.heroDot.addEventListener("click", handleTap);
    this.heroDot.addEventListener("touchstart", handleTap, { passive: false });

    if (this.dotMount) {
      this.dotMount.addEventListener("click", (e) => {
        if (e.target === this.dotMount) {
          this.triggerTapReaction(true);
        }
      });
    }

    if (this.makeDotBeepBtn) {
      this.makeDotBeepBtn.addEventListener("click", () => {
        const quote = BEEP_QUOTES[this.beepIndex % BEEP_QUOTES.length];
        this.beepIndex++;
        this.setSpeech(quote);
        this.setMood("[ STATUS: BEEPING JOYFULLY ]");
        this.triggerTapReaction(false);
      });
    }

    if (this.propFloppyBtn) {
      this.propFloppyBtn.addEventListener("click", () => {
        if (this.audioEngine) this.audioEngine.playMapBlip();
        const quote = FLOPPY_QUOTES[this.floppyIndex % FLOPPY_QUOTES.length];
        this.floppyIndex++;
        this.setSpeech(quote);
        this.setMood("[ STATUS: READING SECTOR 97 ]");
        this.quickBlink();
      });
    }

    if (this.propCocoaBtn) {
      this.propCocoaBtn.addEventListener("click", () => {
        if (this.audioEngine) this.audioEngine.playMapBlip();
        const quote = COCOA_QUOTES[this.cocoaIndex % COCOA_QUOTES.length];
        this.cocoaIndex++;
        this.setSpeech(quote);
        this.setMood("[ STATUS: SIPPING PIXEL COCOA ]");
        this.blushReaction();
        this.quickBlink();
      });
    }

    if (this.propMoonBtn) {
      this.propMoonBtn.addEventListener("click", () => {
        if (this.audioEngine) this.audioEngine.playMapBlip();
        const quote = MOON_QUOTES[this.moonIndex % MOON_QUOTES.length];
        this.moonIndex++;
        this.setSpeech(quote);
        this.setMood("[ STATUS: MOON COMPASS ALIGNED ]");
        this.cyanPulseReaction();
        this.quickBlink();
      });
    }

    if (this.heroMoodPill) {
      this.heroMoodPill.addEventListener("click", () => {
        if (this.audioEngine) this.audioEngine.playMapBlip();
        this.setMood("[ STATUS: ALL SPRITES WELCOME ]");
        this.setSpeech("“I never turn down a missing pixel. Every frame has a story!”");
        this.quickBlink();
      });
    }

    this.isTouchOrReducedMotion = window.matchMedia(
      "(pointer: coarse), (prefers-reduced-motion: reduce)"
    ).matches;

    if (!this.isTouchOrReducedMotion) {
      this.setupEyeTracking();
    }
  }

  setSpeech(text) {
    if (this.speechTextEl) {
      this.speechTextEl.textContent = text;
      this.speechTextEl.classList.remove("speech-pop");
      void this.speechTextEl.offsetWidth;
      this.speechTextEl.classList.add("speech-pop");
    }
  }

  setMood(statusText) {
    if (this.heroMoodPill) {
      this.heroMoodPill.textContent = statusText;
    }
  }

  blushReaction() {
    this.dotCheeks.forEach((cheek) => {
      cheek.classList.remove("blushing");
      void cheek.offsetWidth;
      cheek.classList.add("blushing");
      setTimeout(() => cheek.classList.remove("blushing"), 800);
    });
  }

  cyanPulseReaction() {
    if (this.heroDot) {
      this.heroDot.classList.remove("cyan-pulse");
      void this.heroDot.offsetWidth;
      this.heroDot.classList.add("cyan-pulse");
      setTimeout(() => {
        if (this.heroDot) this.heroDot.classList.remove("cyan-pulse");
      }, 700);
    }
  }

  quickBlink() {
    if (this.isBlinking) return;
    this.isBlinking = true;
    if (this.dotEyes) {
      this.dotEyes.style.transform = "translate(0, 0)";
      this.dotEyes.classList.add("blinking");
    }
    setTimeout(() => {
      if (this.dotEyes) {
        this.dotEyes.classList.remove("blinking");
        this.dotEyes.style.transform = "translate(0, 0)";
      }
      this.isBlinking = false;
    }, 150);
  }

  setupEyeTracking() {
    window.addEventListener("mousemove", (e) => {
      if (this.isBlinking) return;

      const rect = this.heroDot.getBoundingClientRect();
      const dotCenterX = rect.left + rect.width / 2;
      const dotCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - dotCenterX;
      const dy = e.clientY - dotCenterY;
      const dist = Math.hypot(dx, dy);

      const angle = Math.atan2(dy, dx);
      const maxShift = 2;
      const shift = dist < 5 ? 0 : Math.min(dist / 160, 1) * maxShift;

      this.targetShiftX = Math.round(Math.cos(angle) * shift * 10) / 10;
      this.targetShiftY = Math.round(Math.sin(angle) * shift * 10) / 10;

      if (!this.rafPending) {
        this.rafPending = true;
        requestAnimationFrame(() => {
          this.rafPending = false;
          if (!this.isBlinking && this.dotEyes) {
            this.dotEyes.style.transform = `translate(${this.targetShiftX}px, ${this.targetShiftY}px)`;
          }
        });
      }
    });

    document.addEventListener("pointerleave", () => {
      if (!this.isBlinking && this.dotEyes) {
        this.dotEyes.style.transform = "translate(0, 0)";
      }
    });
  }

  triggerTapReaction(updateSpeech = true) {
    if (this.isBlinking) return;
    this.isBlinking = true;

    if (this.dotEyes) {
      this.dotEyes.style.transform = "translate(0, 0)";
      this.dotEyes.classList.add("blinking");
    }

    if (this.audioEngine) {
      this.audioEngine.playDotBeep();
    }

    if (updateSpeech) {
      const quote = TAP_QUOTES[this.tapIndex % TAP_QUOTES.length];
      this.tapIndex++;
      this.setSpeech(quote);
      this.setMood("[ STATUS: TICKLED & HAPPY ]");
    }

    if (this.reactionLabel) {
      this.reactionLabel.textContent = "[ beep! ]";
      this.reactionLabel.classList.add("active");

      if (this.labelTimeout) clearTimeout(this.labelTimeout);
      this.labelTimeout = setTimeout(() => {
        if (this.reactionLabel) {
          this.reactionLabel.classList.remove("active");
        }
      }, 1400);
    }

    setTimeout(() => {
      if (this.dotEyes) {
        this.dotEyes.classList.remove("blinking");
        this.dotEyes.style.transform = "translate(0, 0)";
      }
      this.isBlinking = false;
    }, 150);
  }
}

// ---------------------------------------------------------------------------
// 8. STRAY FALLING PIXEL CURSOR TRAIL
// ---------------------------------------------------------------------------
export class StrayPixelTrailManager {
  constructor() {
    this.container = document.getElementById("pixel-trail-container");
    this.toggle = document.getElementById("pixel-trail-toggle");
    this.toggleText = document.getElementById("trail-toggle-text");

    this.activePixels = [];
    this.maxPixels = 18;
    this.lastSpawnTime = 0;
    this.throttleMs = 65;
    this.lastX = -1;
    this.lastY = -1;

    this.canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    this.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.isEnabled = true;
  }

  init() {
    if (!this.canHover || this.prefersReducedMotion) {
      if (this.toggle) {
        this.toggle.checked = false;
        this.toggle.disabled = true;
        const wrapper = document.getElementById("trail-toggle-label");
        if (wrapper) wrapper.title = "Pixel trail disabled on touch/reduced-motion";
      }
      return;
    }

    try {
      const stored = localStorage.getItem("archive_pixel_trail_enabled_v1");
      if (stored !== null) {
        this.isEnabled = stored === "true";
      }
    } catch (e) {}

    if (this.toggle) {
      this.toggle.checked = this.isEnabled;
      this.updateToggleText();
      this.toggle.addEventListener("change", () => {
        this.isEnabled = this.toggle.checked;
        this.updateToggleText();
        try {
          localStorage.setItem("archive_pixel_trail_enabled_v1", this.isEnabled.toString());
        } catch (e) {}
        if (!this.isEnabled) {
          this.clearAll();
        }
      });
    }

    window.addEventListener("pointermove", (e) => {
      this.onPointerMove(e);
    });
  }

  updateToggleText() {
    if (this.toggleText) {
      this.toggleText.textContent = this.isEnabled ? "TRAIL ON" : "TRAIL OFF";
    }
  }

  onPointerMove(e) {
    if (!this.isEnabled || !this.container) return;

    const now = performance.now();
    if (now - this.lastSpawnTime < this.throttleMs) return;

    const moveDist = Math.hypot(e.clientX - this.lastX, e.clientY - this.lastY);
    if (moveDist < 3 && this.lastX !== -1) return;

    this.lastSpawnTime = now;
    this.lastX = e.clientX;
    this.lastY = e.clientY;

    this.spawnPixel(e.clientX, e.clientY);
  }

  spawnPixel(x, y) {
    while (this.activePixels.length >= this.maxPixels) {
      const oldPixel = this.activePixels.shift();
      if (oldPixel && oldPixel.parentNode) {
        oldPixel.remove();
      }
    }

    const pixel = document.createElement("div");
    pixel.className = "stray-pixel-node";
    const color = Math.random() > 0.4 ? "#4fd1c5" : "#ffb347";
    pixel.style.backgroundColor = color;
    pixel.style.left = `${x - 2}px`;
    pixel.style.top = `${y + 2}px`;

    this.container.appendChild(pixel);
    this.activePixels.push(pixel);

    setTimeout(() => {
      if (pixel.parentNode) {
        pixel.remove();
      }
      const idx = this.activePixels.indexOf(pixel);
      if (idx !== -1) {
        this.activePixels.splice(idx, 1);
      }
    }, 500);
  }

  clearAll() {
    this.activePixels.forEach((px) => {
      if (px && px.parentNode) {
        px.remove();
      }
    });
    this.activePixels = [];
  }
}

// ---------------------------------------------------------------------------
// 9. LOST LEVEL EASTER EGG MANAGER
// ---------------------------------------------------------------------------
export const LOST_LEVEL_STORAGE_KEY = "archive_lost_level_found_v1";
export const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a"
];

export class LostLevelEasterEggManager {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.overlay = document.getElementById("lost-level-modal-overlay");
    this.dialog = document.getElementById("lost-level-dialog");
    this.closeXBtn = document.getElementById("lost-level-close-x");
    this.dismissBtn = document.getElementById("lost-level-dismiss-btn");
    this.backdrop = document.getElementById("lost-level-backdrop");
    this.odometerContainer = document.getElementById("visitor-counter-container");
    this.topBadgeSlot = document.getElementById("top-lost-level-badge-slot");
    this.footerBadgeSlot = document.getElementById("footer-lost-level-badge-slot");

    this.konamiBuffer = [];
    this.tapTimestamps = [];
    this.isOpen = false;
    this.lastFocusedElement = null;
  }

  init() {
    if (this.hasBeenFound()) {
      this.renderBadges();
    }

    this.bindKeyboardTrigger();
    this.bindOdometerTrigger();
    this.bindModalCloseControls();
  }

  hasBeenFound() {
    try {
      return localStorage.getItem(LOST_LEVEL_STORAGE_KEY) === "true";
    } catch (e) {
      return false;
    }
  }

  saveFoundState() {
    try {
      localStorage.setItem(LOST_LEVEL_STORAGE_KEY, "true");
    } catch (e) {}
  }

  bindKeyboardTrigger() {
    window.addEventListener("keydown", (e) => {
      if (this.isOpen && e.key === "Escape") {
        e.preventDefault();
        this.close();
        return;
      }

      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.isContentEditable)
      ) {
        this.konamiBuffer = [];
        return;
      }

      let key = e.key;
      if (key.length === 1) {
        key = key.toLowerCase();
      }

      this.konamiBuffer.push(key);
      if (this.konamiBuffer.length > KONAMI_SEQUENCE.length) {
        this.konamiBuffer.shift();
      }

      if (this.konamiBuffer.length === KONAMI_SEQUENCE.length) {
        let isMatch = true;
        for (let i = 0; i < KONAMI_SEQUENCE.length; i++) {
          if (this.konamiBuffer[i] !== KONAMI_SEQUENCE[i]) {
            isMatch = false;
            break;
          }
        }
        if (isMatch) {
          this.konamiBuffer = [];
          this.reveal();
        }
      }
    });
  }

  bindOdometerTrigger() {
    if (!this.odometerContainer) return;

    const handleTap = (e) => {
      const now = Date.now();
      this.tapTimestamps.push(now);
      this.tapTimestamps = this.tapTimestamps.filter((t) => now - t <= 2500);

      if (this.audioEngine) {
        this.audioEngine.playChime(550, "square", 0.035);
      }

      if (this.tapTimestamps.length >= 5) {
        this.tapTimestamps = [];
        this.reveal();
      }
    };

    this.odometerContainer.addEventListener("click", handleTap);
    this.odometerContainer.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleTap(e);
      }
    });
  }

  bindModalCloseControls() {
    if (this.dismissBtn) {
      this.dismissBtn.addEventListener("click", () => {
        this.close();
      });
    }

    if (this.closeXBtn) {
      this.closeXBtn.addEventListener("click", () => {
        this.close();
      });
    }

    if (this.backdrop) {
      this.backdrop.addEventListener("click", () => {
        this.close();
      });
    }
  }

  reveal() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.lastFocusedElement = document.activeElement;

    this.saveFoundState();
    this.renderBadges();

    if (this.overlay) {
      this.overlay.removeAttribute("hidden");
      this.overlay.style.display = "flex";
    }

    if (this.audioEngine) {
      this.audioEngine.playLostLevelFanfare();
    }

    this.fireConfetti();

    if (this.dismissBtn) {
      this.dismissBtn.focus();
    } else if (this.dialog) {
      this.dialog.focus();
    }
  }

  close() {
    this.isOpen = false;

    if (this.overlay) {
      this.overlay.setAttribute("hidden", "");
      this.overlay.style.display = "none";
    }

    if (
      this.lastFocusedElement &&
      typeof this.lastFocusedElement.focus === "function"
    ) {
      try {
        this.lastFocusedElement.focus();
      } catch (e) {}
    }
  }

  renderBadges() {
    if (this.topBadgeSlot) {
      this.topBadgeSlot.innerHTML = `<svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><polygon points="8,1 10.2,5.8 15.3,6.5 11.6,10.1 12.5,15.2 8,12.8 3.5,15.2 4.4,10.1 0.7,6.5 5.8,5.8"/></svg><span>SECTOR 00</span>`;
      this.topBadgeSlot.style.display = "inline-flex";
      this.topBadgeSlot.title = "Secret Easter Egg: Sector 00 Restored";
    }

    if (this.footerBadgeSlot) {
      this.footerBadgeSlot.innerHTML = `<div class="lost-level-footer-badge">[ &#9733; LOST LEVEL RESTORED &bull; SECTOR 00 ARCHIVED ]</div>`;
      this.footerBadgeSlot.style.display = "block";
    }
  }

  fireConfetti() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    try {
      if (typeof confetti === "function") {
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.55 },
          shapes: ["square"],
          colors: ["#a34063", "#7ca982", "#f2c94c"],
          disableForReducedMotion: true
        });
      }
    } catch (e) {}
  }
}

// ---------------------------------------------------------------------------
// 10. VINTAGE VISITOR ODOMETER
// ---------------------------------------------------------------------------
export const ODOMETER_STORAGE_KEY = "archive_visitor_count_1997_v2";
export const BASE_VISITOR_COUNT = 122;

export class VisitorOdometerManager {
  constructor() {
    this.container = document.getElementById("visitor-counter-container");
    this.mount = document.getElementById("odometer-cells-mount");
    this.count = BASE_VISITOR_COUNT;
  }

  init() {
    if (!this.mount) return;

    this.incrementCount();
    this.render();

    if (this.container) {
      this.container.addEventListener("click", () => {
        this.incrementCount();
        this.render();
      });
    }
  }

  incrementCount() {
    try {
      const stored = localStorage.getItem(ODOMETER_STORAGE_KEY);
      if (stored !== null && !isNaN(parseInt(stored, 10))) {
        this.count = parseInt(stored, 10) + 1;
      } else {
        this.count = BASE_VISITOR_COUNT + 1;
      }
      localStorage.setItem(ODOMETER_STORAGE_KEY, this.count.toString());
    } catch (e) {
      this.count = BASE_VISITOR_COUNT + 1;
    }
  }

  render() {
    const formatted = String(this.count).padStart(7, "0");
    this.mount.innerHTML = "";

    for (const char of formatted) {
      const cell = document.createElement("span");
      cell.className = "odometer-drum-cell odometer-cell";
      cell.textContent = char;
      this.mount.appendChild(cell);
    }

    if (this.container) {
      this.container.setAttribute(
        "aria-label",
        `Archive visitor counter: ${formatted}. Tap 5 times to reveal the lost level`
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 11. VISITOR MEMORY MANAGER (HERO SAVE FILE HOOK)
// ---------------------------------------------------------------------------
export class VisitorMemoryManager {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.welcomeTextEl = document.getElementById("hero-welcome-text");
    this.containerEl = document.getElementById("visitor-memory-container");
    this.storageKey = "dotVisitorName";
  }

  init() {
    if (!this.containerEl) return;
    this.render();
  }

  render() {
    const savedName = this.getSavedName();

    if (savedName) {
      if (this.welcomeTextEl) {
        this.welcomeTextEl.textContent = `Welcome back, ${savedName}. I kept your save file safe. I'm an 8-bit pixel. I live in the recycle bin. I put broken game sprites back together.`;
      }

      this.containerEl.innerHTML = `
        <div class="visitor-welcome-pill" role="status">
          <span class="pill-label">&#9632; SAVE FILE ACTIVE: <strong>${this.escape(savedName)}</strong></span>
          <button type="button" class="visitor-reset-link" id="visitor-forget-btn" aria-label="Change visitor name">[Change]</button>
        </div>
      `;

      const resetBtn = document.getElementById("visitor-forget-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          try {
            localStorage.removeItem(this.storageKey);
          } catch (e) {}
          this.render();
        });
      }
    } else {
      if (this.welcomeTextEl) {
        this.welcomeTextEl.textContent =
          "I'm an 8-bit pixel. I live in the recycle bin. I put broken game sprites back together.";
      }

      this.containerEl.innerHTML = `
        <form id="visitor-name-form" class="visitor-name-form" autocomplete="off">
          <label for="visitor-name-input" class="visitor-form-label">WHAT SHOULD I CALL YOU?</label>
          <div class="visitor-form-row">
            <input
              type="text"
              id="visitor-name-input"
              class="visitor-name-input"
              placeholder="Your name or callsign..."
              maxlength="24"
              required
            />
            <button type="submit" class="btn btn--primary visitor-save-btn">Save</button>
          </div>
        </form>
      `;

      const form = document.getElementById("visitor-name-form");
      const input = document.getElementById("visitor-name-input");

      if (form && input) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const name = input.value.trim();
          if (name) {
            try {
              localStorage.setItem(this.storageKey, name.slice(0, 24));
            } catch (err) {}

            if (this.audioEngine) {
              this.audioEngine.playChime(659, "sine", 0.12);
            }

            this.render();
          }
        });
      }
    }
  }

  getSavedName() {
    try {
      return localStorage.getItem(this.storageKey) || "";
    } catch (e) {
      return "";
    }
  }

  escape(str) {
    const p = document.createElement("p");
    p.textContent = str;
    return p.innerHTML;
  }
}

// ---------------------------------------------------------------------------
// 12. LIVE DREAM GUESTBOOK (ZERO BACKEND // LOCALSTORAGE FALLBACK)
// ---------------------------------------------------------------------------
export class LiveDreamGuestbookManager {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.form = document.getElementById("guestbook-form");
    this.handleInput = document.getElementById("guestbook-handle");
    this.wishInput = document.getElementById("guestbook-wish");
    this.statusEl = document.getElementById("guestbook-status");
    this.feedEl = document.getElementById("guestbook-feed");
    this.storageKey = "dot_live_guestbook_wishes_v2";
    this.wishes = [];
  }

  init() {
    if (!this.form || !this.feedEl) return;

    this.loadWishes();
    this.renderFeed();
    this.bindEvents();
  }

  loadWishes() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        this.wishes = JSON.parse(raw);
        if (!Array.isArray(this.wishes)) this.wishes = [];
      }
    } catch (e) {
      this.wishes = [];
    }

    if (this.wishes.length === 0) {
      this.wishes = [
        {
          name: "Moth & Moon Lead (1997)",
          wish: "Thank you for keeping Frame 88 lit. Our moon was never meant to go dark.",
          time: "1997.10.18 // SECTOR 01"
        },
        {
          name: "Cassette_Lover",
          wish: "I hope all cancelled bridge levels lead to somewhere peaceful.",
          time: "2004.06.12 // SECTOR 02"
        },
        {
          name: "Ghost_Pixel",
          wish: "Dot is the bravest sprite restorer on the web. Keep your chipped corner proud!",
          time: "2026.10.18 // SECTOR 09"
        }
      ];
    }
  }

  saveWishes() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.wishes.slice(0, 50)));
    } catch (e) {}
  }

  bindEvents() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  handleSubmit() {
    const name = (this.handleInput ? this.handleInput.value : "").trim() || "Anonymous Restorer";
    const wish = (this.wishInput ? this.wishInput.value : "").trim();

    if (!wish) return;

    const newEntry = {
      name: name.slice(0, 32),
      wish: wish.slice(0, 140),
      time: "JUST NOW // LIVE TRANSMISSION"
    };

    // 1. Optimistic instant append
    this.renderSingleBubble(newEntry, true);

    // 2. Persist to rock-solid localStorage
    this.wishes.unshift(newEntry);
    this.saveWishes();

    if (this.audioEngine) {
      this.audioEngine.playChime(784, "square", 0.08);
      setTimeout(() => {
        if (this.audioEngine) this.audioEngine.playChime(1046, "square", 0.12);
      }, 90);
    }

    if (this.statusEl) {
      this.statusEl.style.color = "#4fd1c5";
      this.statusEl.textContent = "Wish stamped into the archive! Beep.";
      setTimeout(() => {
        if (this.statusEl) this.statusEl.textContent = "";
      }, 5000);
    }

    // Optional graceful background post (fails silently without errors if offline)
    try {
      const formData = new FormData(this.form);
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      }).catch(() => {});
    } catch (err) {}

    if (this.wishInput) this.wishInput.value = "";
    if (this.handleInput) this.handleInput.value = "";
  }

  renderFeed() {
    if (!this.feedEl) return;
    this.feedEl.innerHTML = "";
    this.wishes.forEach((entry) => {
      this.renderSingleBubble(entry, false);
    });
  }

  renderSingleBubble(entry, prepend = false) {
    if (!this.feedEl) return;

    const article = document.createElement("article");
    article.className = "guestbook-entry-bubble";

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.gap = "8px";

    const authorSpan = document.createElement("span");
    authorSpan.className = "entry-author";
    authorSpan.textContent = entry.name;

    const timeSpan = document.createElement("span");
    timeSpan.className = "entry-time";
    timeSpan.textContent = entry.time;

    header.appendChild(authorSpan);
    header.appendChild(timeSpan);

    const wishP = document.createElement("p");
    wishP.className = "entry-wish";
    wishP.textContent = `“${entry.wish}”`;

    article.appendChild(header);
    article.appendChild(wishP);

    if (prepend && this.feedEl.firstChild) {
      this.feedEl.insertBefore(article, this.feedEl.firstChild);
    } else {
      this.feedEl.appendChild(article);
    }
  }
}

// ---------------------------------------------------------------------------
// 13. RESPONSIVE CHAOS MODE MANAGER
// ---------------------------------------------------------------------------
export class ChaosModeManager {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.topToggle =
      document.getElementById("chaos-top-toggle") ||
      document.getElementById("chaos-mode-toggle-top");
    this.footerToggle =
      document.getElementById("chaos-mode-toggle") ||
      document.getElementById("chaos-mode-toggle-footer");
    this.tickerBanner = document.getElementById("chaos-ticker-banner");
    this.isActive = false;
    this.miniDots = [];
  }

  init() {
    if (this.topToggle) {
      this.topToggle.addEventListener("click", () => this.toggle());
    }
    if (this.footerToggle) {
      this.footerToggle.addEventListener("click", () => this.toggle());
    }
  }

  toggle() {
    this.isActive = !this.isActive;
    this.applyState();
  }

  applyState() {
    document.body.classList.toggle("chaos-mode-active", this.isActive);

    if (this.audioEngine) {
      if (this.isActive) {
        this.audioEngine.playChime(880, "square", 0.06);
        setTimeout(() => {
          if (this.audioEngine) {
            this.audioEngine.playChime(1175, "square", 0.10);
          }
        }, 70);
      } else {
        this.audioEngine.playChime(587, "square", 0.08);
      }
    }

    if (this.topToggle) {
      this.topToggle.setAttribute("aria-pressed", this.isActive.toString());
      this.topToggle.classList.toggle("active", this.isActive);
      const label = this.topToggle.querySelector(".chaos-label");
      if (label) {
        label.textContent = this.isActive ? "[★] CHAOS: ON" : "[!] CHAOS: OFF";
      }
    }

    if (this.footerToggle) {
      this.footerToggle.setAttribute("aria-pressed", this.isActive.toString());
      this.footerToggle.classList.toggle("active", this.isActive);
      const label = this.footerToggle.querySelector(".chaos-label");
      if (label) {
        label.textContent = this.isActive
          ? "[★] CHAOS MODE: [ACTIVE]"
          : "[!] CHAOS MODE: [STANDBY]";
      }
    }

    if (this.tickerBanner) {
      if (this.isActive) {
        this.tickerBanner.removeAttribute("hidden");
      } else {
        this.tickerBanner.setAttribute("hidden", "");
      }
    }

    if (this.isActive) {
      this.spawnMiniDots();
    } else {
      this.removeMiniDots();
    }
  }

  spawnMiniDots() {
    this.removeMiniDots();

    const targets = [
      { id: "dossier-card", label: "sneeze_01" },
      { id: "bench-repair", label: "sneeze_02" },
      { id: "bench-jukebox", label: "sneeze_03" }
    ];

    targets.forEach((t) => {
      const container = document.getElementById(t.id);
      if (!container) return;

      const miniDot = document.createElement("div");
      miniDot.className = "mini-dot-clone";
      miniDot.setAttribute("aria-hidden", "true");
      miniDot.innerHTML = `
        <span class="mini-dot-tag">[beep_${t.label}]</span>
        <svg width="22" height="22" viewBox="0 0 16 16" shape-rendering="crispEdges">
          <rect x="3" y="3" width="7" height="1" fill="#4fd1c5" />
          <rect x="3" y="4" width="8" height="1" fill="#4fd1c5" />
          <rect x="3" y="5" width="9" height="1" fill="#4fd1c5" />
          <rect x="3" y="6" width="10" height="7" fill="#4fd1c5" />
          <rect x="5" y="7" width="2" height="2" fill="#1a1a1a" />
          <rect x="9" y="7" width="2" height="2" fill="#1a1a1a" />
          <rect x="1" y="8" width="2" height="2" fill="#4fd1c5" />
          <rect x="13" y="8" width="2" height="2" fill="#4fd1c5" />
        </svg>
      `;
      container.style.position = "relative";
      container.appendChild(miniDot);
      this.miniDots.push(miniDot);
    });
  }

  removeMiniDots() {
    this.miniDots.forEach((dot) => {
      if (dot && dot.parentNode) {
        dot.remove();
      }
    });
    this.miniDots = [];
  }
}

// ---------------------------------------------------------------------------
// 14. DAY / 3:00 AM MIDNIGHT THEME MANAGER
// ---------------------------------------------------------------------------
export class ThemeModeManager {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.toggleBtn = document.getElementById("theme-mode-toggle");
    this.headerToggleBtn = document.getElementById("header-theme-toggle");
    this.isNight = false;
  }

  init() {
    try {
      const saved =
        localStorage.getItem("dotTheme") ||
        localStorage.getItem("archive_theme_night_v1");
      this.isNight = saved === "night" || saved === "true";
    } catch (e) {
      this.isNight = false;
    }

    this.applyTheme(false);

    const handleToggle = () => {
      this.isNight = !this.isNight;
      try {
        localStorage.setItem("dotTheme", this.isNight ? "night" : "day");
        localStorage.setItem("archive_theme_night_v1", this.isNight.toString());
      } catch (e) {}
      this.applyTheme(true);
    };

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", handleToggle);
    }
    if (this.headerToggleBtn) {
      this.headerToggleBtn.addEventListener("click", handleToggle);
    }
  }

  applyTheme(playSound = true) {
    if (this.isNight) {
      document.documentElement.setAttribute("data-theme", "night");
      document.body.classList.add("night-mode-active");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.body.classList.remove("night-mode-active");
    }

    if (this.toggleBtn) {
      this.toggleBtn.setAttribute("aria-pressed", this.isNight.toString());
      const icon = this.toggleBtn.querySelector(".theme-icon");
      const label = this.toggleBtn.querySelector(".theme-label");

      if (this.isNight) {
        if (icon) icon.innerHTML = "&#9728;";
        if (label) label.textContent = "DAY";
        this.toggleBtn.title = "Switch to Day Mode";
      } else {
        if (icon) icon.innerHTML = "&#9790;";
        if (label) label.textContent = "3:00 AM";
        this.toggleBtn.title = "Switch to Dream Mode";
      }
    }

    if (this.headerToggleBtn) {
      this.headerToggleBtn.setAttribute("aria-pressed", this.isNight.toString());
      this.headerToggleBtn.classList.toggle("active", this.isNight);
      const icon = this.headerToggleBtn.querySelector(".theme-icon");
      const label = this.headerToggleBtn.querySelector(".theme-label");

      if (this.isNight) {
        if (icon) icon.innerHTML = "&#9728;";
        if (label) label.textContent = "Day Mode";
        this.headerToggleBtn.title = "Switch to Day Mode";
      } else {
        if (icon) icon.innerHTML = "&#9790;";
        if (label) label.textContent = "Dream Mode";
        this.headerToggleBtn.title = "Switch to Dream Mode";
      }
    }

    if (playSound && this.audioEngine) {
      this.audioEngine.playDuskDawnHarp(this.isNight);
    }
  }
}

// ---------------------------------------------------------------------------
// 15. HEADER NAVIGATION & SCROLL SPY
// ---------------------------------------------------------------------------
export class HeaderNavManager {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.chips = document.querySelectorAll(".index-nav-chip");
    this.sections = [
      { id: "boot", navId: "nav-boot" },
      { id: "about", navId: "nav-about" },
      { id: "voxel-lab", navId: "nav-voxel" },
      { id: "projects", navId: "nav-projects" },
      { id: "story", navId: "nav-story" },
      { id: "guestbook-section", navId: "nav-guestbook" },
      { id: "footer", navId: "nav-footer" }
    ];
  }

  init() {
    this.setupClickFeedback();
    this.setupScrollSpy();
  }

  setupClickFeedback() {
    this.chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        this.chips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        if (this.audioEngine) {
          this.audioEngine.playSoothingKalimba();
        }
      });
    });
  }

  setupScrollSpy() {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = this.sections.find((s) => s.id === entry.target.id);
            if (match) {
              this.chips.forEach((chip) => {
                chip.classList.toggle("active", chip.id === match.navId);
              });
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0
      }
    );

    this.sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
  }
}

// ---------------------------------------------------------------------------
// 16. COZY ARCHIVAL TRINKETS
// ---------------------------------------------------------------------------
export class CuteArchivalTrinketsManager {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.starBtn = document.getElementById("give-star-btn");
    this.starBadge = document.getElementById("hero-star-badge");
    this.cheerBubble = document.getElementById("dot-cheer-bubble");
    this.cheerText = document.getElementById("dot-cheer-text");
    this.heroDotFloat = document.querySelector(".hero-mascot-float");
    this.heroCheeks = document.querySelectorAll("#dot-svg-hero .dot-cheeks");

    this.byteCat = document.getElementById("byte-cat-toy");
    this.bytePurrText = document.getElementById("byte-purr-text");
    this.bytePurrTimer = null;

    this.stickyNote = document.getElementById("desk-sticky-note");
    this.stickyProgress = document.getElementById("sticky-progress-text");
    this.stickyCheerStamp = document.getElementById("sticky-cheer-stamp");
    this.taskCheckboxes = {
      moon: document.getElementById("task-moon"),
      cat: document.getElementById("task-cat"),
      star: document.getElementById("task-star"),
      sneeze: document.getElementById("task-sneeze"),
    };

    this.starQuotes = [
      "Dot says: Beep! A star for me?",
      "Dot put it safely on his shelf.",
      "Dot's cheeks got warm and pink!",
      "Dot gave a tiny 8-bit spin!",
      "Dot says: You are my favorite visitor.",
      "Dot says: Beep! Best archive shift ever!"
    ];

    this.catQuotes = [
      "Purr... [Byte nudged your hand]",
      "Meow! [Byte loves warm floppy disks]",
      "Prrr... [Soft tail curl]",
      "Mew. [Byte purrs like a quiet CPU fan]"
    ];

    this.lastFairyDustTime = 0;
    this.lastFairyDustPos = { x: 0, y: 0 };
  }

  init() {
    this.initStarToy();
    this.initByteCat();
    this.initDeskStickyNote();
    this.initFairyDust();
  }

  initStarToy() {
    if (!this.starBtn) return;

    let savedStars = parseInt(localStorage.getItem("dot_stars_count") || "0", 10);
    if (this.starBadge) {
      this.starBadge.textContent = savedStars.toString();
    }
    if (savedStars > 0 && this.taskCheckboxes.star) {
      this.taskCheckboxes.star.checked = true;
    }

    this.starBtn.addEventListener("click", () => {
      savedStars += 1;
      localStorage.setItem("dot_stars_count", savedStars.toString());

      if (this.starBadge) {
        this.starBadge.textContent = savedStars.toString();
      }

      if (this.audioEngine) {
        this.audioEngine.playStarChime();
      }

      if (this.heroDotFloat) {
        this.heroDotFloat.classList.remove("excited");
        void this.heroDotFloat.offsetWidth;
        this.heroDotFloat.classList.add("excited");
      }

      if (this.heroCheeks && this.heroCheeks.length > 0) {
        this.heroCheeks.forEach((cheek) => {
          cheek.setAttribute("fill", "#FF4F81");
          cheek.setAttribute("opacity", "1");
        });
        setTimeout(() => {
          this.heroCheeks.forEach((cheek) => {
            cheek.setAttribute("fill", "#C96F8E");
            cheek.setAttribute("opacity", "0.8");
          });
        }, 1200);
      }

      this.spawnFloatingStars();

      if (this.cheerText) {
        const quote = this.starQuotes[(savedStars - 1) % this.starQuotes.length];
        this.cheerText.textContent = quote;
        if (this.cheerBubble) {
          this.cheerBubble.style.opacity = "1";
        }
      }

      this.setTaskComplete("star");
    });
  }

  spawnFloatingStars() {
    if (!this.starBtn) return;
    const rect = this.starBtn.getBoundingClientRect();
    const starChars = ["✦", "✧", "⋆", "★", "·"];

    for (let i = 0; i < 3; i++) {
      const star = document.createElement("span");
      star.className = "floating-sparkle-star";
      star.textContent = starChars[Math.floor(Math.random() * starChars.length)];
      star.style.left = `${rect.left + rect.width / 2 + (Math.random() * 30 - 15)}px`;
      star.style.top = `${rect.top - 5 + (Math.random() * 10 - 5)}px`;
      star.style.animationDelay = `${i * 90}ms`;
      document.body.appendChild(star);
      setTimeout(() => star.remove(), 750);
    }
  }

  initByteCat() {
    if (!this.byteCat) return;

    const petCat = () => {
      this.byteCat.classList.remove("purring");
      void this.byteCat.offsetWidth;
      this.byteCat.classList.add("purring");

      if (this.audioEngine) {
        this.audioEngine.playCatPurr();
      }

      if (this.bytePurrText) {
        const quote = this.catQuotes[Math.floor(Math.random() * this.catQuotes.length)];
        this.bytePurrText.textContent = quote;
      }

      if (this.bytePurrTimer) clearTimeout(this.bytePurrTimer);
      this.bytePurrTimer = setTimeout(() => {
        this.byteCat.classList.remove("purring");
      }, 2000);

      this.setTaskComplete("cat");
    };

    this.byteCat.addEventListener("click", petCat);
    this.byteCat.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        petCat();
      }
    });
  }

  initDeskStickyNote() {
    if (!this.stickyNote) return;

    const saved = localStorage.getItem("dot_desk_tasks");
    let state = { moon: true, cat: false, star: false, sneeze: false };
    if (saved) {
      try {
        state = { ...state, ...JSON.parse(saved) };
      } catch (e) {}
    }

    Object.keys(this.taskCheckboxes).forEach((key) => {
      const box = this.taskCheckboxes[key];
      if (box) {
        box.checked = !!state[key];
        box.addEventListener("change", () => {
          if (this.audioEngine) {
            this.audioEngine.playDewdrop();
          }
          this.updateStickyState();
        });
      }
    });

    this.updateStickyState(false);

    const dossierBtn = document.getElementById("dossier-portrait-btn");
    if (dossierBtn) {
      dossierBtn.addEventListener("click", () => {
        setTimeout(() => this.setTaskComplete("sneeze"), 400);
      });
    }

    const repairGrid = document.getElementById("sprite-repair-shop-mount");
    if (repairGrid) {
      repairGrid.addEventListener("click", () => {
        const tag = document.getElementById("repair-status-tag");
        if (tag && tag.classList.contains("restored")) {
          this.setTaskComplete("moon");
        }
      });
    }
  }

  setTaskComplete(key) {
    const box = this.taskCheckboxes[key];
    if (box && !box.checked) {
      box.checked = true;
      this.updateStickyState(true);
    }
  }

  updateStickyState(playSound = false) {
    let completedCount = 0;
    const total = Object.keys(this.taskCheckboxes).length;
    const state = {};

    Object.keys(this.taskCheckboxes).forEach((key) => {
      const box = this.taskCheckboxes[key];
      if (box) {
        state[key] = box.checked;
        if (box.checked) completedCount++;
      }
    });

    try {
      localStorage.setItem("dot_desk_tasks", JSON.stringify(state));
    } catch (e) {}

    if (this.stickyProgress) {
      this.stickyProgress.textContent = `${completedCount} of ${total} finished`;
    }

    if (this.stickyCheerStamp) {
      if (completedCount === total) {
        this.stickyCheerStamp.style.display = "inline-block";
        if (playSound && this.audioEngine) {
          this.audioEngine.playPressStartChime();
        }
      } else {
        this.stickyCheerStamp.style.display = "none";
      }
    }
  }

  initFairyDust() {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const symbols = ["✦", "✧", "⋆", "▪"];
    const colors = ["#C96F8E", "#4FD1C5", "#F2C94C", "#A8C3B0", "#F5D9E2"];

    window.addEventListener(
      "mousemove",
      (e) => {
        const now = performance.now();
        const dist = Math.hypot(
          e.clientX - this.lastFairyDustPos.x,
          e.clientY - this.lastFairyDustPos.y
        );

        if (now - this.lastFairyDustTime > 180 && dist > 55) {
          this.lastFairyDustTime = now;
          this.lastFairyDustPos = { x: e.clientX, y: e.clientY };

          const sparkle = document.createElement("span");
          sparkle.className = "fairy-pixel-dust";
          sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
          sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
          sparkle.style.left = `${e.clientX + (Math.random() * 12 - 6)}px`;
          sparkle.style.top = `${e.clientY + (Math.random() * 12 - 6)}px`;

          document.body.appendChild(sparkle);
          setTimeout(() => sparkle.remove(), 480);
        }
      },
      { passive: true }
    );
  }
}

// ---------------------------------------------------------------------------
// 17. CUSTOM CURSOR AURA & CLICK RIPPLE (Desktop Only)
// ---------------------------------------------------------------------------
export class CustomCursorAuraManager {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.aura = document.getElementById("cursor-aura");
    this.targetX = -100;
    this.targetY = -100;
    this.currentX = -100;
    this.currentY = -100;
    this.isHoveringInteractive = false;
    this.rafId = null;
  }

  init() {
    if (!this.aura) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    this.bindEvents();
    this.startLoop();
  }

  bindEvents() {
    window.addEventListener(
      "mousemove",
      (e) => {
        this.targetX = e.clientX;
        this.targetY = e.clientY;
        if (!this.aura.classList.contains("active")) {
          this.aura.classList.add("active");
          this.currentX = e.clientX;
          this.currentY = e.clientY;
        }

        const target = e.target;
        const interactive = target && target.closest(
          "button, a, input, select, textarea, label, [role='button'], [role='tab'], .clickable, .give-star-btn, .byte-cat-perch, .map-node, .repair-cell, .paintable, .chat-chip-btn, .index-nav-chip, .archive-control-pill, .map-index-btn, .jukebox-soft-key, .jukebox-stop-pill, .repair-tab-pill, .repair-next-btn, .repair-reset-btn, .physical-rocker-switch, .odometer-case-btn"
        );

        if (interactive && !this.isHoveringInteractive) {
          this.isHoveringInteractive = true;
          this.aura.classList.add("hovering");
          if (this.audioEngine) {
            this.audioEngine.playVelvetHoverTick();
          }
        } else if (!interactive && this.isHoveringInteractive) {
          this.isHoveringInteractive = false;
          this.aura.classList.remove("hovering");
        }
      },
      { passive: true }
    );

    window.addEventListener(
      "mousedown",
      () => {
        this.aura.classList.add("clicking");
      },
      { passive: true }
    );

    window.addEventListener(
      "mouseup",
      () => {
        this.aura.classList.remove("clicking");
      },
      { passive: true }
    );

    window.addEventListener(
      "click",
      (e) => {
        this.spawnClickRipple(e.clientX, e.clientY);
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", () => {
      this.aura.classList.remove("active");
    });

    document.addEventListener("mouseenter", () => {
      this.aura.classList.add("active");
    });
  }

  spawnClickRipple(x, y) {
    const ripple = document.createElement("div");
    ripple.className = "cursor-click-ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 400);
  }

  startLoop() {
    const update = () => {
      this.currentX += (this.targetX - this.currentX) * 0.22;
      this.currentY += (this.targetY - this.currentY) * 0.22;

      this.aura.style.left = `${this.currentX.toFixed(1)}px`;
      this.aura.style.top = `${this.currentY.toFixed(1)}px`;

      this.rafId = requestAnimationFrame(update);
    };
    this.rafId = requestAnimationFrame(update);
  }
}

// ---------------------------------------------------------------------------
// 18. TACTILE CARD WOBBLE & BEEP SPRAY (Aceternity Physics & Micro-animations)
// ---------------------------------------------------------------------------
export class CardWobbleManager {
  init() {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".wobble").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const { left, top, width, height } = card.getBoundingClientRect();
          const x = ((e.clientX - left) / width - 0.5) * 12;
          const y = ((e.clientY - top) / height - 0.5) * 12;
          card.style.transition = "transform 80ms ease-out, box-shadow var(--dur-base) var(--ease-soft)";
          card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(1.01)`;
        });
        card.addEventListener("mouseleave", () => {
          card.style.transition = "transform var(--dur-base) var(--ease-soft), box-shadow var(--dur-base) var(--ease-soft)";
          card.style.transform = "";
        });
      });
    }

    const btn = document.getElementById("dossier-portrait-btn");
    const anchor = document.getElementById("beep-anchor");
    if (btn && anchor) {
      btn.addEventListener("click", () => {
        const beep = document.createElement("span");
        beep.className = "beep-floater";
        beep.textContent = "+1 beep";
        anchor.appendChild(beep);
        setTimeout(() => beep.remove(), 750);
      });
    }
  }
}
