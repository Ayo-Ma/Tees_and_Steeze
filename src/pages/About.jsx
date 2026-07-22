import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.unobserve(e.target) }
    }, { threshold })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* ── SECTION 1 — OPENING ── */
function OpeningStatement() {
  const [ref, visible] = useReveal(0.2)

  return (
    <section
      aria-label="Opening"
      style={{
        paddingTop: 'clamp(7rem, 14vw, 11rem)',
        paddingBottom: 'clamp(5rem, 10vw, 8rem)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="container">
        <div
          ref={ref}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-steeze-pink)',
              marginBottom: '1.5rem',
            }}
          >
            About — Tee's & Steeze
          </p>
          <h1 className="display-xl" style={{ maxWidth: '900px' }}>
            Three years.
            <br />
            One idea.
            <br />
            <span style={{ color: 'var(--color-steeze-pink)' }}>The steeze.</span>
          </h1>
        </div>
      </div>
    </section>
  )
}

/* ── SECTION 2 — FOUNDING STORY ── */
function FoundingStory() {
  const [ref, visible] = useReveal(0.08)

  return (
    <section
      ref={ref}
      aria-label="Founding story"
      style={{
        paddingTop: 'clamp(4rem, 8vw, 6rem)',
        paddingBottom: 'clamp(4rem, 8vw, 6rem)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
          }}
          className="lg:grid-cols-[280px_1fr]"
        >
          {/* Left: section label */}
          <div>
            <div className="section-eyebrow">
              <span className="section-eyebrow-label">The origin</span>
            </div>
          </div>

          {/* Right: copy */}
          <div
            style={{
              maxWidth: '640px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 600ms ease, transform 600ms ease',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
                fontWeight: 500,
                color: 'var(--color-bone)',
                lineHeight: 1.7,
                marginBottom: '1.75rem',
              }}
            >
              I started Tee's and Steeze because I was tired of wearing what everyone else was wearing.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-stone)', lineHeight: 1.75 }}>
                That sounds simple. It wasn't. Walk into any store. Open any page. Scroll any feed. It's all the same. Same fits copied from the same international brands. Same prints that don't mean anything. Same "premium streetwear" with nothing behind it except a logo and a price tag. I looked at what was available and I didn't see myself in any of it.
              </p>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-bone)', lineHeight: 1.7 }}>
                So I made something.
              </p>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-stone)', lineHeight: 1.75 }}>
                The first pieces weren't perfect. They weren't supposed to be. They were supposed to be real — built from an idea I couldn't stop thinking about. That when you put something on and it fits right and it means something and nobody else around you is wearing it, there's a feeling. A confidence. An energy. We call it the steeze.
              </p>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-stone)', lineHeight: 1.75 }}>
                That was September 2022. Three years later, the idea hasn't changed. The pieces have gotten sharper. The craft has gotten tighter. But the reason we exist is the same reason we existed on day one: to make something that carries something.{' '}
                <span style={{ fontWeight: 600, color: 'var(--color-bone)' }}>
                  Not just clothes. Not just a brand. The steeze.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── SECTION 3 — TIMELINE ── */
const MILESTONES = [
  { year: 'Sept 2022', text: 'First pieces. First drop. No website. No following. Just the idea and the work.' },
  { year: '2023', text: 'Started shipping nationwide. Expanded from tees into hoodies, jerseys, and pocket shirts. The pieces got sharper. The audience started finding us.' },
  { year: '2024', text: "Repeat customers became the core. People weren't buying once — they were coming back. That's when the steeze stopped being a concept and became a community." },
  { year: '2025', text: 'Armless range launched. Product range complete. The brand outgrew DMs and IG. Time to build the house properly.' },
  { year: '2026', text: "You're looking at it.", highlight: true },
]

function TimelineMilestone({ milestone, index }) {
  const [ref, visible] = useReveal(0.15)

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 1px 1fr',
        gap: '0 2rem',
        paddingBottom: '2.5rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 450ms ease ${index * 80}ms, transform 450ms ease ${index * 80}ms`,
      }}
    >
      {/* Year */}
      <div style={{ paddingTop: '2px' }}>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: milestone.highlight ? 'var(--color-steeze-pink)' : 'var(--color-dim)',
          }}
        >
          {milestone.year}
        </span>
      </div>

      {/* Vertical rule + dot */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            width: milestone.highlight ? '10px' : '6px',
            height: milestone.highlight ? '10px' : '6px',
            borderRadius: '50%',
            background: milestone.highlight ? 'var(--color-steeze-pink)' : 'var(--color-stone)',
            flexShrink: 0,
            marginTop: '4px',
            position: 'relative',
            zIndex: 1,
          }}
        />
        {index < MILESTONES.length - 1 && (
          <div style={{ flex: 1, width: '1px', background: 'var(--color-border)', marginTop: '8px' }} />
        )}
      </div>

      {/* Text */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          lineHeight: 1.7,
          color: milestone.highlight ? 'var(--color-bone)' : 'var(--color-stone)',
          fontWeight: milestone.highlight ? 600 : 400,
        }}
      >
        {milestone.text}
      </p>
    </div>
  )
}

