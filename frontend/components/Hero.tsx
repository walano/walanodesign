"use client";

import { useRef, useEffect, useState, Suspense, Component, ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useI18n } from "@/lib/i18n";
import { heroVel } from "@/lib/heroVelocity";
import { scrollTo } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

const COLOR_VIOLET = new THREE.Color("#855c9d");
const COLOR_BLACK  = new THREE.Color("#0c0c0c");
const COLOR_WHITE  = new THREE.Color("#ffffff");

/* ─── Animated lights ───────────────────────────────────────── */
function SceneLights({ colorProgress }: { colorProgress: React.MutableRefObject<number> }) {
  const ambientRef     = useRef<THREE.AmbientLight>(null);
  const directionalRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    const p = colorProgress.current;
    const c = new THREE.Color();
    c.lerpColors(COLOR_WHITE, COLOR_VIOLET, p);
    if (ambientRef.current)     ambientRef.current.color.copy(c);
    if (directionalRef.current) directionalRef.current.color.copy(c);
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={1.5} />
      <directionalLight ref={directionalRef} position={[5, 5, 10]} intensity={2.5} />
      <pointLight position={[-5, 5, 5]} color="#855c9d" intensity={3} distance={50} />
    </>
  );
}

/* ─── RoomEnvironment setup ─────────────────────────────────── */
function SceneEnv() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
  }, [gl, scene]);
  return null;
}

/* ─── 3D Logo ────────────────────────────────────────────────── */
function LogoModel({
  colorProgress,
}: {
  colorProgress: React.MutableRefObject<number>;
}) {
  const { scene } = useGLTF("/logo.gltf");
  const groupRef  = useRef<THREE.Group>(null);
  const matRef    = useRef<THREE.MeshStandardMaterial | null>(null);
  const scaleRef  = useRef(window.innerWidth <= 768 ? 2.0 : 2.0);

  useEffect(() => {
    const onResize = () => {
      scaleRef.current = window.innerWidth <= 768 ? 2.0 : 2.0;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const mat = new THREE.MeshStandardMaterial({
      color:           new THREE.Color("#855c9d"),
      metalness:       0.85,
      roughness:       0.12,
      envMapIntensity: 2.2,
    });
    matRef.current = mat;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) (child as THREE.Mesh).material = mat;
    });
    const box = new THREE.Box3().setFromObject(scene);
    scene.position.sub(box.getCenter(new THREE.Vector3()));
  }, [scene]);

  useFrame(() => {
    if (!groupRef.current || !matRef.current) return;

    groupRef.current.rotation.y += heroVel.x;
    groupRef.current.rotation.x += heroVel.y;

    if (!heroVel.dragging) {
      heroVel.x *= 0.97;
      heroVel.y *= 0.97;
      if (Math.abs(heroVel.x) < 0.0001) {
        groupRef.current.rotation.y += 0.005;
      }
    }

    groupRef.current.scale.setScalar(scaleRef.current);

    const c = new THREE.Color();
    c.lerpColors(COLOR_VIOLET, COLOR_BLACK, colorProgress.current);
    matRef.current.color.copy(c);
    matRef.current.metalness       = THREE.MathUtils.lerp(0.85, 0.3, colorProgress.current);
    matRef.current.envMapIntensity = THREE.MathUtils.lerp(2.2, 1.0, colorProgress.current);
  });

  return <group ref={groupRef}><primitive object={scene} /></group>;
}

/* ─── Hero Section ───────────────────────────────────────────── */
class CanvasErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return null; // silently hide the 3D logo, page stays alive
    return this.props.children;
  }
}

