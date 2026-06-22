import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/* ─── Easing tokens (match design system) ─── */
const EXPO = [0.16, 1, 0.3, 1];

/* ─── Stagger container variant ─── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EXPO } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
};

/* ─── Glitch digit component ─── */
function GlitchDigit({ char }) {
  return (
    <span className="relative inline-block select-none">
      {/* Base */}
      <span
        className="relative z-10 animate-flicker"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "clamp(7rem, 20vw, 16rem)",
          lineHeight: 0.88,
          letterSpacing: "-0.04em",
          color: "var(--color-bone)",
          textTransform: "uppercase",
        }}
      >
        {char}
      </span>
      {/* Glitch layer 1 — pink */}
      <span
        aria-hidden
        className="glitch-layer-1 pointer-events-none absolute inset-0"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "clamp(7rem, 20vw, 16rem)",
          lineHeight: 0.88,
          letterSpacing: "-0.04em",
          textTransform: "uppercase",
        }}
      >
        {char}
      </span>
      {/* Glitch layer 2 — green */}
      <span
        aria-hidden
        className="glitch-layer-2 pointer-events-none absolute inset-0"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "clamp(7rem, 20vw, 16rem)",
          lineHeight: 0.88,
          letterSpacing: "-0.04em",
          textTransform: "uppercase",
          mixBlendMode: "screen",
        }}
      >
        {char}
      </span>
    </span>
  );
}