function Timeline() {
  const [ref, visible] = useReveal(0.08)

  return (
    <section
      aria-label="Brand timeline"
      style={{
        paddingTop: 'clamp(4rem, 8vw, 6rem)',
        paddingBottom: 'clamp(4rem, 8vw, 6rem)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
          }}
          className="lg:grid-cols-[280px_1fr]"
        >
          {/* Left label */}
          <div ref={ref}>
            <div className="section-eyebrow">
              <span className="section-eyebrow-label">The journey</span>
            </div>
            <h2
              className="display-sm"
              style={{
                marginTop: '0.5rem',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 500ms ease, transform 500ms ease',
              }}
            >
              The timeline.
            </h2>
          </div>

          {/* Right: milestones */}
          <div>
            {MILESTONES.map((m, i) => (
              <TimelineMilestone key={m.year} milestone={m} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── SECTION 4 — UNISEX ── */
function UnisexConviction() {
  const [ref, visible] = useReveal(0.1)

  return (
    <section
      ref={ref}
      aria-label="Unisex by design"
      style={{
        paddingTop: 'clamp(4rem, 8vw, 6rem)',
        paddingBottom: 'clamp(4rem, 8vw, 6rem)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
            alignItems: 'center',
          }}
          className="lg:grid-cols-2"
        >
          {/* Image */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: '4 / 5',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'opacity 700ms ease, transform 700ms ease',
            }}
          >
            <img
              src="/unisex.png"
              alt="Two people wearing Tee's and Steeze"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Copy */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 700ms ease 150ms, transform 700ms ease 150ms',
            }}
          >
            <div className="section-eyebrow">
              <span className="section-eyebrow-label">By design</span>
            </div>
            <h2 className="display-md" style={{ marginTop: '0.75rem', marginBottom: '2rem' }}>
              For everyone.
              <br />
              By design.
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-stone)', lineHeight: 1.75 }}>
                Tee's and Steeze didn't add a women's section after the fact. There was never a men's section to begin with. Every piece is designed to be worn by anyone — the cuts, the sizing, the photography. All of it.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-stone)', lineHeight: 1.75 }}>
                This isn't a trend. It's how the brand was built from day one.{' '}
                <span style={{ fontWeight: 600, color: 'var(--color-bone)' }}>
                  We don't believe clothes have a gender. We believe they have a fit, a feeling, and a story.
                </span>{' '}
                Who wears them is up to you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── SECTION 5 — THE PIECES (full bleed) ── */
function ThePieces() {
  const [ref, visible] = useReveal(0.1)

  return (
    <section
      ref={ref}
      aria-label="The pieces"
      style={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/about-pieces.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.4) 60%, rgba(10,10,10,0.1) 100%)',
        }}
      />

      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 1,
          paddingTop: 'clamp(4rem, 8vw, 6rem)',
          paddingBottom: 'clamp(4rem, 8vw, 6rem)',
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <div className="section-eyebrow">
            <span className="section-eyebrow-label" style={{ color: 'rgba(245,244,240,0.5)' }}>The craft</span>
          </div>
          <h2
            className="display-md"
            style={{
              marginTop: '0.75rem',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 600ms ease, transform 600ms ease',
            }}
          >
            Made with something to say.
          </h2>

          <div
            style={{
              marginTop: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 600ms ease 120ms, transform 600ms ease 120ms',
            }}
          >
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(245,244,240,0.65)', lineHeight: 1.75 }}>
              Every piece starts with an idea — not a trend report. Not a competitor's bestseller. Not "what's selling right now." An idea. A reference. A story worth carrying.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(245,244,240,0.65)', lineHeight: 1.75 }}>
              We don't mass-produce. We don't chase drops for the sake of dropping. When a piece comes out, it's because it earned its place. The fabric holds up. The fit sits right on every body. The details are there because someone cared enough to put them there.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
                color: 'var(--color-bone)',
                lineHeight: 1.3,
              }}
            >
              This isn't fast fashion wearing a streetwear costume.
              <br />
              This is the work.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── SECTION 6 — CTA ── */
function FinalCTA() {
  const [ref, visible] = useReveal(0.2)

  return (
    <section
      ref={ref}
      aria-label="Call to action"
      style={{
        borderTop: '1px solid var(--color-border)',
        paddingTop: 'clamp(5rem, 10vw, 8rem)',
        paddingBottom: 'clamp(5rem, 10vw, 8rem)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
          }}
        >
          <div className="section-eyebrow">
            <span className="section-eyebrow-label">See the work</span>
          </div>
          <h2
            className="display-lg"
            style={{
              marginTop: '1rem',
              marginBottom: '2.5rem',
              maxWidth: '800px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 600ms ease, transform 600ms ease',
            }}
          >
            Now see what
            <br />
            three years built.
          </h2>
          <div
            style={{
              opacity: visible ? 1 : 0,
              transition: 'opacity 600ms ease 150ms',
            }}
          >
            <Link to="/shop" className="btn-primary">
              Shop the collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function About() {
  return (
    <>
      <Helmet>
        <title>The Story — Tee's and Steeze | Nigerian Unisex Streetwear</title>
        <meta name="description" content="Three years. One idea. The steeze. The founding story of Tee's and Steeze — a unisex streetwear brand from Jos, Nigeria, built on conviction, not trends." />
        <link rel="canonical" href="https://teesandsteeze.com/about" />
        <meta property="og:title" content="The Story — Tee's and Steeze" />
        <meta property="og:description" content="Three years of building something that means something. The founding story of Tee's and Steeze." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://teesandsteeze.com/about" />
        <meta property="og:image" content="https://teesandsteeze.com/og-about.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        <OpeningStatement />
        <FoundingStory />
        <Timeline />
        <UnisexConviction />
        <ThePieces />
        <FinalCTA />
      </main>
    </>
  )
}