export default function Hero() {
  const { t } = useI18n();
  const topRef        = useRef<HTMLDivElement>(null);
  const colorProgress = useRef(0);

  // Lock hero height to initial innerHeight so mobile browser chrome
  // showing/hiding while scrolling doesn't resize the canvas and pop the logo
  const [heroHeight, setHeroHeight] = useState("100svh");
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    setHeroHeight(`${window.innerHeight}px`);
  }, []);

  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 40) setScrolled(true); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Drag state
  const prevMouse   = useRef({ x: 0, y: 0 });
  const canvasWrap  = useRef<HTMLDivElement>(null);
  const [grabbing, setGrabbing] = useState(false);

  // Global mouseup / touchend so release works outside the canvas
  useEffect(() => {
    const onUp = () => { heroVel.dragging = false; setGrabbing(false); };
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("touchend",  onUp);
    return () => {
      window.removeEventListener("mouseup",  onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  // Non-passive touchmove on the canvas wrapper — prevents page scroll while dragging
  useEffect(() => {
    const el = canvasWrap.current;
    if (!el) return;
    const onTouchMovePassive = (e: TouchEvent) => {
      if (heroVel.dragging) e.preventDefault();
    };
    el.addEventListener("touchmove", onTouchMovePassive, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMovePassive);
  }, []);

  useEffect(() => {
    const el = topRef.current;
    if (!el) return;

    gsap.timeline({ delay: 0.2 }).fromTo(
      el.querySelectorAll("[data-anim]"),
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" }
    );

    ScrollTrigger.create({
      trigger: "#services",
      start: "top bottom",
      end: "top center",
      onUpdate: (self) => { colorProgress.current = self.progress; },
    });

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  /* ── Drag handlers ── */
  const onMouseDown = (e: React.MouseEvent) => {
    heroVel.dragging = true;
    setGrabbing(true);
    prevMouse.current = { x: e.clientX, y: e.clientY };
    heroVel.x = 0;
    heroVel.y = 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!heroVel.dragging) return;
    heroVel.x = (e.clientX - prevMouse.current.x) * 0.012;
    heroVel.y = (e.clientY - prevMouse.current.y) * 0.012;
    prevMouse.current = { x: e.clientX, y: e.clientY };
  };
  const onTouchStart = (e: React.TouchEvent) => {
    heroVel.dragging = true;
    prevMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    heroVel.x = 0;
    heroVel.y = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!heroVel.dragging) return;
    heroVel.x = (e.touches[0].clientX - prevMouse.current.x) * 0.012;
    heroVel.y = (e.touches[0].clientY - prevMouse.current.y) * 0.012;
    prevMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const NAV_LINKS = [
    { key: "services",  href: "#services"  },
    { key: "portfolio", href: "/portfolio" },
    { key: "blog",      href: "/blog"      },
    { key: "about",     href: "#about"     },
  ];

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{
        height:        heroHeight,
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
      }}
    >
      {/* ── Top: title · nav · tagline · CTAs ───────────────── */}
      <div
        ref={topRef}
        style={{
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          paddingTop:    "clamp(2rem, 5vw, 4rem)",
          gap:           "clamp(0.6rem, 1.5vh, 1.2rem)",
          zIndex:        3,
          textAlign:     "center",
        }}
      >
        {/* Brand title */}
        <h1
          data-anim
          className="select-none whitespace-nowrap"
          style={{
            fontFamily: "austin-pen, cursive",
            fontSize:   "clamp(2.5rem, 8vw, 6.5rem)",
            color:      "var(--white)",
            lineHeight: 1,
          }}
        >
          walano des<span style={{ marginRight: "-0.05em" }}>i</span>gn
          <span className="sr-only"> — graphiste freelance, covers, logos & identités visuelles</span>
        </h1>

        {/* Nav */}
        <nav data-anim style={{ display: "flex", alignItems: "center" }}>
          {NAV_LINKS.map(({ key, href }, i) => (
            <span key={key} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && (
                <span style={{
                  margin:   "0 clamp(0.8rem, 2vw, 1.8rem)",
                  color:    "transparent",
                  fontSize: "0.7rem",
                }}>|</span>
              )}
              <a
                href={href}
                style={{
                  fontFamily:     "Inter, sans-serif",
                  fontWeight:     500,
                  fontSize:       "clamp(0.7rem, 1vw, 0.9rem)",
                  color:          "var(--white)",
                  transition:     "color 0.3s",
                  letterSpacing:  "0.04em",
                  textDecoration: "none",
                  cursor:         "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--violet)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--white)")}
                onClick={(e) => { if (href.startsWith("/")) return; e.preventDefault(); scrollTo(href); }}
              >
                {t(`nav.${key}`)}
              </a>
            </span>
          ))}
        </nav>

        {/* Tagline */}
        <div
          data-anim
          style={{
            fontFamily:    "Inter, sans-serif",
            fontWeight:    350,
            fontSize:      "clamp(1.4rem, 3vw, 2.5rem)",
            color:         "var(--white)",
            lineHeight:    0.8,
            textAlign:     "center",
            marginTop:     "clamp(0.5rem, 1.5vh, 1rem)",
            letterSpacing: "-0.1rem",
            paddingTop:    "2.5rem",
            paddingBottom: "1.5rem",
            scale:         "150%",
          }}
        >
          <span>
            {t("hero.tagline_l1")}
            <em style={{
              fontFamily:    "source-serif-pro, serif",
              fontStyle:     "italic",
              fontWeight:    900,
              fontSize:      "115%",
              letterSpacing: "-0.04em",
              color:         "var(--violet)",
            }}>{t("hero.tagline_w1")}</em>
          </span>
          <br />
          <span>
            {t("hero.tagline_l2")}
            <em style={{
              fontFamily:    "source-serif-pro, serif",
              fontStyle:     "italic",
              fontWeight:    900,
              fontSize:      "115%",
              letterSpacing: "-0.04em",
              color:         "var(--violet)",
            }}>{t("hero.tagline_w2")}</em>
            .
          </span>
        </div>

        {/* CTAs */}
        <div
          data-anim
          style={{
            display:        "flex",
            gap:            "clamp(0.5rem, 1.5vw, 1rem)",
            flexWrap:       "wrap",
            justifyContent: "center",
            marginTop:      "clamp(0.4rem, 1vh, 0.8rem)",
          }}
        >
          <a
            href="/contact"
            style={{
              fontFamily:          "Inter, sans-serif",
              fontWeight:          600,
              fontSize:            "clamp(0.72rem, 0.95vw, 1rem)",
              padding:             "0.75rem clamp(1rem, 2.5vw, 1.8rem)",
              borderRadius:        "0",
              backgroundColor:     "rgba(255, 255, 255, 0.08)",
              backdropFilter:      "blur(20px) saturate(180%)",
              WebkitBackdropFilter:"blur(20px) saturate(180%)",
              border:              "1px solid rgba(255, 255, 255, 0.18)",
              color:               "var(--white)",
              transition:          "all 0.3s",
              letterSpacing:       "0.04em",
              textDecoration:      "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
            }}
          >
            {t("hero.contact")}
          </a>
          <a
            href="/devis"
            style={{
              fontFamily:          "Inter, sans-serif",
              fontWeight:          600,
              fontSize:            "clamp(0.72rem, 0.95vw, 1rem)",
              padding:             "0.75rem clamp(1rem, 2.5vw, 1.8rem)",
              borderRadius:        "0",
              backgroundColor:     "rgba(133, 92, 157, 0.3)",
              backdropFilter:      "blur(20px) saturate(180%)",
              WebkitBackdropFilter:"blur(20px) saturate(180%)",
              border:              "1px solid rgba(133, 92, 157, 0.5)",
              color:               "var(--white)",
              transition:          "all 0.3s",
              letterSpacing:       "0.04em",
              textDecoration:      "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(133, 92, 157, 0.5)";
              e.currentTarget.style.borderColor = "rgba(133, 92, 157, 0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(133, 92, 157, 0.3)";
              e.currentTarget.style.borderColor = "rgba(133, 92, 157, 0.5)";
            }}
            onClick={undefined}
          >
            {t("hero.estimate")}
          </a>
        </div>
      </div>

      {/* ── Scroll indicator — outside canvas so touch scrolls, not drags ── */}
      <style>{`
        @keyframes swipeBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }
      `}</style>
      <div
        className="md:hidden"
        style={{
          position:      "absolute",
          bottom:        0,
          left:          0,
          right:         0,
          zIndex:        10,
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          gap:           "0.3rem",
          paddingBottom: "1.25rem",
          paddingTop:    "2rem",
          opacity:       scrolled ? 0 : 1,
          transition:    "opacity 0.6s ease",
        }}
      >
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ animation: "swipeBounce 1.4s ease-in-out infinite" }}
        >
          <path
            d="M3 10l5-5 5 5"
            stroke="rgba(245,243,247,0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          style={{
            fontFamily:    "Inter, sans-serif",
            fontSize:      "0.6rem",
            letterSpacing: "0.12em",
            color:         "rgba(245,243,247,0.4)",
            textTransform: "lowercase",
          }}
        >
          {t("hero.swipe_up")}
        </span>
      </div>

      {/* ── Bottom: 3D logo — fills remaining space ──────────── */}
      <div
        ref={canvasWrap}
        style={{
          flex:      1,
          width:     "100%",
          position:  "relative",
          zIndex:    2,
          cursor:    grabbing ? "grabbing" : "grab",
          minHeight: 0,
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        <CanvasErrorBoundary>
          <Canvas
            camera={{ position: [0, 0, 4.5], fov: 75 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
            style={{ width: "100%", height: "100%" }}
            onCreated={({ gl }) => {
              gl.toneMapping         = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.2;
              gl.outputColorSpace    = THREE.SRGBColorSpace;
            }}
          >
            <SceneLights colorProgress={colorProgress} />
            <Suspense fallback={null}>
              <LogoModel colorProgress={colorProgress} />
              <SceneEnv />
            </Suspense>
          </Canvas>
        </CanvasErrorBoundary>
      </div>
    </section>
  );
}
