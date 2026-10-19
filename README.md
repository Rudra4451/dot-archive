<div align="center">

# Dot: The Archive of Unfinished Games

<sub><em>Every game deserves a last level.</em></sub>

<br />

<p align="center">
  <a href="https://github.com"><img src="https://img.shields.io/badge/Event-Baby's%20First%20Website%20Hackathon-C96F8E?style=flat-square&labelColor=2D2420" alt="Event" /></a>
  <a href="https://github.com"><img src="https://img.shields.io/badge/Track-Track%202%20::%20Original%20Character-A8C3B0?style=flat-square&labelColor=2D2420" alt="Track" /></a>
  <a href="https://astro.build"><img src="https://img.shields.io/badge/Astro-Framework-E5829D?style=flat-square&labelColor=2D2420" alt="Astro" /></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-Vanilla%20ES6+-F2C94C?style=flat-square&labelColor=2D2420" alt="JavaScript" /></a>
  <a href="https://threejs.org"><img src="https://img.shields.io/badge/Three.js-WebGL%20Voxel-4FD1C5?style=flat-square&labelColor=2D2420" alt="Three.js" /></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API"><img src="https://img.shields.io/badge/Audio-Web%20Audio%20API-A8C3B0?style=flat-square&labelColor=2D2420" alt="Web Audio API" /></a>
</p>

<p align="center">
  <a href="#the-lore--the-pitch">The Lore</a> &middot;
  <a href="#the-judges-60-second-speedrun">Judge Speedrun</a> &middot;
  <a href="#interactive-feature-showcase--rubric-checklist">Rubric Checklist</a> &middot;
  <a href="#architecture--design-system">Architecture</a> &middot;
  <a href="#local-development">Local Setup</a> &middot;
  <a href="#-team-orbit">Team ORBIT</a>
</p>

<br />

<img src="./assets/demo.gif" width="800" alt="Dot Hero Banner" />

</div>

---

## The Lore & The Pitch

> "In 1997, a game called Moth & Moon booted for the first time. I was row 88, pixel 14,000, holding the top-right corner of the crescent moon. When the player logged off at 2:47 AM and never returned, the file went into the recycle bin. I climbed out with a chipped corner and an 8-bit paintbrush. Now I run a repair bay for forgotten sprites. Beep."

Dot is the resident caretaker of the Archive of Unfinished Games, a web sanctuary dedicated to abandoned prototypes, cancelled cartridges, and stranded sprites from 1995 to 1999. Rather than presenting a typical portfolio of finished commercial case studies, this site documents the beauty of unfinished code. Visitors inspect broken sprites on graph paper, trace sector maps of half-drawn bridges, listen to chiptunes rescued from deleted directories, and chat with an expressive pixel mascot who sneezes when flustered.

Built around a Soft Editorial Cute aesthetic, the interface sets aside clinical dark modes and stark white walls in favor of tactile paper textures, warm cream backgrounds (`#FDFBF7`), layered claymorphic cards, and literary typography. Display titles are set in Fraunces, reading passages use rounded Fredoka, and technical labels rely on monospaced DM Mono stamps. Every detail evokes the feeling of thumbing through a lovingly preserved 1990s gaming manual.

---

## The Judge's 60-Second Speedrun

To evaluate all major mechanics within one minute, follow this chronological tour:

| Time | Stop | Action & What to Observe |
| :--- | :--- | :--- |
| **0:00** | **Boot Sequence & Audio Switch** | Click <kbd>Sound ON</kbd> in the header strip or press <kbd>PRESS START</kbd>. Notice the authentic floppy terminal output and the two-tone Web Audio power-on blip. Zero external audio files are downloaded. |
| **0:15** | **Bench 01: Sprite Repair Shop** | Scroll to Workshops. Click the missing grey pixels on the 6x6 graph-paper canvas. Listen to the rising pentatonic kalimba tones and watch the localized celebration fire upon final pixel restoration. |
| **0:30** | **Bench 02: The Lost Levels Overworld Map** | Explore the retro pixel-art RPG overworld map featuring a winding dotted path and 5 interactive landmark markers (*The Half-Drawn Bridge*, *The Rain That Forgot to Stop*, *The Attic Without a Key*, *The Final Boss with No Script*, *The Last Save Point*). Click any marker to unfold tactile sticky-note cancellation reports and reveal authentic archived salvage notes. |
| **0:40** | **3D WebGL Voxel Reconstruction** | Navigate to the Voxel Lab. Click and drag or use <kbd>&larr;</kbd> <kbd>&rarr;</kbd> <kbd>&uarr;</kbd> <kbd>&darr;</kbd> arrow keys to orbit Dot in 3D space. Notice Dot's chipped corner and golden brush rendered under a strict 1,000 triangle budget. |
| **0:50** | **Story Cutscene & Secret Sector 00** | Scroll through the 5-scene interactive visual novel at Section 04 with real-time typewriter ticks. Then enter the Konami code (<kbd>&uarr;</kbd><kbd>&uarr;</kbd><kbd>&darr;</kbd><kbd>&darr;</kbd><kbd>&larr;</kbd><kbd>&rarr;</kbd><kbd>&larr;</kbd><kbd>&rarr;</kbd><kbd>B</kbd><kbd>A</kbd>) or click the visitor odometer 5 times to reveal the hidden Sector 00 modal. |

---

## Interactive Feature Showcase & Rubric Checklist

### Tier 1: Core Foundation & Visual Character
- [x] Responsive layout with warm cream (`#FDFBF7`) background and claymorphic card tokens.
- [x] Expressive mascot eye-tracking calculating pointer angle via `Math.atan2` within requestAnimationFrame loops.
- [x] 100% Vector SVG Icon System replacing all generic emojis with bespoke, tactile Soft Editorial retro graphics (floppy disk, cocoa mug, crescent moon, stars, megaphone, pushpin).
- [x] Clean minimal header strip with decluttered telemetry and streamlined frosted micro pixel-trail toggle.
- [x] Mascot tactile diorama with 3D ground shadow, interactive prop toys, and bouncy dialogue speech bubbles.
- [x] Typography system pairing Fraunces display serif with Fredoka sans-serif for zero layout shift.
- [x] Day and 3:00 AM Midnight theme switcher with custom dusk and dawn synthesized harp chords.
- [x] Semantic HTML5 structure utilizing `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>` landmarks.

### Tier 2: Interactive Systems & Audio Engine
- [x] Synthesizer audio engine built purely on the browser Web Audio API with zero external media files.
- [x] Sprite Repair Shop featuring 3 salvageable sprite files, interactive color restoration, and reset states.
- [x] The Lost Levels interactive RPG pixel overworld map with winding dotted trail, 5 landmark sector markers, and tactile cancellation field notes.
- [x] Chiptune Jukebox playing 3 multi-voice 8-bit tracks with a responsive text oscilloscope and CRT phosphor screen.
- [x] Paint Bucket tool turning cards into interactive canvases across berry, gold, and sage palettes.

### Tier 3: Polish, 3D Graphics & Secret Easter Eggs
- [x] Procedural Three.js 3D voxel Dot model (780 triangles) lazy-loaded via IntersectionObserver with mobile vector fallback.
- [x] Rule-based Character AI terminal chat with conversation topic chips and authentic personality ending in "beep".
- [x] Interactive 5-scene RPG cutscene visual novel with typewriter sound ticks and reduced-motion support.
- [x] Persistent visitor memory greeting returning guests with personalized save files via localStorage.
- [x] Secret Sector 00 modal revealed via 10-key Konami code or 5 rapid taps on the odometer.
- [x] Glitch Overdrive Chaos Mode featuring a top ticker marquee strip and cloned sprite mini-nodes.

<details>
<summary>Technical Highlights: Zero-Asset Audio & Voxel Performance</summary>

<br />

### Procedural Web Audio Engine
The audio system uses zero external audio files. Every sound effect and background chiptune track is generated in real time through native `AudioContext` nodes:
- **Tone Generators:** Square waves handle 8-bit lead melodies; sine waves power warm kalimba notes; triangle waves generate retro typewriter clicks.
- **Autoplay Compliance:** AudioContext initializes lazily upon explicit user gesture (such as clicking the sound switch or pressing start), preventing browser autoplay blocks.
- **Envelope Shaping:** Each note uses linear ramps for attack and exponential decay curves for natural release times.

