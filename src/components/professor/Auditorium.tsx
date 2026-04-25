"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type LumerMood = "idle" | "raise" | "clap" | "nod" | "boo";

export interface LumerState {
  name: string;
  color: string;
  mood: LumerMood;
  /** highlights this lumer (e.g., currently speaking) */
  focused?: boolean;
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
 * Renders a 3D auditorium with cute Lumer characters. No external assets.
 * All geometry is procedural (spheres + cylinders) to keep it lightweight.
 */
export function Auditorium({ lumers, curtain, className }: AuditoriumProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<AuditoriumApi | null>(null);

  // Mount + dispose scene once
  useEffect(() => {
    if (!mountRef.current) return;
    const api = createAuditorium(mountRef.current, lumers.length);
    apiRef.current = api;
    return () => {
      api.dispose();
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

function createAuditorium(container: HTMLDivElement, lumerCount: number): AuditoriumApi {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0b1028");
  scene.fog = new THREE.Fog("#0b1028", 12, 30);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 4.2, 9);
  camera.lookAt(0, 1.8, -2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  // Resize handling
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
  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambient);
  const hemi = new THREE.HemisphereLight(0xfff1c0, 0x302060, 0.45);
  scene.add(hemi);
  const spot = new THREE.SpotLight(0xfff5d6, 1.4, 30, Math.PI / 6, 0.4, 1.2);
  spot.position.set(0, 8, 4);
  spot.target.position.set(0, 1, -2);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  scene.add(spot);
  scene.add(spot.target);
  const fill = new THREE.PointLight(0x4f6df5, 0.7, 20);
  fill.position.set(-3, 3, 4);
  scene.add(fill);

  // Floor
  const floorGeom = new THREE.CircleGeometry(14, 48);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x2a1f4a,
    roughness: 0.9,
    metalness: 0.0,
  });
  const floor = new THREE.Mesh(floorGeom, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  scene.add(floor);

  // Stage (low round platform at back)
  const stageGeom = new THREE.CylinderGeometry(3.2, 3.4, 0.2, 36);
  const stageMat = new THREE.MeshStandardMaterial({
    color: 0x8a5cff,
    roughness: 0.4,
    metalness: 0.2,
    emissive: 0x3a1a8f,
    emissiveIntensity: 0.25,
  });
  const stage = new THREE.Mesh(stageGeom, stageMat);
  stage.position.set(0, 0.1, -3.2);
  stage.receiveShadow = true;
  scene.add(stage);

  // Chalkboard behind stage
  const boardGroup = new THREE.Group();
  const boardMat = new THREE.MeshStandardMaterial({ color: 0x143227, roughness: 0.8 });
  const boardMesh = new THREE.Mesh(new THREE.BoxGeometry(6.5, 2.4, 0.15), boardMat);
  boardMesh.castShadow = true;
  boardGroup.add(boardMesh);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xa07a4c, roughness: 0.6 });
  const frameTop = new THREE.Mesh(new THREE.BoxGeometry(6.9, 0.2, 0.22), frameMat);
  frameTop.position.y = 1.3;
  boardGroup.add(frameTop);
  const frameBottom = new THREE.Mesh(new THREE.BoxGeometry(6.9, 0.2, 0.22), frameMat);
  frameBottom.position.y = -1.3;
  boardGroup.add(frameBottom);
  const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.5, 0.22), frameMat);
  frameLeft.position.x = -3.35;
  boardGroup.add(frameLeft);
  const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.5, 0.22), frameMat);
  frameRight.position.x = 3.35;
  boardGroup.add(frameRight);
  boardGroup.position.set(0, 2.7, -5.4);
  scene.add(boardGroup);

  // Curtain (two red panels that slide to center)
  const curtainMat = new THREE.MeshStandardMaterial({
    color: 0xa31a2e,
    roughness: 0.7,
    metalness: 0.0,
    emissive: 0x3a0a14,
    emissiveIntensity: 0.2,
  });
  const curtainLeft = new THREE.Mesh(new THREE.BoxGeometry(6.5, 7, 0.15), curtainMat);
  curtainLeft.position.set(-9, 3.5, 0.5);
  scene.add(curtainLeft);
  const curtainRight = new THREE.Mesh(new THREE.BoxGeometry(6.5, 7, 0.15), curtainMat);
  curtainRight.position.set(9, 3.5, 0.5);
  scene.add(curtainRight);

  // Generate lumer characters arranged in 2 tiered arcs
  const lumerObjs: LumerObj[] = [];
  const perRow = Math.ceil(lumerCount / 2);
  for (let i = 0; i < lumerCount; i++) {
    const row = Math.floor(i / perRow); // 0 front, 1 back
    const col = i % perRow;
    const frac = (col + 0.5) / perRow;
    const angle = (frac - 0.5) * 1.4; // arc spread
    const radius = 5 + row * 1.4;
    const x = Math.sin(angle) * radius;
    const z = 2 + Math.cos(angle) * 2.5 + row * 1.3;
    const y = row === 1 ? 0.45 : 0;
    const l = buildLumer();
    l.root.position.set(x, y, z);
    l.root.lookAt(0, 1, -2);
    scene.add(l.root);
    lumerObjs.push(l);
  }

  // State for interpolation
  let currentLumers: LumerState[] = [];
  let targetCurtain = 0;
  let currentCurtain = 0;
  const start = performance.now();

  function update(lumers: LumerState[], curtain: number) {
    currentLumers = lumers;
    targetCurtain = Math.max(0, Math.min(1, curtain));
    // Update colors immediately so changes in state reflect
    lumerObjs.forEach((l, i) => {
      const state = lumers[i];
      if (!state) return;
      if (l.bodyMat.color.getHexString() !== colorToHex(state.color)) {
        l.bodyMat.color.set(state.color);
        l.headMat.color.set(state.color);
      }
      const emissive = state.focused ? 0.55 : 0.08;
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
    const offsetL = -9 + 7 * currentCurtain;
    const offsetR = 9 - 7 * currentCurtain;
    curtainLeft.position.x = offsetL;
    curtainRight.position.x = offsetR;

    lumerObjs.forEach((l, i) => {
      const state = currentLumers[i];
      const mood: LumerMood = state?.mood ?? "idle";
      // base idle bob
      const bob = Math.sin(t * 1.6 + i * 0.9) * 0.06;
      l.body.position.y = 0.55 + bob;
      l.head.position.y = 1.15 + bob * 1.1;

      // Arm animations
      let leftArmRot = 0;
      let rightArmRot = 0;
      let headTilt = 0;
      if (mood === "raise") {
        // Right arm up
        rightArmRot = -Math.PI * 0.85 + Math.sin(t * 6) * 0.08;
        leftArmRot = Math.sin(t + i) * 0.1;
      } else if (mood === "clap") {
        const c = Math.sin(t * 10 + i) * 0.35;
        leftArmRot = -Math.PI / 3 + c;
        rightArmRot = -Math.PI / 3 - c;
      } else if (mood === "nod") {
        headTilt = Math.sin(t * 4 + i) * 0.2;
      } else if (mood === "boo") {
        leftArmRot = Math.sin(t * 4 + i) * 0.5 - 0.3;
        rightArmRot = -(Math.sin(t * 4 + i) * 0.5 - 0.3);
      } else {
        leftArmRot = Math.sin(t * 1.2 + i) * 0.1;
        rightArmRot = -Math.sin(t * 1.2 + i) * 0.1;
      }
      l.leftArm.rotation.z = leftArmRot;
      l.rightArm.rotation.z = rightArmRot;
      l.head.rotation.x = headTilt;

      // Focus scale pulse
      const focus = state?.focused ? 1.1 + Math.sin(t * 3) * 0.03 : 1;
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
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
      const mat = (obj as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else if (mat) mat.dispose();
    });
  }

  return { update, dispose };
}

interface LumerObj {
  root: THREE.Group;
  body: THREE.Mesh;
  head: THREE.Mesh;
  leftArm: THREE.Mesh;
  rightArm: THREE.Mesh;
  bodyMat: THREE.MeshStandardMaterial;
  headMat: THREE.MeshStandardMaterial;
}

function buildLumer(): LumerObj {
  const root = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xff9fb0,
    roughness: 0.45,
    metalness: 0.05,
  });
  const headMat = new THREE.MeshStandardMaterial({
    color: 0xff9fb0,
    roughness: 0.45,
    metalness: 0.05,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x221b2e,
    roughness: 0.5,
  });
  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.4,
  });
  const cheekMat = new THREE.MeshStandardMaterial({
    color: 0xff6080,
    roughness: 0.7,
    transparent: true,
    opacity: 0.6,
  });

  // Body: squat capsule via two shapes
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 20), bodyMat);
  body.scale.set(1, 0.85, 1);
  body.position.y = 0.55;
  body.castShadow = true;
  body.receiveShadow = true;
  root.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.48, 24, 20), headMat);
  head.position.y = 1.15;
  head.castShadow = true;
  root.add(head);

  // Ears (small spheres above head to give cuteness)
  const earL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), headMat);
  earL.position.set(-0.32, 1.5, 0.05);
  root.add(earL);
  const earR = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), headMat);
  earR.position.set(0.32, 1.5, 0.05);
  root.add(earR);

  // Eyes (whites + pupils)
  const eyeLw = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 10), whiteMat);
  eyeLw.position.set(-0.16, 1.18, 0.42);
  root.add(eyeLw);
  const eyeRw = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 10), whiteMat);
  eyeRw.position.set(0.16, 1.18, 0.42);
  root.add(eyeRw);
  const eyeLp = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), darkMat);
  eyeLp.position.set(-0.16, 1.18, 0.49);
  root.add(eyeLp);
  const eyeRp = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), darkMat);
  eyeRp.position.set(0.16, 1.18, 0.49);
  root.add(eyeRp);

  // Cheeks
  const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), cheekMat);
  cheekL.position.set(-0.28, 1.06, 0.36);
  root.add(cheekL);
  const cheekR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), cheekMat);
  cheekR.position.set(0.28, 1.06, 0.36);
  root.add(cheekR);

  // Arms: pivot groups so rotation at shoulder works nicely
  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.52, 0.85, 0);
  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.55, 14), bodyMat);
  leftArm.position.set(-0.12, -0.25, 0);
  leftArm.rotation.z = 0;
  leftArm.castShadow = true;
  leftArmPivot.add(leftArm);
  root.add(leftArmPivot);

  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.52, 0.85, 0);
  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.55, 14), bodyMat);
  rightArm.position.set(0.12, -0.25, 0);
  rightArm.castShadow = true;
  rightArmPivot.add(rightArm);
  root.add(rightArmPivot);

  // Expose arm pivots as the rotating handles
  (leftArmPivot as unknown as THREE.Mesh).castShadow = false;
  (rightArmPivot as unknown as THREE.Mesh).castShadow = false;

  return {
    root,
    body,
    head,
    leftArm: leftArmPivot as unknown as THREE.Mesh,
    rightArm: rightArmPivot as unknown as THREE.Mesh,
    bodyMat,
    headMat,
  };
}

function colorToHex(c: string): string {
  const col = new THREE.Color(c);
  return col.getHexString();
}
