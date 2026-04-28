"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type LumerMood = "idle" | "raise" | "clap" | "nod" | "boo" | "confused";

export interface LumerState {
  name: string;
  color: string;
  /** Optional belly color override (defaults to off-white). */
  bellyColor?: string;
  mood: LumerMood;
  /** highlights this lumer (e.g., currently speaking) */
  focused?: boolean;
  /** Optional accessory variation for visual variety. */
  accessory?: "none" | "scarf" | "cap" | "glasses" | "bowtie";
}

export interface AuditoriumProps {
  /** Array of lumer seats (positions are fixed; identified by index). */
  lumers: LumerState[];
  /** 0 (open) → 1 (fully closed). Curtain overlay fraction. */
  curtain: number;
  /** CSS background or color for the backdrop. */
  className?: string;
}

/**
 * Renders a 3D auditorium with cute Pingu-style Lumer characters seated in
 * tiered rows of chairs. All geometry is procedural (no external assets).
 */
export function Auditorium({ lumers, curtain, className }: AuditoriumProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<AuditoriumApi | null>(null);

  // Mount + dispose scene once per lumer count change.
  useEffect(() => {
    if (!mountRef.current) return;
    const initialAccessories = lumers.map((l) => l.accessory ?? "none");
    const api = createAuditorium(mountRef.current, lumers.length, initialAccessories);
    apiRef.current = api;
    return () => {
      api.dispose();
      apiRef.current = null;
    };
    // We intentionally only re-create the scene when the number of lumers changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lumers.length]);

  // Update lumer states every render
  useEffect(() => {
    apiRef.current?.update(lumers, curtain);
  }, [lumers, curtain]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    />
  );
}

interface AuditoriumApi {
  update: (lumers: LumerState[], curtain: number) => void;
  dispose: () => void;
}

function createAuditorium(
  container: HTMLDivElement,
  lumerCount: number,
  accessoryHints: Array<LumerState["accessory"]>
): AuditoriumApi {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0b1028");
  scene.fog = new THREE.Fog("#0b1028", 16, 36);

  // Professor POV: standing on stage looking at the plateia.
  // Camera params adjust for portrait/landscape on `resize()` below.
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
  camera.position.set(0, 3.4, -2.6);
  camera.lookAt(0, 1.8, 7);
  // Look-at target is held in a vec3 so we can re-aim on resize.
  const camTarget = new THREE.Vector3(0, 1.8, 7);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h, false);
    const aspect = w / Math.max(1, h);
    camera.aspect = aspect;
    // Adapt framing to the aspect ratio so all 20 lumers fit AND fill the
    // visible canvas. On phones the camera sits higher and looks further
    // down so the audience occupies most of the frame instead of leaving a
    // tall band of ceiling/columns above them.
    if (aspect < 0.75) {
      // very tall portrait (typical phone in portrait above the drawer)
      camera.fov = 82;
      camera.position.set(0, 4.6, -4.2);
      camTarget.set(0, 0.4, 7);
    } else if (aspect < 1.1) {
      // squarish (phone landscape, small windows)
      camera.fov = 70;
      camera.position.set(0, 4.1, -3.4);
      camTarget.set(0, 0.9, 7);
    } else if (aspect < 1.7) {
      // standard tablet/landscape
      camera.fov = 60;
      camera.position.set(0, 3.6, -2.8);
      camTarget.set(0, 1.5, 7);
    } else {
      // wide desktop
      camera.fov = 54;
      camera.position.set(0, 3.4, -2.6);
      camTarget.set(0, 1.8, 7);
    }
    camera.lookAt(camTarget);
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  scene.add(new THREE.HemisphereLight(0xfff1c0, 0x402030, 0.7));
  // Subtle warm glow from the ceiling lamps.
  const ceilingGlow = new THREE.PointLight(0xffd166, 0.55, 22);
  ceilingGlow.position.set(0, 9.5, 5);
  scene.add(ceilingGlow);

  // Spot lights the audience.
  const spot = new THREE.SpotLight(0xfff5d6, 1.6, 50, Math.PI / 4.0, 0.45, 1.1);
  spot.position.set(0, 11, -1);
  spot.target.position.set(0, 1.0, 6);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  scene.add(spot);
  scene.add(spot.target);

  const fillL = new THREE.PointLight(0x6f8dff, 0.85, 26);
  fillL.position.set(-5, 4, 5);
  scene.add(fillL);
  const fillR = new THREE.PointLight(0xff9ab0, 0.55, 26);
  fillR.position.set(5, 4, 5);
  scene.add(fillR);

  // Floor (auditorium hall): warm carpet color so ambient looks cozier.
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(20, 56),
    new THREE.MeshStandardMaterial({ color: 0x2a1f4a, roughness: 0.95 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // ---- Auditorium room ----------------------------------------------------
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x4d2c2c, roughness: 0.85 });
  const panelMat = new THREE.MeshStandardMaterial({ color: 0x6c3b30, roughness: 0.7 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xc89b4a, roughness: 0.6, metalness: 0.3 });
  const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x1a1024, roughness: 0.95 });

  // Back wall (far behind audience).
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(28, 14), wallMat);
  backWall.position.set(0, 7, 14);
  backWall.receiveShadow = true;
  scene.add(backWall);

  // Decorative panels on back wall.
  for (let p = -3; p <= 3; p++) {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(2.5, 4, 0.2), panelMat);
    panel.position.set(p * 3.2, 5, 13.85);
    scene.add(panel);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.18, 0.22), trimMat);
    trim.position.set(p * 3.2, 7.1, 13.84);
    scene.add(trim);
  }

  // Side walls.
  const wallL = new THREE.Mesh(new THREE.PlaneGeometry(20, 14), wallMat);
  wallL.position.set(-9.5, 7, 5);
  wallL.rotation.y = Math.PI / 2;
  scene.add(wallL);
  const wallR = new THREE.Mesh(new THREE.PlaneGeometry(20, 14), wallMat);
  wallR.position.set(9.5, 7, 5);
  wallR.rotation.y = -Math.PI / 2;
  scene.add(wallR);

  // Ceiling.
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), ceilingMat);
  ceiling.position.set(0, 11, 4);
  ceiling.rotation.x = Math.PI / 2;
  scene.add(ceiling);

  // Hanging ceiling lights (warm emissive discs).
  const lampMat = new THREE.MeshStandardMaterial({
    color: 0xffe7a3,
    emissive: 0xffd166,
    emissiveIntensity: 1.2,
  });
  for (let lr = 0; lr < 3; lr++) {
    for (let lc = -2; lc <= 2; lc++) {
      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 18), lampMat);
      lamp.position.set(lc * 3.4, 10.85, 1.5 + lr * 4.2);
      scene.add(lamp);
      const cord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.4, 6),
        new THREE.MeshStandardMaterial({ color: 0x111111 })
      );
      cord.position.set(lc * 3.4, 11.05, 1.5 + lr * 4.2);
      scene.add(cord);
    }
  }

  // Columns along the side walls (decorative).
  const colMat = new THREE.MeshStandardMaterial({ color: 0xc89b4a, roughness: 0.55, metalness: 0.2 });
  for (let cz = 1; cz <= 4; cz++) {
    const z = 0.5 + cz * 3.0;
    [-9.0, 9.0].forEach((cx) => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 11, 14), colMat);
      col.position.set(cx, 5.5, z);
      scene.add(col);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.7), colMat);
      cap.position.set(cx, 10.95, z);
      scene.add(cap);
      const baseB = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.7), colMat);
      baseB.position.set(cx, 0.1, z);
      scene.add(baseB);
    });
  }

  // Stage backdrop / proscenium arch behind camera (visible at top of frame).
  const arch = new THREE.Mesh(
    new THREE.BoxGeometry(20, 1.0, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x6c3b30, roughness: 0.6 }),
  );
  arch.position.set(0, 9.0, -1.2);
  scene.add(arch);
  const archTrim = new THREE.Mesh(
    new THREE.BoxGeometry(20, 0.18, 0.7),
    trimMat,
  );
  archTrim.position.set(0, 8.5, -1.18);
  scene.add(archTrim);

  // Stage floor in front of the camera (we're on it).
  const stage = new THREE.Mesh(
    new THREE.BoxGeometry(8, 0.18, 3.2),
    new THREE.MeshStandardMaterial({
      color: 0x6f4ad6,
      roughness: 0.5,
      emissive: 0x2a1672,
      emissiveIntensity: 0.25,
    })
  );
  stage.position.set(0, 0.09, -2.0);
  stage.receiveShadow = true;
  scene.add(stage);

  // Curtain (red panels that slide in from sides to close).
  const curtainMat = new THREE.MeshStandardMaterial({
    color: 0xa31a2e,
    roughness: 0.7,
    emissive: 0x3a0a14,
    emissiveIntensity: 0.2,
  });
  const curtainLeft = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 0.18), curtainMat);
  curtainLeft.position.set(-10.5, 4, 0.6);
  scene.add(curtainLeft);
  const curtainRight = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 0.18), curtainMat);
  curtainRight.position.set(10.5, 4, 0.6);
  scene.add(curtainRight);

  // Seating layout: 4 tiered rows of 5 lumers each (= 20). If lumerCount differs,
  // we still distribute across as many rows / cols as needed.
  const cols = 5;
  const rows = Math.max(1, Math.ceil(lumerCount / cols));
  const tierStep = 0.6;       // height per tier
  const rowDepth = 1.95;      // z-spacing between rows
  const colSpacing = 1.55;    // x-spacing between columns
  const firstRowZ = 2.3;

  const lumerObjs: LumerObj[] = [];
  const chairs: THREE.Group[] = [];

  for (let i = 0; i < lumerCount; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const tierY = row * tierStep;
    const z = firstRowZ + row * rowDepth;
    // Slight x stagger so back-row lumers peek between front-row heads.
    const stagger = row % 2 === 0 ? 0 : colSpacing * 0.5;
    const x = (col - (cols - 1) / 2) * colSpacing + stagger;

    const chair = buildChair();
    chair.position.set(x, tierY, z);
    chair.lookAt(0, tierY + 0.8, -2.6);
    scene.add(chair);
    chairs.push(chair);

    const accessory = accessoryHints[i] ?? randomAccessory(i);
    const lumer = buildLumer(accessory);
    // Body bottom (radius ~0.61 vertical) must rest on the seat top
    // (chair seat top sits at chair.y + 0.47), so root.y = tierY + 0.47 + 0.61.
    lumer.root.position.set(x, tierY + 1.08, z);
    lumer.root.lookAt(0, tierY + 1.4, -2.6);
    // Per-lumer randomness for natural animation.
    lumer.seed = (i * 137.7) % 1000;
    lumer.blinkOffset = Math.random() * 4 + i * 0.13;
    lumer.bobOffset = Math.random() * Math.PI * 2;
    scene.add(lumer.root);
    lumerObjs.push(lumer);
  }

  // Tier platforms — one solid platform per row at its tier height. Adjacent
  // platforms touch (no gap, no overlap) and the visible front face of each
  // platform acts as the riser/step. Chairs rest on top of the platform of
  // their row, so chair feet never sink into the floor.
  const platformMat = new THREE.MeshStandardMaterial({
    color: 0x271a4a,
    roughness: 0.85,
  });
  for (let r = 0; r < rows; r++) {
    const platformTopY = r * tierStep;
    const platformZ = firstRowZ + r * rowDepth;
    const platformDepth = rowDepth;
    const platformHeight = 0.4 + r * tierStep; // taller for back rows so face stays above floor
    const platform = new THREE.Mesh(
      new THREE.BoxGeometry(cols * colSpacing + 2, platformHeight, platformDepth),
      platformMat
    );
    platform.position.set(0, platformTopY - platformHeight / 2, platformZ);
    platform.receiveShadow = true;
    scene.add(platform);
  }

  // State
  let currentLumers: LumerState[] = [];
  let targetCurtain = 0;
  let currentCurtain = 0;
  const start = performance.now();

  function update(lumers: LumerState[], curtain: number) {
    currentLumers = lumers;
    targetCurtain = Math.max(0, Math.min(1, curtain));
    lumerObjs.forEach((l, i) => {
      const state = lumers[i];
      if (!state) return;
      l.bodyMat.color.set(state.color);
      if (state.bellyColor) {
        l.bellyMat.color.set(state.bellyColor);
      }
      const emissive = state.focused ? 0.55 : 0.05;
      l.bodyMat.emissive.set(state.color);
      l.bodyMat.emissiveIntensity = emissive;
    });
  }

  let raf = 0;
  function tick() {
    raf = requestAnimationFrame(tick);
    const t = (performance.now() - start) / 1000;

    // Smooth curtain
    currentCurtain += (targetCurtain - currentCurtain) * 0.06;
    const offsetL = -10.5 + 10 * currentCurtain;
    const offsetR = 10.5 - 10 * currentCurtain;
    curtainLeft.position.x = offsetL;
    curtainRight.position.x = offsetR;

    lumerObjs.forEach((l, i) => {
      const state = currentLumers[i];
      const mood: LumerMood = state?.mood ?? "idle";
      const seedBob = l.bobOffset;

      // Idle bob
      const bob = Math.sin(t * 1.6 + seedBob) * 0.04;
      l.body.position.y = 0 + bob;
      l.headPivot.position.y = 0.62 + bob * 0.9;

      // Default rotations per frame
      let leftArmRot = Math.sin(t * 1.2 + i) * 0.06;
      let rightArmRot = -Math.sin(t * 1.2 + i) * 0.06;
      let headTiltX = 0;
      let headTiltZ = 0;
      let mouthScale = 1;
      let leftArmLift = 0; // for scratch
      let rightArmLift = 0;

      if (mood === "raise") {
        // Right arm up to ask a question; mouth oscillates while talking.
        rightArmRot = -Math.PI * 0.85 + Math.sin(t * 6) * 0.08;
        leftArmRot = Math.sin(t * 1 + i) * 0.08;
        mouthScale = 1 + (Math.sin(t * 9 + i) * 0.5 + 0.5) * 1.6;
      } else if (mood === "clap") {
        const c = Math.sin(t * 11 + i) * 0.4;
        leftArmRot = -Math.PI / 3 + c;
        rightArmRot = -Math.PI / 3 - c;
      } else if (mood === "nod") {
        headTiltX = Math.sin(t * 3.2 + i) * 0.18;
      } else if (mood === "boo") {
        leftArmRot = Math.sin(t * 4 + i) * 0.5 - 0.3;
        rightArmRot = -(Math.sin(t * 4 + i) * 0.5 - 0.3);
      } else if (mood === "confused") {
        // Tilt head side to side and scratch behind ear with right hand.
        headTiltZ = Math.sin(t * 1.8 + i) * 0.28;
        rightArmRot = -Math.PI * 0.55 + Math.sin(t * 7 + i) * 0.18;
        rightArmLift = 0.05 + Math.abs(Math.sin(t * 7 + i)) * 0.06;
      }

      l.leftArmPivot.rotation.z = leftArmRot;
      l.rightArmPivot.rotation.z = rightArmRot;
      l.leftArmPivot.position.y = 0.34 + leftArmLift;
      l.rightArmPivot.position.y = 0.34 + rightArmLift;
      l.headPivot.rotation.x = headTiltX;
      l.headPivot.rotation.z = headTiltZ;
      l.mouth.scale.set(1, mouthScale, 1);

      // Blinking — every ~3-5s a quick eye scale.
      const blinkT = (t + l.blinkOffset) % 4.2;
      const blinkAmount = blinkT < 0.12 ? 1 - Math.sin((blinkT / 0.12) * Math.PI) : 1;
      l.eyeL.scale.y = blinkAmount;
      l.eyeR.scale.y = blinkAmount;
      l.pupilL.scale.y = blinkAmount;
      l.pupilR.scale.y = blinkAmount;

      // Focus pulse
      const focus = state?.focused ? 1.06 + Math.sin(t * 3 + i) * 0.025 : 1;
      l.root.scale.setScalar(focus);
    });

    renderer.render(scene, camera);
  }
  tick();

  function dispose() {
    cancelAnimationFrame(raf);
    ro.disconnect();
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose?.();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else if (mat) mat.dispose();
    });
  }

  return { update, dispose };
}