### Three.js 3D Voxel Optimization
- **Triangle Budget:** Dot is built from 65 distinct cubes using shared `BoxGeometry` and `MeshLambertMaterial` instances. Total geometry measures 780 triangles, staying well below the 1,000 triangle constraint.
- **Lazy Loading:** Desktop viewports load Three.js dynamically using dynamic imports inside an IntersectionObserver.
- **Mobile Fallback:** Screen widths under 768px bypass Three.js entirely, rendering a lightweight 2D SVG illustration to conserve battery life and prevent GPU strain.
- **GPU Protection:** Pixel ratio is hard-capped with `Math.min(window.devicePixelRatio, 1.5)`.

</details>

---

## Architecture & Design System

```text
babys-first-website-dot/
-- .gitignore
-- index.html
-- main.js
-- package.json
-- style.css
-- vite.config.js
-- src/
   -- scripts/
      -- audio.js
      -- chat.js
      -- story.js
      -- three-scene.js
      -- ui.js
   -- styles/
      -- global.css
```

### Technical Stack & Layer Mapping

| Layer | Technology | Implementation Purpose |
| :--- | :--- | :--- |
| **Markup & Structure** | Semantic HTML5 | Accessible document tree with explicit image dimensions, preloaded web fonts, and ARIA roles. |
| **Design System** | Vanilla CSS | Custom properties for claymorphic card shadows, fluid typography scales, and responsive layouts. |
| **App Orchestration** | Vanilla JavaScript (ES Modules) | Lean application entrypoint initializing isolated component modules upon DOM ready. |
| **3D Rendering** | Three.js (WebGL) | Procedural 168-cube voxel mesh with mouse inertia and keyboard arrow navigation. |
| **Sound Synthesis** | Web Audio API | Real-time procedural square and sine wave synthesis with master gain control. |
| **Visual Effects** | Canvas Confetti | Celebration particle bursts on repair completion and easter egg reveals. |

### Color Palette & Typography Reference

| Role | Token Name | Value | Usage |
| :--- | :--- | :--- | :--- |
| **Paper Background** | `--bg` | `#FDFBF7` / `#FFFBF5` | Warm cream page background |
| **Primary Ink** | `--ink` | `#2D2420` | Headings, borders, and high-contrast text |
| **Soft Neutral** | `--ink-soft` | `#6B5E56` | Body copy and dialogue text |
| **Berry Accent** | `--berry` | `#C96F8E` | Primary action buttons and active indicators |
| **Sage Stamp** | `--sage` | `#A8C3B0` | Verification badges and map progress indicators |
| **Warm Gold** | `--gold` | `#F2C94C` | Jukebox accents and star collectibles |
| **Dot Cyan** | `--cyan` | `#4FD1C5` | Mascot body, glowing halo, and pixel trails |

| Typeface | Classification | Applied Scope |
| :--- | :--- | :--- |
| **Fraunces** | Display Serif | Section titles, hero headline, and card titles |
| **Fredoka** | Rounded Sans-Serif | Primary reading passages, dialogue, and UI text |
| **DM Mono** | Monospaced | Timestamps, status pills, and system stamps |

---

## Local Development

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher

### Installation & Execution

