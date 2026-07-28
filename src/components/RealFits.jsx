import { useEffect, useRef, useState } from "react";
import { getHomepage, urlFor } from "../../tees-and-steeze/settings/src/lib/sanity";

function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.unobserve(e.target); }
    }, { threshold });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function UGCPhoto({ image, handle, index }) {
  const [hovered, setHovered] = useState(false);
  const [ref, visible] = useReveal(0.05);

  /* alternate aspect ratios for visual variety */
  const aspects = ["3/4", "1/1", "3/4", "1/1", "3/4", "3/4"];
  const aspect = aspects[index % aspects.length];

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
        aspectRatio: aspect,
        background: "var(--color-surface)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 450ms ease ${index * 50}ms, transform 450ms ease ${index * 50}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={image}
        alt={handle ? `@${handle} wearing Tee's & Steeze` : "Customer wearing Tee's & Steeze"}
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: hovered ? "scale(1.05)" : "scale(1)",
          transition: "transform 500ms cubic-bezier(0.16,1,0.3,1)",
        }}
      />

      {/* Caption on hover */}
      {handle && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "1rem",
            background: "linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 100%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 200ms ease",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--color-bone)",
              letterSpacing: "0.02em",
            }}
          >
            @{handle}
          </span>
        </div>
      )}
    </div>
  );
}

const FALLBACK_IMAGES = Array(6).fill("/hero.jpg");

export default function RealFits() {
  const [images, setImages] = useState([]);
  const [headline, setHeadline] = useState("Real people. Real steeze.");
  const [subheadline, setSubheadline] = useState("Worn by those who move different.");
  const [ref, visible] = useReveal(0.05);

  useEffect(() => {
    getHomepage()
      .then((data) => {
        if (data?.ugcImages?.length) {
          setImages(
            data.ugcImages.map((img) => ({
              url: urlFor(img.image).width(600).quality(80).url(),
              handle: img.handle || null,
            }))
          );
        } else {
          setImages(FALLBACK_IMAGES.map((u) => ({ url: u, handle: null })));
        }
        if (data?.ugcHeadline) setHeadline(data.ugcHeadline);
        if (data?.ugcSubheadline) setSubheadline(data.ugcSubheadline);
      })
      .catch(() => {
        setImages(FALLBACK_IMAGES.map((u) => ({ url: u, handle: null })));
      });
  }, []);

  if (!images.length) return null;

  return (
    <section
      ref={ref}
      aria-label="Customer photos"
      style={{
        borderTop: "1px solid var(--color-border)",
        paddingTop: "clamp(4rem, 7vw, 6rem)",
        paddingBottom: "clamp(4rem, 7vw, 6rem)",
      }}
    >
      <div className="container">
        {/* Header */}
        <div
          style={{
            marginBottom: "2.5rem",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 500ms ease, transform 500ms ease",
          }}
        >
          <div className="section-eyebrow">
            <span className="section-eyebrow-label">Community</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", marginTop: "0.5rem" }}>
            <h2 className="display-sm">{headline}</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-stone)", marginBottom: "0.25rem", whiteSpace: "nowrap" }}>
              {subheadline}
            </p>
          </div>
        </div>

        {/* Grid — 3 col, staggered heights via aspect-ratio */}
        <div
          className="[--cols:2] sm:[--cols:3]"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(var(--cols, 2), 1fr)",
            gap: "1px",
            background: "var(--color-border)",
          }}
        >
          {images.slice(0, 6).map((img, i) => (
            <div key={i} style={{ background: "var(--color-void)" }}>
              <UGCPhoto image={img.url} handle={img.handle} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