// ---------------------------------------------------------------------------
// Lumer geometry (Pingu-inspired)
// ---------------------------------------------------------------------------

interface LumerObj {
  root: THREE.Group;
  body: THREE.Mesh;
  headPivot: THREE.Group;
  leftArmPivot: THREE.Group;
  rightArmPivot: THREE.Group;
  eyeL: THREE.Mesh;
  eyeR: THREE.Mesh;
  pupilL: THREE.Mesh;
  pupilR: THREE.Mesh;
  mouth: THREE.Object3D;
  bodyMat: THREE.MeshStandardMaterial;
  bellyMat: THREE.MeshStandardMaterial;
  seed: number;
  blinkOffset: number;
  bobOffset: number;
}

const SKIN_TONES = [0xf6c8a3, 0xefb37e, 0xd99a72, 0xb37b54, 0x8d5a3c, 0xf2d7b5];
const HAIR_COLORS = [0x1a1216, 0x2c1a0e, 0x4a2c1a, 0x71492b, 0x9c6b3b, 0xd7a96b, 0xb24a3a, 0x6b6b6b];
const SHOE_COLORS = [0x141414, 0x2a1a10, 0x422a18];

function buildLumer(accessory: LumerState["accessory"] = "none"): LumerObj {
  const skinMat = new THREE.MeshStandardMaterial({
    color: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)],
    roughness: 0.7,
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
    roughness: 0.85,
  });
  const shoeMat = new THREE.MeshStandardMaterial({
    color: SHOE_COLORS[Math.floor(Math.random() * SHOE_COLORS.length)],
    roughness: 0.6,
  });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1330, roughness: 0.5 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  const lipsMat = new THREE.MeshStandardMaterial({ color: 0xa64b4b, roughness: 0.55 });
  const irisMat = new THREE.MeshStandardMaterial({
    color: [0x3a6a4a, 0x4f3826, 0x254a72, 0x6e4a2a, 0x2a2a2a][Math.floor(Math.random() * 5)],
    roughness: 0.5,
  });

  const root = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x2a1f4a,
    roughness: 0.55,
    metalness: 0.04,
  });
  const bellyMat = new THREE.MeshStandardMaterial({
    color: 0xfaf3e3,
    roughness: 0.5,
  });

  // Body: ovoid (tall egg).
  const bodyGeom = new THREE.SphereGeometry(0.46, 24, 20);
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.scale.set(1, 1.32, 0.95);
  body.position.y = 0;
  body.castShadow = true;
  body.receiveShadow = true;
  root.add(body);

  // Light belly patch — slightly forward, scaled flat.
  const belly = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 22, 18),
    bellyMat
  );
  belly.scale.set(0.82, 1.05, 0.55);
  belly.position.set(0, -0.05, 0.22);
  root.add(belly);

  // Neck (small cylinder).
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.13, 0.12, 12),
    skinMat
  );
  neck.position.set(0, 0.5, 0);
  root.add(neck);

  // Head pivot (so we can tilt for nod / confused).
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 0.62, 0);
  root.add(headPivot);

  // Humanoid head (skin sphere, slightly elongated).
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 26, 22), skinMat);
  head.scale.set(1, 1.1, 1);
  head.castShadow = true;
  headPivot.add(head);

  // Hair — cap on top of head.
  const hairStyle = Math.floor(Math.random() * 4);
  if (hairStyle === 0) {
    // Short cap of hair.
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.345, 22, 16, 0, Math.PI * 2, 0, Math.PI / 2.2), hairMat);
    hair.scale.set(1.05, 1.0, 1.05);
    hair.position.set(0, 0.06, -0.02);
    headPivot.add(hair);
  } else if (hairStyle === 1) {
    // Side parted with bangs forward.
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.355, 22, 16, 0, Math.PI * 2, 0, Math.PI / 2.0), hairMat);
    hair.scale.set(1.02, 0.95, 1.02);
    hair.position.set(0, 0.05, 0);
    headPivot.add(hair);
    const bangs = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.07, 0.06), hairMat);
    bangs.position.set(0.06, 0.22, 0.28);
    bangs.rotation.z = -0.2;
    headPivot.add(bangs);
  } else if (hairStyle === 2) {
    // Bun on top.
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.345, 22, 16, 0, Math.PI * 2, 0, Math.PI / 2.4), hairMat);
    hair.scale.set(1.04, 0.9, 1.04);
    hair.position.set(0, 0.07, 0);
    headPivot.add(hair);
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), hairMat);
    bun.position.set(0, 0.42, -0.04);
    headPivot.add(bun);
  } else {
    // Curly afro (group of small spheres).
    for (let k = 0; k < 9; k++) {
      const a = (k / 9) * Math.PI * 2;
      const r = 0.38;
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10), hairMat);
      ball.position.set(Math.cos(a) * r * 0.7, 0.18 + Math.sin(a * 0.7) * 0.04, Math.sin(a) * r * 0.6 - 0.04);
      headPivot.add(ball);
    }
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 12), hairMat);
    top.position.set(0, 0.32, -0.02);
    headPivot.add(top);
  }

  // Eyebrows (small dark boxes; tilt for emotion).
  const browGeom = new THREE.BoxGeometry(0.09, 0.02, 0.02);
  const browL = new THREE.Mesh(browGeom, darkMat);
  browL.position.set(-0.13, 0.19, 0.3);
  browL.rotation.z = 0.1;
  headPivot.add(browL);
  const browR = new THREE.Mesh(browGeom, darkMat);
  browR.position.set(0.13, 0.19, 0.3);
  browR.rotation.z = -0.1;
  headPivot.add(browR);

  // Eyes — big expressive anime-style. White sclera, colored iris, dark pupil,
  // plus a small white catchlight for liveliness.
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 18, 14), whiteMat);
  eyeL.position.set(-0.12, 0.08, 0.27);
  eyeL.scale.set(1.0, 1.15, 0.7);
  headPivot.add(eyeL);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.09, 18, 14), whiteMat);
  eyeR.position.set(0.12, 0.08, 0.27);
  eyeR.scale.set(1.0, 1.15, 0.7);
  headPivot.add(eyeR);

  const irisL = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 12), irisMat);
  irisL.position.set(-0.12, 0.07, 0.32);
  headPivot.add(irisL);
  const irisR = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 12), irisMat);
  irisR.position.set(0.12, 0.07, 0.32);
  headPivot.add(irisR);

  const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 10), darkMat);
  pupilL.position.set(-0.12, 0.07, 0.35);
  headPivot.add(pupilL);
  const pupilR = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 10), darkMat);
  pupilR.position.set(0.12, 0.07, 0.35);
  headPivot.add(pupilR);

  // Catchlights (tiny white highlights upper-left of each pupil).
  const catchMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.6,
  });
  const catchL = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), catchMat);
  catchL.position.set(-0.105, 0.095, 0.37);
  headPivot.add(catchL);
  const catchR = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), catchMat);
  catchR.position.set(0.135, 0.095, 0.37);
  headPivot.add(catchR);

  // Nose — small, tasteful bump.
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 10), skinMat);
  nose.scale.set(1.1, 1.1, 1.2);
  nose.position.set(0, -0.02, 0.34);
  headPivot.add(nose);

  // Mouth — clean curved smile (just a thin partial torus, no inner fill).
  // Grouped so we can scale Y for "talking" animation without deforming the
  // geometry center.
  const mouth = new THREE.Group();
  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.05, 0.008, 12, 22, Math.PI),
    lipsMat,
  );
  // Default torus arc opens upward (cup); rotate Z by PI so it cups downward
  // forming a :) shape, and rotate slightly toward camera so it sits on the face.
  smile.rotation.z = Math.PI;
  mouth.add(smile);
  mouth.position.set(0, -0.08, 0.33);
  headPivot.add(mouth);

  // Cheeks (subtle blush).
  const cheekMat = new THREE.MeshStandardMaterial({
    color: 0xff7e94,
    transparent: true,
    opacity: 0.42,
  });
  const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), cheekMat);
  cheekL.position.set(-0.18, -0.02, 0.27);
  headPivot.add(cheekL);
  const cheekR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), cheekMat);
  cheekR.position.set(0.18, -0.02, 0.27);
  headPivot.add(cheekR);

  // Ears (small skin spheres on the sides).
  const earL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), skinMat);
  earL.position.set(-0.32, 0.04, 0.02);
  earL.scale.set(0.6, 1.0, 0.9);
  headPivot.add(earL);
  const earR = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), skinMat);
  earR.position.set(0.32, 0.04, 0.02);
  earR.scale.set(0.6, 1.0, 0.9);
  headPivot.add(earR);

  // Arms (pivot groups for shoulder rotation). Cylinder upper-arm + small skin hand.
  const armUpperGeom = new THREE.SphereGeometry(0.18, 14, 12);
  const handGeom = new THREE.SphereGeometry(0.09, 12, 10);

  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.42, 0.34, 0);
  const leftArm = new THREE.Mesh(armUpperGeom, bodyMat);
  leftArm.scale.set(0.55, 1.5, 0.9);
  leftArm.position.set(-0.05, -0.18, 0);
  leftArm.castShadow = true;
  leftArmPivot.add(leftArm);
  const leftHand = new THREE.Mesh(handGeom, skinMat);
  leftHand.position.set(-0.07, -0.45, 0);
  leftArmPivot.add(leftHand);
  root.add(leftArmPivot);

  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.42, 0.34, 0);
  const rightArm = new THREE.Mesh(armUpperGeom, bodyMat);
  rightArm.scale.set(0.55, 1.5, 0.9);
  rightArm.position.set(0.05, -0.18, 0);
  rightArm.castShadow = true;
  rightArmPivot.add(rightArm);
  const rightHand = new THREE.Mesh(handGeom, skinMat);
  rightHand.position.set(0.07, -0.45, 0);
  rightArmPivot.add(rightHand);
  root.add(rightArmPivot);

  // Shoes (dark ovoids dangling in front of chair seat). Lumers are seated, so
  // the body ovoid rests on the seat top and feet hang forward+down toward
  // the platform. Place feet just above the platform and forward of the seat
  // edge so they peek out below the chair.
  const shoeGeom = new THREE.SphereGeometry(0.11, 12, 10);
  const footL = new THREE.Mesh(shoeGeom, shoeMat);
  footL.scale.set(1.1, 0.55, 1.7);
  // Local +z points toward the camera (after lumer.lookAt(camera-side target)),
  // so positive z places feet in front of the chair.
  footL.position.set(-0.16, -1.0, 0.55);
  root.add(footL);
  const footR = new THREE.Mesh(shoeGeom, shoeMat);
  footR.scale.set(1.1, 0.55, 1.7);
  footR.position.set(0.16, -1.0, 0.55);
  root.add(footR);

  // Accessory variations
  if (accessory === "scarf") {
    const scarf = new THREE.Mesh(
      new THREE.TorusGeometry(0.28, 0.07, 10, 22),
      new THREE.MeshStandardMaterial({
        color: pickAccessoryColor("scarf"),
        roughness: 0.6,
      })
    );
    scarf.rotation.x = Math.PI / 2;
    scarf.position.set(0, 0.46, 0);
    root.add(scarf);
  } else if (accessory === "cap") {
    // Graduation-style cap.
    const capColor = 0x111122;
    const capBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.07, 16),
      new THREE.MeshStandardMaterial({ color: capColor, roughness: 0.6 })
    );
    capBase.position.set(0, 0.95, 0.0);
    headPivot.add(capBase);
    const capPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.04, 0.46),
      new THREE.MeshStandardMaterial({ color: capColor, roughness: 0.6 })
    );
    capPlate.position.set(0, 1.0, 0);
    headPivot.add(capPlate);
    const tassel = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffd34a, roughness: 0.5 })
    );
    tassel.position.set(0.18, 0.93, 0.18);
    headPivot.add(tassel);
  } else if (accessory === "glasses") {
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0x111122,
      roughness: 0.5,
      transparent: true,
      opacity: 0.85,
    });
    const lensL = new THREE.Mesh(
      new THREE.TorusGeometry(0.085, 0.018, 8, 18),
      lensMat
    );
    lensL.position.set(-0.13, 0.1, 0.34);
    headPivot.add(lensL);
    const lensR = new THREE.Mesh(
      new THREE.TorusGeometry(0.085, 0.018, 8, 18),
      lensMat
    );
    lensR.position.set(0.13, 0.1, 0.34);
    headPivot.add(lensR);
    const bridge = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.018, 0.018),
      lensMat
    );
    bridge.position.set(0, 0.1, 0.34);
    headPivot.add(bridge);
  } else if (accessory === "bowtie") {
    const bowMat = new THREE.MeshStandardMaterial({
      color: pickAccessoryColor("bowtie"),
      roughness: 0.6,
    });
    const bowL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.06), bowMat);
    bowL.position.set(-0.07, 0.42, 0.27);
    bowL.rotation.z = -0.3;
    root.add(bowL);
    const bowR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.06), bowMat);
    bowR.position.set(0.07, 0.42, 0.27);
    bowR.rotation.z = 0.3;
    root.add(bowR);
    const knot = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 0.07), bowMat);
    knot.position.set(0, 0.42, 0.29);
    root.add(knot);
  }

  return {
    root,
    body,
    headPivot,
    leftArmPivot,
    rightArmPivot,
    eyeL,
    eyeR,
    pupilL,
    pupilR,
    mouth,
    bodyMat,
    bellyMat,
    seed: 0,
    blinkOffset: 0,
    bobOffset: 0,
  };
}