1. Clone the repository:
   ```bash
   git clone https://github.com/Rudra4451/dot-archive.git
   cd dot-archive
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

5. Generate a production build:
   ```bash
   npm run build
   npm run preview
   ```

---

## ✦ Team ORBIT

<div align="center">

<p align="center">
  <img src="https://img.shields.io/badge/ORBIT-CREATIVE%20COLLECTIVE-C96F8E?style=for-the-badge" alt="Team ORBIT Sticker" />
  <img src="https://img.shields.io/badge/UNIVERSE-THREE%20MINDS%20%C2%B7%20ONE%20PIXEL-A8C3B0?style=for-the-badge" alt="Universe Sticker" />
  <img src="https://img.shields.io/badge/ARCHIVE-SECTOR%2009-F2C94C?style=for-the-badge" alt="Sector 09 Sticker" />
</p>

# ORBIT

*Three minds. One little universe.*

We built **Dot — The Archive of Unfinished Games** for Baby's First Website Hackathon, Track 2: Original Character.

<p align="center">
  <img src="https://img.shields.io/badge/Track%202-Original%20Character-C96F8E?style=flat-square&labelColor=2D2420" alt="Track 2" />
  <img src="https://img.shields.io/badge/Status-Sector%2009%20Open-A8C3B0?style=flat-square&labelColor=2D2420" alt="Sector 09 Open" />
  <img src="https://img.shields.io/badge/Mascot-Dot.exe%20Voxel-4FD1C5?style=flat-square&labelColor=2D2420" alt="Dot.exe" />
</p>

</div>

<br />

| Team Member | Role |
| :--- | :--- |
| **Rudra Pratap Swain**<br /><img src="https://img.shields.io/badge/Role-Team%20Lead-C96F8E?style=flat-square&labelColor=2D2420" alt="Team Lead Badge" /> | **Team Lead &middot; Creative Direction & Development**<br /><sub>Architecture &middot; Web Audio Synthesizer &middot; Three.js Voxel Engine</sub><br /><img src="https://img.shields.io/badge/Discipline-Architecture%20%26%20Audio-2D2420?style=flat-square&labelColor=2D2420" alt="Architecture" /> <img src="https://img.shields.io/badge/Stack-Three.js%20%C2%B7%20WebAudio-4FD1C5?style=flat-square&labelColor=2D2420" alt="Three.js" /> |
| **Rohan Kumar Routa**<br /><img src="https://img.shields.io/badge/Role-Frontend%20Dev-4FD1C5?style=flat-square&labelColor=2D2420" alt="Frontend Dev Badge" /> | **Frontend Development & Interactive Systems**<br /><sub>Sprite Repair Workshop &middot; The Lost Levels Map &middot; Jukebox Mechanics</sub><br /><img src="https://img.shields.io/badge/Discipline-Sprite%20Lab%20%26%20Map-F2C94C?style=flat-square&labelColor=2D2420" alt="Sprite Lab" /> <img src="https://img.shields.io/badge/Stack-ES6+%20%C2%B7%20Interactive%20DOM-A8C3B0?style=flat-square&labelColor=2D2420" alt="DOM Systems" /> |
| **Suswapnil Sahu**<br /><img src="https://img.shields.io/badge/Role-Design%20%26%20Lore-E5829D?style=flat-square&labelColor=2D2420" alt="Design Lead Badge" /> | **Design, Storytelling & Quality Assurance**<br /><sub>Soft Editorial Cute UI &middot; Moth & Moon Lore &middot; Accessibility & QA</sub><br /><img src="https://img.shields.io/badge/Discipline-Story%20%26%20Narrative-C96F8E?style=flat-square&labelColor=2D2420" alt="Story" /> <img src="https://img.shields.io/badge/Audit-WCAG%20%C2%B7%20Reduced%20Motion-2D2420?style=flat-square&labelColor=2D2420" alt="Accessibility" /> |

<br />

<div align="center">

---

### `ARCHIVE STATUS: OPEN`

*Somewhere, a little pixel is still waiting to be placed.*

<br />

<p align="center">
  <img src="https://img.shields.io/badge/Dot.exe-Sector%2009-4FD1C5?style=flat-square&labelColor=2D2420" alt="Dot.exe" />
  <img src="https://img.shields.io/badge/Created%20By-Team%20ORBIT-C96F8E?style=flat-square&labelColor=2D2420" alt="Created By Team ORBIT" />
  <img src="https://img.shields.io/badge/Baby's%20First%20Website-Track%202%20Original%20Character-F2C94C?style=flat-square&labelColor=2D2420" alt="Track 2" />
</p>

<sub>Dot.exe &middot; Sector 09 &middot; Created by Team ORBIT</sub><br />
<sub>Baby's First Website Hackathon &middot; Track 2 — Original Character</sub>

</div>