/* ─── Floating T-shirt SVG with mouse parallax ─── */
function FloatingTee({ mouseX, mouseY }) {
  const rotateX = useSpring(
    useTransform(useMotionValue(mouseY), [-1, 1], [8, -8]),
    { stiffness: 80, damping: 20 }
  );
  const rotateY = useSpring(
    useTransform(useMotionValue(mouseX), [-1, 1], [-10, 10]),
    { stiffness: 80, damping: 20 }
  );

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      <svg
        width="340"
        height="380"
        viewBox="0 0 340 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
        style={{ filter: "drop-shadow(0 32px 64px rgba(232,75,138,0.18))" }}
      >
        <defs>
          <linearGradient id="teeBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1C1C1C" />
            <stop offset="100%" stopColor="#111111" />
          </linearGradient>
          <linearGradient id="teeSleeve" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#181818" />
            <stop offset="100%" stopColor="#141414" />
          </linearGradient>
          <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E84B8A" />
            <stop offset="100%" stopColor="#D13A75" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE47" />
            <stop offset="100%" stopColor="#38c435" />
          </linearGradient>
          <filter
            id="innerShadow"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
          >
            <feOffset dx="0" dy="2" />
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite
              in2="SourceGraphic"
              operator="arithmetic"
              k2="-1"
              k3="1"
              result="shadow"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0"
              in="shadow"
            />
          </filter>
          <filter id="pinkGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Body shadow ── */}
        <ellipse cx="170" cy="368" rx="95" ry="10" fill="black" opacity="0.35" />

        {/* ── Left sleeve ── */}
        <path
          d="M60 72 L18 148 L90 162 L100 106 Z"
          fill="url(#teeSleeve)"
          stroke="#2A2A2A"
          strokeWidth="1.5"
        />
        {/* Left sleeve highlight */}
        <path d="M60 72 L18 148" stroke="#222" strokeWidth="1" opacity="0.6" />

        {/* ── Right sleeve ── */}
        <path
          d="M280 72 L322 148 L250 162 L240 106 Z"
          fill="url(#teeSleeve)"
          stroke="#2A2A2A"
          strokeWidth="1.5"
        />

        {/* ── Main body ── */}
        <path
          d="M100 72 L100 355 L240 355 L240 72 L240 106 L250 162 L90 162 L100 106 Z"
          fill="url(#teeBody)"
          stroke="#2A2A2A"
          strokeWidth="1.5"
        />

        {/* Collar arc */}
        <path
          d="M118 72 Q170 110 222 72"
          fill="none"
          stroke="#232323"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Collar inner */}
        <path
          d="M126 72 Q170 102 214 72"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Shoulder seam lines */}
        <line
          x1="100"
          y1="106"
          x2="118"
          y2="72"
          stroke="#222"
          strokeWidth="1"
          opacity="0.7"
        />
        <line
          x1="240"
          y1="106"
          x2="222"
          y2="72"
          stroke="#222"
          strokeWidth="1"
          opacity="0.7"
        />

        {/* Side seams */}
        <line
          x1="100"
          y1="162"
          x2="100"
          y2="355"
          stroke="#222"
          strokeWidth="1"
          opacity="0.4"
        />
        <line
          x1="240"
          y1="162"
          x2="240"
          y2="355"
          stroke="#222"
          strokeWidth="1"
          opacity="0.4"
        />

        {/* Bottom hem */}
        <line
          x1="100"
          y1="347"
          x2="240"
          y2="347"
          stroke="#222"
          strokeWidth="2"
          opacity="0.6"
        />

        {/* ── Chest graphic: 404 ── */}
        <text
          x="170"
          y="218"
          textAnchor="middle"
          fill="url(#pinkGrad)"
          fontSize="64"
          fontWeight="700"
          letterSpacing="-2"
          filter="url(#pinkGlow)"
          style={{ fontFamily: "var(--font-display)" }}
        >
          404
        </text>

        {/* Divider line under 404 */}
        <line
          x1="128"
          y1="234"
          x2="212"
          y2="234"
          stroke="#2A2A2A"
          strokeWidth="1"
        />

        {/* Sub-label */}
        <text
          x="170"
          y="256"
          textAnchor="middle"
          fill="#555555"
          fontSize="9"
          letterSpacing="5"
          style={{
            fontFamily: "var(--font-body)",
            textTransform: "uppercase",
          }}
        >
          PAGE NOT FOUND
        </text>

        {/* Brand mark */}
        <text
          x="170"
          y="310"
          textAnchor="middle"
          fill="#2A2A2A"
          fontSize="8"
          letterSpacing="6"
          style={{
            fontFamily: "var(--font-body)",
            textTransform: "uppercase",
          }}
        >
          TEES &amp; STEEZE
        </text>

        {/* Tag detail — right shoulder */}
        <rect
          x="222"
          y="72"
          width="12"
          height="18"
          rx="1"
          fill="#1a1a1a"
          stroke="#2A2A2A"
          strokeWidth="1"
        />
        <line
          x1="228"
          y1="72"
          x2="228"
          y2="90"
          stroke="#2A2A2A"
          strokeWidth="0.5"
        />

        {/* Pocket detail — left chest */}
        <rect
          x="118"
          y="175"
          width="36"
          height="30"
          rx="0"
          fill="none"
          stroke="#232323"
          strokeWidth="1"
        />
        <line
          x1="118"
          y1="183"
          x2="154"
          y2="183"
          stroke="#1f1f1f"
          strokeWidth="0.75"
        />

        {/* Pink accent dot */}
        <circle
          cx="136"
          cy="179"
          r="2.5"
          fill="url(#pinkGrad)"
          opacity="0.8"
        />

        {/* Green accent tag corner */}
        <rect
          x="96"
          y="155"
          width="8"
          height="14"
          rx="1"
          fill="url(#greenGrad)"
          opacity="0.7"
        />
      </svg>
    </motion.div>
  );
}

/* ─── Noise canvas overlay ─── */
function NoiseOverlay() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let id;
    const tick = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const img = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 10;
      }
      ctx.putImageData(img, 0, 0);
      id = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-50 opacity-60 mix-blend-overlay"
    />
  );
}

/* ─── Marquee ticker ─── */
const TICKER_ITEMS = [
  "TEES & STEEZE",
  "404",
  "PAGE NOT FOUND",
  "DRIP NOT FOUND",
  "THE FIT DON'T LIE",
  "STEEZE FOREVER",
];

