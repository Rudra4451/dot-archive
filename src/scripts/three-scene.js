/**
 * ARCHIVE OF UNFINISHED GAMES // DOT.EXE
 * 3D WebGL Voxel Reconstruction (Three.js Procedural Lazy-Loader)
 * - Strict budget: < 1,000 triangles (65 cubes * 12 triangles = 780 triangles)
 * - Mobile GPU protection: Math.min(window.devicePixelRatio, 1.5)
 * - Screens < 768px bypass Three.js entirely and display 2D crisp vector fallback
 */

export class VoxelDotViewerManager {
  constructor() {
    this.sectionEl = document.getElementById("voxel-lab");
    this.mountEl = document.getElementById("voxel-canvas-mount");
    this.fallbackEl = document.getElementById("voxel-mobile-fallback");
    this.loaderStateEl = document.getElementById("voxel-loader-state");

    this.isInitialized = false;
    this.isLoading = false;
    this.observer = null;
    this.animId = null;

    // Three.js instances
    this.THREE = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.dotGroup = null;

    // Interaction state (Mouse/Touch Drag Rotation with Inertia)
    this.isDragging = false;
    this.prevPointerX = 0;
    this.prevPointerY = 0;
    this.targetRotX = 0.12;
    this.targetRotY = -0.35;
    this.currentRotX = 0.12;
    this.currentRotY = -0.35;
    this.autoRotateSpeed = 0.005;
    this.lastInteractionTime = Date.now();
  }

  init() {
    if (!this.mountEl) return;

    // Mobile Fallback: On < 768px, completely skip loading Three.js
    if (this.isMobile()) {
      this.activateMobileFallback();
    } else {
      this.setupDesktopLazyLoad();
    }

    // Responsive listener
    window.addEventListener("resize", () => {
      this.handleResize();
    });
  }

  isMobile() {
    return window.innerWidth < 768;
  }

