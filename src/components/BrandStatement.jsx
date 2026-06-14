import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getHomepage, urlFor } from "../../tees-and-steeze/settings/src/lib/sanity";

const CulturalPatternDivider = ({ className = "", flip = false }) => (
  <div
    className={`w-full overflow-hidden ${className}`}
    style={{
      height: "64px",
      opacity: 0.45,
      transform: flip ? "scaleY(-1)" : "none",
    }}
  >
    <svg
      width="100%"
      height="48"
      viewBox="0 0 1200 48"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <line x1="0" y1="12" x2="1200" y2="12" stroke="#F5F4F0" strokeWidth="1" />
      <line x1="0" y1="24" x2="1200" y2="24" stroke="#F5F4F0" strokeWidth="1" />
      <line x1="0" y1="36" x2="1200" y2="36" stroke="#F5F4F0" strokeWidth="1" />
      {Array.from({ length: 21 }, (_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 60}
          y1="0"
          x2={i * 60}
          y2="48"
          stroke="#F5F4F0"
          strokeWidth="1"
        />
      ))}
      {[120, 360, 600, 840, 1080].map((cx) => (
        <g key={`circle-${cx}`}>
          <circle cx={cx} cy="24" r="10" stroke="#F5F4F0" strokeWidth="1" />
          <circle cx={cx} cy="24" r="6" stroke="#F5F4F0" strokeWidth="1" />
          <circle cx={cx} cy="24" r="3" fill="#F5F4F0" />
        </g>
      ))}
      {[240, 480, 720, 960].map((cx) => (
        <g key={`diamond-${cx}`}>
          <polygon
            points={`${cx},14 ${cx + 10},24 ${cx},34 ${cx - 10},24`}
            stroke="#F5F4F0"
            strokeWidth="1"
          />
          <polygon
            points={`${cx},18 ${cx + 6},24 ${cx},30 ${cx - 6},24`}
            stroke="#F5F4F0"
            strokeWidth="1"
          />
        </g>
      ))}
    </svg>
  </div>
);

const CulturalImageOverlay = () => (
  <div
    className="absolute inset-0 z-10 pointer-events-none"
    style={{ opacity: 0.3 }}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {Array.from({ length: 16 }, (_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 40}
          x2="400"
          y2={i * 40}
          stroke="#F5F4F0"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 40}
          y1="0"
          x2={i * 40}
          y2="600"
          stroke="#F5F4F0"
          strokeWidth="1"
        />
      ))}
      {[
        [80, 80],
        [200, 160],
        [320, 80],
        [120, 280],
        [280, 320],
        [40, 440],
        [200, 480],
        [360, 400],
        [160, 560],
        [320, 560],
      ].map(([cx, cy], i) => (
        <g key={`motif-${i}`}>
          <circle cx={cx} cy={cy} r="16" stroke="#F5F4F0" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="10" stroke="#F5F4F0" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="4" stroke="#F5F4F0" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="2.5" fill="#F5F4F0" />
        </g>
      ))}
      {Array.from({ length: 8 }, (_, i) => {
        const cy = 40 + i * 70;
        return (
          <g key={`chain-${i}`}>
            <polygon
              points={`200,${cy - 12} 212,${cy} 200,${cy + 12} 188,${cy}`}
              stroke="#F5F4F0"
              strokeWidth="1"
            />
          </g>
        );
      })}
    </svg>
  </div>
);

// Default copy — used before Sanity loads or if fields are empty
const DEFAULTS = {
  headline: "Every piece carries Swag.",
  body: [
    "Tee's and Steeze didn't start as a business plan. It started as a refusal, a refusal to wear what everyone else was wearing, to dress the way the market told us to dress, to build a brand that looked like every other brand.",
    "Three years ago, one idea: make pieces that carry a sense of ease. Not just a print. The steeze, the confidence and energy you feel the moment you put it on. That feeling isn't designed in a boardroom. It's built from conviction.",
  ],
  closing:
    "Every piece has a story. Every fit has a steeze.\nThat's why we're here.",
  image: "/hero.jpg",
};

export default function BrandStatement() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [headline, setHeadline] = useState(DEFAULTS.headline);
  const [bodyParagraphs, setBodyParagraphs] = useState(DEFAULTS.body);
  const [closing, setClosing] = useState(DEFAULTS.closing);
  const [imageUrl, setImageUrl] = useState(DEFAULTS.image);

  useEffect(() => {
    getHomepage()
      .then((data) => {
        if (data) {
          if (data.brandHeadline) setHeadline(data.brandHeadline);
          if (data.brandImage) {
            setImageUrl(
              urlFor(data.brandImage)
                .width(800)
                .quality(85)
                .auto("format")
                .url(),
            );
          }
          if (data.brandBody) {
            // Split on double newlines to get paragraphs
            const parts = data.brandBody.split(/\n\n+/).filter(Boolean);
            if (parts.length > 0) {
              // Last paragraph is the closing (bold text)
              const last = parts[parts.length - 1];
              const rest = parts.slice(0, -1);
              if (rest.length > 0) {
                setBodyParagraphs(rest);
                setClosing(last);
              } else {
                setBodyParagraphs([]);
                setClosing(last);
              }
            }
          }
        }
      })
      .catch((err) => console.error("Failed to load brand statement:", err));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} aria-label="Brand Story">
      <CulturalPatternDivider />

      <div
        className="container"
        style={{
          paddingTop: "clamp(4rem, 8vw, 6rem)",
          paddingBottom: "clamp(4rem, 8vw, 6rem)",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT — Image with cultural overlay */}
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: "3 / 4",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-24px)",
              transition:
                "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <img
              src={imageUrl}
              alt="A person wearing Tee's and Steeze — confidence, not costume"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div
              className="absolute inset-0 z-5 pointer-events-none"
              style={{
                opacity: 0.04,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat",
                backgroundSize: "128px 128px",
              }}
            />

            <CulturalImageOverlay />

            <div
              className="absolute inset-0 z-8 pointer-events-none"
              style={{ boxShadow: "inset 0 0 80px rgba(10, 10, 10, 0.5)" }}
            />
          </div>

          {/* RIGHT — Copy from Sanity */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition:
                "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 700ms cubic-bezier(0.16, 1, 0.3, 1) 200ms",
            }}
          >
            <span
              className="caption"
              style={{
                color: "var(--color-steeze-pink)",
                letterSpacing: "0.12em",
              }}
            >
              The Steeze
            </span>

            <h2 className="display-md mt-4">{headline}</h2>

            <div className="mt-8 space-y-5">
              {bodyParagraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="body-lg"
                  style={{ color: "var(--color-stone)" }}
                >
                  {paragraph}
                </p>
              ))}

              <p
                className="body-lg font-medium"
                style={{ color: "var(--color-bone)" }}
              >
                {closing.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < closing.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>

            <div className="mt-10">
              <Link to="/about" className="link-cta">
                Read the full story →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CulturalPatternDivider flip />
    </section>
  );
}
