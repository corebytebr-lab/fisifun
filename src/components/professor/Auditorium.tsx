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
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
  camera.position.set(0, 3.4, -2.6);
  camera.lookAt(0, 1.8, 7);

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
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.45));
  scene.add(new THREE.HemisphereLight(0xfff1c0, 0x302060, 0.55));

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

  // Walls hint (very subtle far backdrop)
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 12),
    new THREE.MeshStandardMaterial({ color: 0x171036, roughness: 0.9 })
  );
  wall.position.set(0, 6, 14);
  scene.add(wall);

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
    lumer.root.position.set(x, tierY + 0.55, z);
    lumer.root.lookAt(0, tierY + 1.4, -2.6);
    // Per-lumer randomness for natural animation.
    lumer.seed = (i * 137.7) % 1000;
    lumer.blinkOffset = Math.random() * 4 + i * 0.13;
    lumer.bobOffset = Math.random() * Math.PI * 2;
    scene.add(lumer.root);
    lumerObjs.push(lumer);
  }

  // Tier risers (visible "stairs" behind each row to suggest stadium seating).
  for (let r = 1; r < rows; r++) {
    const riserY = r * tierStep - tierStep / 2;
    const riserZ = firstRowZ + r * rowDepth - rowDepth / 2;
    const riser = new THREE.Mesh(
      new THREE.BoxGeometry(cols * colSpacing + 2, tierStep, rowDepth),
      new THREE.MeshStandardMaterial({ color: 0x271a4a, roughness: 0.85 })
    );
    riser.position.set(0, riserY, riserZ);
    riser.receiveShadow = true;
    scene.add(riser);
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
  mouth: THREE.Mesh;
  bodyMat: THREE.MeshStandardMaterial;
  bellyMat: THREE.MeshStandardMaterial;
  seed: number;
  blinkOffset: number;
  bobOffset: number;
}

function buildLumer(accessory: LumerState["accessory"] = "none"): LumerObj {
  const beakMat = new THREE.MeshStandardMaterial({ color: 0xffb74a, roughness: 0.5 });
  const footMat = new THREE.MeshStandardMaterial({ color: 0xffa430, roughness: 0.6 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1330, roughness: 0.5 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
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

  // White belly patch — slightly forward, scaled flat.
  const belly = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 22, 18),
    bellyMat
  );
  belly.scale.set(0.82, 1.05, 0.55);
  belly.position.set(0, -0.05, 0.22);
  root.add(belly);

  // Head pivot — head is the top portion of the body in Pingu, but we use a
  // separate sphere so we can tilt it for confusion / nodding.
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 0.62, 0);
  root.add(headPivot);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 20), bodyMat);
  head.scale.set(1, 0.95, 1);
  head.castShadow = true;
  headPivot.add(head);

  // Beak (small orange cone pointing forward).
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.18, 14), beakMat);
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, -0.02, 0.36);
  headPivot.add(beak);

  // Eyes (white) + pupils (dark) — pupils are children of eyes so blink scales both.
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 10), whiteMat);
  eyeL.position.set(-0.13, 0.1, 0.31);
  eyeL.scale.set(0.95, 1.1, 0.9);
  headPivot.add(eyeL);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 10), whiteMat);
  eyeR.position.set(0.13, 0.1, 0.31);
  eyeR.scale.set(0.95, 1.1, 0.9);
  headPivot.add(eyeR);

  const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 10), darkMat);
  pupilL.position.set(-0.13, 0.1, 0.36);
  headPivot.add(pupilL);
  const pupilR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 10), darkMat);
  pupilR.position.set(0.13, 0.1, 0.36);
  headPivot.add(pupilR);

  // Mouth (small dark patch under the beak; scales Y when talking).
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), darkMat);
  mouth.scale.set(1.4, 0.5, 0.4);
  mouth.position.set(0, -0.12, 0.34);
  headPivot.add(mouth);

  // Cheeks (subtle blush).
  const cheekMat = new THREE.MeshStandardMaterial({
    color: 0xff7e94,
    transparent: true,
    opacity: 0.55,
  });
  const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), cheekMat);
  cheekL.position.set(-0.22, 0.0, 0.26);
  headPivot.add(cheekL);
  const cheekR = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), cheekMat);
  cheekR.position.set(0.22, 0.0, 0.26);
  headPivot.add(cheekR);

  // Flipper arms (pivot groups for shoulder rotation).
  const armGeom = new THREE.SphereGeometry(0.18, 14, 12);
  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.42, 0.34, 0);
  const leftArm = new THREE.Mesh(armGeom, bodyMat);
  leftArm.scale.set(0.55, 1.5, 0.9);
  leftArm.position.set(-0.05, -0.18, 0);
  leftArm.castShadow = true;
  leftArmPivot.add(leftArm);
  root.add(leftArmPivot);

  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.42, 0.34, 0);
  const rightArm = new THREE.Mesh(armGeom, bodyMat);
  rightArm.scale.set(0.55, 1.5, 0.9);
  rightArm.position.set(0.05, -0.18, 0);
  rightArm.castShadow = true;
  rightArmPivot.add(rightArm);
  root.add(rightArmPivot);

  // Feet (orange ovoids at base).
  const footGeom = new THREE.SphereGeometry(0.14, 12, 10);
  const footL = new THREE.Mesh(footGeom, footMat);
  footL.scale.set(1.2, 0.45, 1.6);
  footL.position.set(-0.18, -0.6, 0.18);
  root.add(footL);
  const footR = new THREE.Mesh(footGeom, footMat);
  footR.scale.set(1.2, 0.45, 1.6);
  footR.position.set(0.18, -0.6, 0.18);
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
