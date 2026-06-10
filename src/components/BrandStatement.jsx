import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/*
 * ── CULTURAL PATTERN SVG ──
 * Geometric grid with Adire-inspired circular/diamond motifs overlaid.
 * Used as section dividers and image overlay.
 * Pure SVG — no image files needed.
 */
const CulturalPatternDivider = ({ className = '', flip = false }) => (
  <div
    className={`w-full overflow-hidden ${className}`}
    style={{
      height: '64px',
      opacity: 0.45,
      transform: flip ? 'scaleY(-1)' : 'none',
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
      {/* Horizontal grid lines */}
      <line x1="0" y1="12" x2="1200" y2="12" stroke="#F5F4F0" strokeWidth="1" />
      <line x1="0" y1="24" x2="1200" y2="24" stroke="#F5F4F0" strokeWidth="1" />
      <line x1="0" y1="36" x2="1200" y2="36" stroke="#F5F4F0" strokeWidth="1" />

      {/* Vertical grid — every 60px */}
      {Array.from({ length: 21 }, (_, i) => (
        <line key={`v-${i}`} x1={i * 60} y1="0" x2={i * 60} y2="48" stroke="#F5F4F0" strokeWidth="1" />
      ))}

      {/* Adire-inspired motifs — concentric circles at intersections */}
      {[120, 360, 600, 840, 1080].map((cx) => (
        <g key={`circle-${cx}`}>
          <circle cx={cx} cy="24" r="10" stroke="#F5F4F0" strokeWidth="1" />
          <circle cx={cx} cy="24" r="6" stroke="#F5F4F0" strokeWidth="1" />
          <circle cx={cx} cy="24" r="3" fill="#F5F4F0" />
        </g>
      ))}

      {/* Diamond / rhombus motifs between circles */}
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
)

/*
 * ── CULTURAL PATTERN OVERLAY FOR IMAGE ──
 * Denser version layered on top of the lifestyle photo.
 * Creates the feeling of culture printed onto the image.
 */
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
      {/* Grid */}
      {Array.from({ length: 16 }, (_, i) => (
        <line key={`h-${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} stroke="#F5F4F0" strokeWidth="1" />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <line key={`v-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="600" stroke="#F5F4F0" strokeWidth="1" />
      ))}

      {/* Adire concentric circles — scattered */}
      {[
        [80, 80], [200, 160], [320, 80], [120, 280], [280, 320],
        [40, 440], [200, 480], [360, 400], [160, 560], [320, 560],
      ].map(([cx, cy], i) => (
        <g key={`motif-${i}`}>
          <circle cx={cx} cy={cy} r="16" stroke="#F5F4F0" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="10" stroke="#F5F4F0" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="4" stroke="#F5F4F0" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="2.5" fill="#F5F4F0" />
        </g>
      ))}

      {/* Diamond chain — vertical center */}
      {Array.from({ length: 8 }, (_, i) => {
        const cy = 40 + i * 70
        return (
          <g key={`chain-${i}`}>
            <polygon
              points={`200,${cy - 12} 212,${cy} 200,${cy + 12} 188,${cy}`}
              stroke="#F5F4F0"
              strokeWidth="1"
            />
          </g>
        )
      })}
    </svg>
  </div>
)

export default function BrandStatement() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} aria-label="Brand Story">
      {/* ── TOP DIVIDER — cultural pattern ── */}
      <CulturalPatternDivider />

      <div
        className="container"
        style={{
          paddingTop: 'clamp(4rem, 8vw, 6rem)',
          paddingBottom: 'clamp(4rem, 8vw, 6rem)',
        }}
      >
        {/* ── TWO-COLUMN KULESHOV LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT — The image with cultural overlay */}
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: '3 / 4',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-24px)',
              transition: 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Lifestyle photo — someone wearing the piece expressively */}
            <img
              src="/hero.jpg"
              alt="A person wearing Tee's and Steeze — confidence, not costume"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Grain texture on image */}
            <div
              className="absolute inset-0 z-5 pointer-events-none"
              style={{
                opacity: 0.04,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
                backgroundSize: '128px 128px',
              }}
            />

            {/* Cultural pattern overlay on image */}
            <CulturalImageOverlay />

            {/* Subtle dark edge vignette */}
            <div
              className="absolute inset-0 z-8 pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 80px rgba(10, 10, 10, 0.5)',
              }}
            />
          </div>

          {/* RIGHT — The copy */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 700ms cubic-bezier(0.16, 1, 0.3, 1) 200ms',
            }}
          >
            {/* Section label */}
            <span
              className="caption"
              style={{ color: 'var(--color-steeze-pink)', letterSpacing: '0.12em' }}
            >
              The Steeze
            </span>

            {/* Headline */}
            <h2 className="display-md mt-4">
              Every piece carries something.
            </h2>

            {/* Body — refusal → idea → conviction */}
            <div className="mt-8 space-y-5">
              <p className="body-lg" style={{ color: 'var(--color-stone)' }}>
                Tee's and Steeze didn't start as a business plan. It started as a
                refusal — a refusal to wear what everyone else was wearing, to dress
                the way the market told us to dress, to build a brand that looked
                like every other brand.
              </p>

              <p className="body-lg" style={{ color: 'var(--color-stone)' }}>
                Three years ago, one idea: make pieces that carry something. Not
                just fabric. Not just a print. The steeze — the confidence and
                energy you feel the moment you put it on. That feeling isn't
                designed in a boardroom. It's built from conviction.
              </p>

              <p
                className="body-lg font-medium"
                style={{ color: 'var(--color-bone)' }}
              >
                Every piece has a story. Every fit has a steeze.
                <br />
                That's why we're here.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-10">
              <Link to="/about" className="link-cta">
                Read the full story →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM DIVIDER — cultural pattern (flipped) ── */}
      <CulturalPatternDivider flip />
    </section>
  )
}