/**
 * ARCHIVE OF UNFINISHED GAMES // DOT.EXE
 * Senior Application Entrypoint & Modular Orchestrator
 *
 * Clean Craft Architecture:
 * - audio.js: Web Audio API synthesizer, sound FX & mute synchronization
 * - three-scene.js: Three.js procedural 3D voxel Dot (lazy-loaded, mobile fallback)
 * - chat.js: Character AI rule-based dialogue terminal
 * - story.js: 4-scene interactive 8-bit RPG cutscene
 * - ui.js: Tactile restoration benches, map, jukebox, memory & trinkets
 */

import {
  ArchiveAudioEngine,
  SoundMasterManager
} from "./src/scripts/audio.js";

import {
  VoxelDotViewerManager
} from "./src/scripts/three-scene.js";

import {
  CharacterAIChatManager
} from "./src/scripts/chat.js";

import {
  RPGStoryCutsceneManager
} from "./src/scripts/story.js";

import {
  BootSequenceManager,
  DossierPortraitManager,
  SpriteRepairWorkshop,
  LostLevelsMapManager,
  PaintBucketManager,
  ChiptuneJukeboxManager,
  DotPointerReactionManager,
  StrayPixelTrailManager,
  LostLevelEasterEggManager,
  VisitorOdometerManager,
  VisitorMemoryManager,
  LiveDreamGuestbookManager,
  ChaosModeManager,
  ThemeModeManager,
  HeaderNavManager,
  CuteArchivalTrinketsManager,
  CustomCursorAuraManager,
  CardWobbleManager
} from "./src/scripts/ui.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Shared Web Audio API Engine & Master Sound Toggle
  const audioEngine = new ArchiveAudioEngine();
  const soundMaster = new SoundMasterManager(audioEngine);
  soundMaster.init();

  // 2. Tactile Desktop Cursor & Micro-Interactions
  const customCursor = new CustomCursorAuraManager(audioEngine);
  customCursor.init();

  const pixelTrail = new StrayPixelTrailManager();
  pixelTrail.init();

  const cardWobble = new CardWobbleManager();
  cardWobble.init();

  // 3. Navigation & Theme Controllers
  const navManager = new HeaderNavManager(audioEngine);
  navManager.init();

  const themeManager = new ThemeModeManager(audioEngine);
  themeManager.init();

  // 4. Hero & Boot Sequence
  const bootManager = new BootSequenceManager(audioEngine);
  bootManager.init();

  const dossierManager = new DossierPortraitManager(audioEngine);
  dossierManager.init();

  // 5. Returning Visitor Recognition & Hero Save File
  try {
    const hasVisited = localStorage.getItem("archive_visited_before_v1");
    if (hasVisited) {
      const moodPill = document.getElementById("hero-mood-pill");
      if (moodPill) moodPill.textContent = "[ STATUS: WELCOME BACK, FRIEND! ]";
      const statusBadge = document.querySelector(".status-badge");
      if (statusBadge) statusBadge.textContent = "RETURNING";
      const statusCapsule = document.getElementById("brand-status-capsule");
      if (statusCapsule) statusCapsule.title = "Archive System: Welcome back, friend!";
    } else {
      localStorage.setItem("archive_visited_before_v1", "true");
    }
  } catch (e) {}

  const visitorMemory = new VisitorMemoryManager(audioEngine);
  visitorMemory.init();

  // 6. Restoration Workshops (3 Benches)
  const spriteWorkshop = new SpriteRepairWorkshop(audioEngine);
  spriteWorkshop.init();

  const lostLevelsMap = new LostLevelsMapManager(audioEngine);
  lostLevelsMap.init();

  const paintBucket = new PaintBucketManager(audioEngine);
  paintBucket.init();

  const chiptuneJukebox = new ChiptuneJukeboxManager(soundMaster, audioEngine);
  chiptuneJukebox.init();

  // 7. Interactive 8-Bit RPG Cutscene
  const storyManager = new RPGStoryCutsceneManager(audioEngine);
  storyManager.init();

  // 8. 3D WebGL Voxel Reconstruction (Three.js lazy load + 2D mobile fallback)
  const voxelDotViewer = new VoxelDotViewerManager();
  voxelDotViewer.init();

  // 9. Mascot Pointer Reaction & Eye-Tracking
  const dotPointerManager = new DotPointerReactionManager(audioEngine);
  dotPointerManager.init();

  // 10. Character AI Terminal Chat
  const characterAIChat = new CharacterAIChatManager(audioEngine);
  characterAIChat.init();

  // 11. Guestbook & Ledger
  const odometerManager = new VisitorOdometerManager();
  odometerManager.init();

  const dreamGuestbook = new LiveDreamGuestbookManager(audioEngine);
  dreamGuestbook.init();

  // 12. Tactile Trinkets & Easter Eggs
  const cuteTrinkets = new CuteArchivalTrinketsManager(audioEngine);
  cuteTrinkets.init();

  const lostLevelManager = new LostLevelEasterEggManager(audioEngine);
  lostLevelManager.init();

  const chaosModeManager = new ChaosModeManager(audioEngine);
  chaosModeManager.init();
});