function Ticker() {
  const repeated = [
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
  ];
  return (
    <div
      className="overflow-hidden border-t border-b"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="animate-marquee flex py-3">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="caption mx-6 shrink-0 flex items-center gap-6"
          >
            {item}
            <span
              className="inline-block h-1 w-1 shrink-0"
              style={{
                background:
                  i % 2 === 0
                    ? "var(--color-steeze-pink)"
                    : "var(--color-stone)",
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Cursor follower ─── */
function CursorFollower({ mouseX, mouseY }) {
  const springX = useSpring(mouseX, { stiffness: 120, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 18 });
  return (
    <motion.div
      className="pointer-events-none fixed z-40 rounded-none"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        width: 32,
        height: 32,
        border: "1px solid",
        borderColor: "var(--color-steeze-pink)",
        opacity: 0.7,
        mixBlendMode: "difference",
      }}
    />
  );
}

/* ─── Grid lines background ─── */
function GridLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.035]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 80 0 L 0 0 0 80"
            fill="none"
            stroke="#F5F4F0"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

/* ─── Main 404 Page ─── */
export default function App() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [normalised, setNormalised] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
      setNormalised({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--color-void)", color: "var(--color-bone)" }}
    >
      <NoiseOverlay />
      <CursorFollower mouseX={mouse.x} mouseY={mouse.y} />

      {/* Background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <GridLines />

        {/* Pink ambient glow — top left */}
        <div
          className="absolute -left-64 -top-64 h-[600px] w-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,75,138,0.12) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
        {/* Green ambient — bottom right */}
        <div
          className="absolute -bottom-48 -right-48 h-[500px] w-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(74,222,71,0.07) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />

        {/* Vertical rule lines */}
        <div
          className="absolute left-[calc(50%-640px)] top-0 h-full w-px opacity-20"
          style={{ background: "var(--color-border)" }}
        />
        <div
          className="absolute right-[calc(50%-640px)] top-0 h-full w-px opacity-20"
          style={{ background: "var(--color-border)" }}
        />
      </div>

      {/* ── NAVBAR ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EXPO }}
        className="container relative z-20 flex items-center justify-between py-6"
      >
        {/* Logo */}
        <a
          href="https://www.teesandsteeze.com"
          className="flex items-center gap-3 group"
          style={{ textDecoration: "none" }}
        >
          {/* Wordmark */}
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "1.1rem",
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              color: "var(--color-bone)",
            }}
          >
            Tees &amp; Steeze
          </span>
          {/* Pink dot accent */}
          <span
            className="inline-block h-1.5 w-1.5"
            style={{ background: "var(--color-steeze-pink)" }}
          />
        </a>

        {/* Nav items */}
        <nav className="hidden items-center gap-8 md:flex">
          {["Shop", "Drops", "About"].map((item) => (
            <a
              key={item}
              href="https://www.teesandsteeze.com"
              className="caption transition-colors"
              style={{ color: "var(--color-dim)", textDecoration: "none" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-bone)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-dim)")
              }
            >
              {item}
            </a>
          ))}
        </nav>
      </motion.header>

      {/* ── HERO CONTENT ── */}
      <main className="container relative z-10">
        <div className="flex min-h-[calc(100vh-88px)] flex-col items-center justify-center gap-0 py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-16">

          {/* ── LEFT: Text block ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
            style={{ maxWidth: 560 }}
          >
            {/* Error badge */}
            <motion.div variants={fadeUp} className="mb-8 flex items-center gap-3">
              <span
                className="h-px w-8"
                style={{ background: "var(--color-steeze-pink)" }}
              />
              <span
                className="caption"
                style={{ color: "var(--color-steeze-pink)" }}
              >
                Error 404
              </span>
            </motion.div>

            {/* Giant 404 glitch numerals */}
            <motion.div
              variants={fadeUp}
              className="mb-6 flex items-baseline gap-1 leading-none"
            >
              <GlitchDigit char="4" />
              <GlitchDigit char="0" />
              <GlitchDigit char="4" />
            </motion.div>

            {/* Main headline */}
            <motion.h1
              variants={fadeUp}
              className="display-sm mb-4"
              style={{ color: "var(--color-bone)" }}
            >
              Drip Not Found.
            </motion.h1>

            {/* Sub-copy */}
            <motion.p
              variants={fadeUp}
              className="body-lg mb-10"
              style={{ maxWidth: 420 }}
            >
              This page went missing — pulled a fast fade like a limited drop.{" "}
              <br className="hidden md:block" />
              Your steeze, however, is still very much alive.
            </motion.p>

            {/* CTA row */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-4"
            >
              <motion.a
                href="https://www.teesandsteeze.com"
                className="btn-primary flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                Shop the Collection
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 7h12M8 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.a>

              <motion.button
                onClick={() => window.history.back()}
                className="btn-secondary flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M13 7H1M6 11L2 7l4-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Go Back
              </motion.button>
            </motion.div>

            {/* Metadata strip */}
            <motion.div
              variants={fadeUp}
              className="mt-14 flex items-center gap-5"
            >
              {[
                { label: "Steeze Level", value: "∞" },
                { label: "Fits Found", value: "0" },
                { label: "Drip Status", value: "Active" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="caption">{stat.label}</span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      letterSpacing: "-0.02em",
                      color:
                        i === 1
                          ? "var(--color-steeze-pink)"
                          : "var(--color-bone)",
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Floating T-shirt ── */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: EXPO, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Orbit ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 380,
                height: 380,
                border: "1px solid",
                borderColor: "rgba(42,42,42,0.8)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            >
              {/* Orbit dot */}
              <motion.div
                className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3"
                style={{ background: "var(--color-steeze-pink)" }}
              />
            </motion.div>

            {/* Outer ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 460,
                height: 460,
                border: "1px dashed",
                borderColor: "rgba(42,42,42,0.4)",
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
            >
              {/* Green dot on outer ring */}
              <motion.div
                className="absolute top-6 right-6 h-2 w-2"
                style={{ background: "var(--color-steeze-green)" }}
              />
            </motion.div>

            {/* T-shirt */}
            <FloatingTee mouseX={normalised.x} mouseY={normalised.y} />

            {/* Corner brackets */}
            {[
              "top-0 left-0 border-t border-l",
              "top-0 right-0 border-t border-r",
              "bottom-0 left-0 border-b border-l",
              "bottom-0 right-0 border-b border-r",
            ].map((cls, i) => (
              <motion.div
                key={i}
                className={`absolute h-6 w-6 ${cls}`}
                style={{ borderColor: "var(--color-border)" }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.6 + i * 0.07,
                  ease: EXPO,
                }}
              />
            ))}
          </motion.div>
        </div>
      </main>

      {/* ── TICKER ── */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        className="relative z-10"
        style={{ transitionDelay: "0.8s" }}
      >
        <Ticker />
      </motion.div>

      {/* ── FOOTER ── */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="container relative z-10 flex flex-col items-center justify-between gap-4 py-8 sm:flex-row"
      >
        <span className="caption">
          © 2025 Tees &amp; Steeze. All rights reserved.
        </span>
        <div className="flex items-center gap-6">
          {["Privacy", "Terms", "Contact"].map((item) => (
            <a
              key={item}
              href="https://www.teesandsteeze.com"
              className="caption transition-colors"
              style={{ color: "var(--color-dim)", textDecoration: "none" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-stone)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-dim)")
              }
            >
              {item}
            </a>
          ))}
        </div>
      </motion.footer>

      {/* Scanline sweep */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)",
        }}
      />
    </div>
  );
}