  activateMobileFallback() {
    if (this.mountEl) this.mountEl.style.display = "none";
    if (this.fallbackEl) this.fallbackEl.style.display = "flex";
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  setupDesktopLazyLoad() {
    if (this.mountEl) this.mountEl.style.display = "block";
    if (this.fallbackEl) this.fallbackEl.style.display = "none";

    if (this.isInitialized) {
      if (!this.animId) this.animate();
      return;
    }

    // Performance Lazy-Load: IntersectionObserver
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !this.isInitialized && !this.isLoading) {
              if (this.isMobile()) return;
              if (this.observer) this.observer.disconnect();
              this.loadAndInitThree();
            }
          });
        },
        { rootMargin: "150px 0px" }
      );
      this.observer.observe(this.mountEl);
    } else {
      this.loadAndInitThree();
    }
  }

  handleResize() {
    if (this.isMobile()) {
      this.activateMobileFallback();
    } else {
      if (!this.isInitialized && !this.isLoading) {
        this.setupDesktopLazyLoad();
      } else if (this.isInitialized && this.renderer && this.mountEl) {
        if (this.fallbackEl) this.fallbackEl.style.display = "none";
        this.mountEl.style.display = "block";
        const rect = this.mountEl.getBoundingClientRect();
        const width = Math.max(Math.round(rect.width), 320);
        const height = Math.max(Math.round(rect.height), 360);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
      }
    }
  }

  async loadAndInitThree() {
    this.isLoading = true;
    try {
      // Dynamic import: Three.js is NEVER bundled in the main entry chunk
      this.THREE = await import("three");
      this.setupThreeScene();
      this.isInitialized = true;
      if (this.loaderStateEl) {
        this.loaderStateEl.style.display = "none";
      }
    } catch (err) {
      this.activateMobileFallback();
    } finally {
      this.isLoading = false;
    }
  }

  setupThreeScene() {
    const THREE = this.THREE;
    const rect = this.mountEl.getBoundingClientRect();
    const width = Math.max(Math.round(rect.width), 320);
    const height = Math.max(Math.round(rect.height), 360);

    // Scene
    this.scene = new THREE.Scene();

    // Camera (closer framing & focused FOV for sharp, cinematic presentation)
    this.camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 1000);
    this.camera.position.set(0, 0.8, 16.5);

    // High-Precision WebGL Renderer (alpha transparent for claymorphism card background)
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      precision: "highp"
    });
    this.renderer.setSize(width, height);
    // Crisp High-DPI support up to 2.5x
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));

    // Modern color management & tone mapping for vibrant, punchy rendering
    if (THREE.SRGBColorSpace) {
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    if (THREE.ACESFilmicToneMapping) {
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;
    }

    this.mountEl.innerHTML = "";
    this.mountEl.appendChild(this.renderer.domElement);

    // Studio 3-Point Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8f1, 1.1);
    this.scene.add(ambientLight);

    // Key Directional Light (crisp top-right highlights)
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(12, 18, 14);
    this.scene.add(dirLight);

    // Soft Cyan Fill Light
    const cyanRim = new THREE.DirectionalLight(0x7ef5e4, 1.2);
    cyanRim.position.set(-14, 6, 8);
    this.scene.add(cyanRim);

    // Warm Golden Rim / Backlight
    const warmRim = new THREE.DirectionalLight(0xfef08a, 1.4);
    warmRim.position.set(0, 12, -14);
    this.scene.add(warmRim);

    // Build procedural 3D voxel Dot
    this.buildProceduralDot();

    // Ground Contact Shadow Disc
    const shadowGeo = new THREE.CylinderGeometry(3.6, 3.6, 0.05, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x1f1b18,
      transparent: true,
      opacity: 0.12
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0, -3.9, 0);
    this.scene.add(shadowMesh);

    // Interaction controls (Mouse, Touch, and Accessible Keyboard Navigation)
    this.setupInteraction();

    // Start 60fps render loop
    this.clock = new THREE.Clock();
    this.animate();
  }

  buildProceduralDot() {
    const THREE = this.THREE;
    this.dotGroup = new THREE.Group();

    // 0.96 box size creates micro-gap bevel definition so every voxel pops with clean, crisp edges!
    const boxGeo = new THREE.BoxGeometry(0.96, 0.96, 0.96);

    // High-spec MeshStandardMaterial palette with crisp flat shading and vibrant tones
    const materials = {
      cyan: new THREE.MeshStandardMaterial({ color: 0x38d9c0, roughness: 0.25, metalness: 0.05, flatShading: true }),
      cyanLight: new THREE.MeshStandardMaterial({ color: 0x7ef5e4, roughness: 0.2, metalness: 0.05, flatShading: true }),
      cyanDark: new THREE.MeshStandardMaterial({ color: 0x187a70, roughness: 0.3, metalness: 0.05, flatShading: true }),
      ink: new THREE.MeshStandardMaterial({ color: 0x1f1917, roughness: 0.45, metalness: 0.05, flatShading: true }),
      white: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.0, flatShading: true }),
      blush: new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.25, metalness: 0.0, flatShading: true }),
      gold: new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.2, metalness: 0.2, flatShading: true })
    };

    const addVoxel = (x, y, z, mat) => {
      const mesh = new THREE.Mesh(boxGeo, mat);
      mesh.position.set(x, y, z);
      this.dotGroup.add(mesh);
    };

    // 1. Chubby Body (5 columns wide: x in [-2..2]; 6 rows tall: y in [-2..3]; 2 layers deep: z in [0, 1])
    // Top-right stepped chipped corner carve-out: x in [1, 2] and y in [2, 3] (4 voxels per layer = 8 voxels carved)
    for (let x = -2; x <= 2; x++) {
      for (let y = -2; y <= 3; y++) {
        for (let z = 0; z <= 1; z++) {
          // Top-right stepped chipped corner
          if (x >= 1 && y >= 2) continue;

          // Front-face details (z = 1)
          if (z === 1) {
            // Eyes
            if ((x === -1 || x === 1) && y === 1) {
              addVoxel(x, y, z, materials.ink);
              continue;
            }
            if ((x === -1 || x === 1) && y === 2) {
              addVoxel(x, y, z, materials.white);
              continue;
            }
            // Blush cheeks
            if ((x === -2 || x === 2) && y === 0) {
              addVoxel(x, y, z, materials.blush);
              continue;
            }
            // Little mouth
            if (x === 0 && y === 0) {
              addVoxel(x, y, z, materials.ink);
              continue;
            }
          }

          // Outer Bevels & Highlights
          if (y === 3 || x === -2) {
            addVoxel(x, y, z, materials.cyanLight);
          } else if (y === -2 || x === 2 || z === 0) {
            addVoxel(x, y, z, materials.cyanDark);
          } else {
            addVoxel(x, y, z, materials.cyan);
          }
        }
      }
    }

    // 2. Boots (4 voxels)
    addVoxel(-1, -3, 1, materials.ink);
    addVoxel(-1, -3, 0, materials.cyanDark);
    addVoxel(1, -3, 1, materials.ink);
    addVoxel(1, -3, 0, materials.cyanDark);

    // 3. Left Arm (2 voxels)
    addVoxel(-3, 0, 1, materials.cyanLight);
    addVoxel(-3, -1, 1, materials.cyan);

    // 4. Right Arm (2 voxels)
    addVoxel(3, 0, 1, materials.cyanLight);
    addVoxel(3, -1, 1, materials.cyan);

    // 5. Golden Restorer Brush (3 voxels)
    addVoxel(4, 0, 1, materials.gold);
    addVoxel(4, 1, 1, materials.gold);
    addVoxel(4, 2, 1, materials.white); // brush tip

    // 6. Floating Chipped Corner Crumbs (2 voxels)
    addVoxel(2, 4, 1, materials.gold);
    addVoxel(3, 3, 0, materials.cyan);

    // Position Dot group centered nicely
    this.dotGroup.position.set(0, 0.2, 0);
    this.scene.add(this.dotGroup);
  }

  setupInteraction() {
    const el = this.renderer.domElement;

    const onPointerDown = (clientX, clientY) => {
      this.isDragging = true;
      this.prevPointerX = clientX;
      this.prevPointerY = clientY;
      this.lastInteractionTime = Date.now();
    };

    const onPointerMove = (clientX, clientY) => {
      if (!this.isDragging) return;
      const dx = clientX - this.prevPointerX;
      const dy = clientY - this.prevPointerY;
      this.prevPointerX = clientX;
      this.prevPointerY = clientY;

      this.targetRotY += dx * 0.012;
      this.targetRotX += dy * 0.012;
      this.targetRotX = Math.max(-0.6, Math.min(0.6, this.targetRotX));
      this.lastInteractionTime = Date.now();
    };

    const onPointerUp = () => {
      this.isDragging = false;
    };

    // Mouse listeners
    el.addEventListener("mousedown", (e) => onPointerDown(e.clientX, e.clientY));
    window.addEventListener("mousemove", (e) => onPointerMove(e.clientX, e.clientY));
    window.addEventListener("mouseup", onPointerUp);

    // Touch listeners
    el.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length === 1) {
          onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      { passive: true }
    );
    window.addEventListener(
      "touchmove",
      (e) => {
        if (this.isDragging && e.touches.length === 1) {
          onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      { passive: true }
    );
    window.addEventListener("touchend", onPointerUp);

    // Hover tilt effect
    el.addEventListener("mousemove", (e) => {
      if (this.isDragging) return;
      const rect = el.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      if (this.dotGroup) {
        this.dotGroup.position.x = normX * 0.8;
      }
    });

    // Keyboard navigation for accessible 3D canvas exploration
    if (this.mountEl) {
      this.mountEl.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          this.targetRotY -= 0.25;
          this.lastInteractionTime = Date.now();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          this.targetRotY += 0.25;
          this.lastInteractionTime = Date.now();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          this.targetRotX = Math.max(-0.6, this.targetRotX - 0.2);
          this.lastInteractionTime = Date.now();
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          this.targetRotX = Math.min(0.6, this.targetRotX + 0.2);
          this.lastInteractionTime = Date.now();
        } else if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          this.targetRotY += Math.PI * 0.5;
          this.lastInteractionTime = Date.now();
        }
      });
    }
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());

    if (!this.renderer || !this.scene || !this.camera || !this.dotGroup) return;

    const elapsedTime = this.clock ? this.clock.getElapsedTime() : 0;

    // Auto-rotation after 1.8s idle
    if (!this.isDragging && Date.now() - this.lastInteractionTime > 1800) {
      this.targetRotY += this.autoRotateSpeed;
    }

    // Smooth inertia interpolation
    this.currentRotY += (this.targetRotY - this.currentRotY) * 0.08;
    this.currentRotX += (this.targetRotX - this.currentRotX) * 0.08;

    this.dotGroup.rotation.y = this.currentRotY;
    this.dotGroup.rotation.x = this.currentRotX;

    // Gentle floating breathing motion
    if (!this.isDragging) {
      this.dotGroup.position.y = 0.5 + Math.sin(elapsedTime * 2.2) * 0.35;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
