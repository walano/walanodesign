"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { heroVel } from "@/lib/heroVelocity";

export default function StarBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene ────────────────────────────────────────────────
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace    = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    scene.background = new THREE.Color("#0c0c0c");

    // ── Main star field ──────────────────────────────────────
    const STAR_COUNT = 2200;
    const starGeo    = new THREE.BufferGeometry();
    const positions  = new Float32Array(STAR_COUNT * 3);

    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 120 + Math.random() * 60;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const starMat = new THREE.PointsMaterial({
      color:           0x855c9d,
      sizeAttenuation: true,
      size:            0.5,
      transparent:     true,
      opacity:         0.85,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ── Larger violet accent stars ───────────────────────────
    const violetGeo = new THREE.BufferGeometry();
    const vpos      = new Float32Array(180 * 3);

    for (let i = 0; i < 180; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 110 + Math.random() * 70;
      vpos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      vpos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      vpos[i * 3 + 2] = r * Math.cos(phi);
    }
    violetGeo.setAttribute("position", new THREE.BufferAttribute(vpos, 3));

    const violetMat = new THREE.PointsMaterial({
      color:           0xb07cc6,
      size:            0.9,
      sizeAttenuation: true,
      transparent:     true,
      opacity:         0.7,
    });
    const violetStars = new THREE.Points(violetGeo, violetMat);
    scene.add(violetStars);

    // ── Render loop ──────────────────────────────────────────
    let rafId: number;

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      starField.rotation.y   += heroVel.x * 0.3;
      starField.rotation.x   += heroVel.y * 0.3;
      violetStars.rotation.y += heroVel.x * 0.25;
      violetStars.rotation.x += heroVel.y * 0.25;

      if (!heroVel.dragging && Math.abs(heroVel.x) < 0.0001) {
        starField.rotation.y   += 0.0005;
        violetStars.rotation.y += 0.0003;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ───────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position:      "fixed",
        inset:         0,
        zIndex:        0,
        pointerEvents: "none",
      }}
    />
  );
}