const ACCESSORY_PALETTE: Record<string, number[]> = {
  scarf: [0xff5b6b, 0x5cd5ff, 0xfdc73a, 0x7df18a, 0xc792ff, 0xff8a3c],
  bowtie: [0xff5b6b, 0xfdc73a, 0x6c8bff, 0x33c08a, 0xc792ff],
};

function pickAccessoryColor(kind: keyof typeof ACCESSORY_PALETTE): number {
  const arr = ACCESSORY_PALETTE[kind] ?? [0xffffff];
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomAccessory(seed: number): LumerState["accessory"] {
  // Deterministic-ish from seed so it doesn't change every render.
  const opts: Array<LumerState["accessory"]> = [
    "scarf",
    "scarf",
    "cap",
    "glasses",
    "bowtie",
    "none",
    "none",
  ];
  return opts[seed % opts.length];
}

// ---------------------------------------------------------------------------
// Chair geometry (a simple wooden chair with seat, back, and 4 legs).
// ---------------------------------------------------------------------------

function buildChair(): THREE.Group {
  const g = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x5b3a1f,
    roughness: 0.85,
  });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.1, 0.95), woodMat);
  seat.position.y = 0.42;
  seat.receiveShadow = true;
  seat.castShadow = true;
  g.add(seat);

  const back = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.05, 0.1), woodMat);
  back.position.set(0, 0.95, -0.42);
  back.castShadow = true;
  g.add(back);

  const legGeom = new THREE.BoxGeometry(0.09, 0.42, 0.09);
  const legPos: Array<[number, number]> = [
    [-0.4, -0.4],
    [0.4, -0.4],
    [-0.4, 0.4],
    [0.4, 0.4],
  ];
  legPos.forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeom, woodMat);
    leg.position.set(x, 0.21, z);
    g.add(leg);
  });

  return g;
}
