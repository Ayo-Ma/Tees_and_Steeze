import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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

const DEFAULTS = {
  brandHeadline: "Three years of steeze.",
  brandBody: "We started making clothes because the ones that existed didn't feel like us.\n\nEvery piece in this collection carries that original conviction — that style should feel like something, not just look like something.",
  brandImage: "/hero.jpg",
};

export default function BrandStatement() {
  const [data, setData] = useState(null);
  const [ref, visible] = useReveal(0.08);

  useEffect(() => {
    getHomepage()
      .then((d) => { if (d) setData(d); })
      .catch(() => {});
  }, []);

  const headline = data?.brandHeadline || DEFAULTS.brandHeadline;
  const rawBody = data?.brandBody || DEFAULTS.brandBody;
  const imageUrl = data?.brandImage
    ? urlFor(data.brandImage).width(900).quality(85).url()
    : DEFAULTS.brandImage;

  const paragraphs = rawBody.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const closing = paragraphs.pop();
  const bodyParagraphs = paragraphs;

  return (
    <section
      ref={ref}
      aria-label="Brand story"
      style={{
        borderTop: "1px solid var(--color-border)",
        paddingTop: "clamp(4rem, 8vw, 7rem)",
        paddingBottom: "clamp(4rem, 8vw, 7rem)",
      }}
    >
      <div className="container">
        {/* Section header */}
        <div
          style={{
            marginBottom: "3rem",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 500ms ease, transform 500ms ease",
          }}
        >
          <div className="section-eyebrow">
            <span className="section-eyebrow-label">The story</span>
          </div>
        </div>

        {/* Two-column: headline + image / copy */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 600ms ease 80ms, transform 600ms ease 80ms",
          }}
          className="lg:grid-cols-2"
        >
          {/* Left: image + headline stacked */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <h2 className="display-md">{headline}</h2>
            <div style={{ position: "relative", overflow: "hidden", aspectRatio: "4 / 5" }}>
              <img
                src={imageUrl}
                alt="Brand story"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {/* Grain texture */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* Right: body copy */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ maxWidth: "520px" }}>
              {bodyParagraphs.map((p, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
                    lineHeight: 1.75,
                    color: "var(--color-stone)",
                    marginBottom: "1.5rem",
                  }}
                >
                  {p}
                </p>
              ))}

              {closing && (
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: "var(--color-bone)",
                    lineHeight: 1.3,
                    marginBottom: "2.5rem",
                    textTransform: "uppercase",
                  }}
                >
                  {closing}
                </p>
              )}

              <Link to="/about" className="btn-secondary" style={{ display: "inline-flex" }}>
                Read the full story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
