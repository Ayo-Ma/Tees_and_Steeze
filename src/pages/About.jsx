import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

/*
 * ── SCROLL REVEAL HOOK ──
 * Reusable intersection observer for fade-in animations.
 */
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, visible]
}

/*
 * ── CULTURAL PATTERN DIVIDER ──
 * Same Adire-geometric language used across the site.
 */
const CulturalDivider = ({ className = '' }) => (
  <div className={`w-full ${className}`} style={{ height: '48px', opacity: 0.3 }}>
    <svg
      width="100%"
      height="48"
      viewBox="0 0 1200 48"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <line x1="0" y1="24" x2="1200" y2="24" stroke="#F5F4F0" strokeWidth="0.5" />
      {[120, 360, 600, 840, 1080].map((cx) => (
        <g key={`c-${cx}`}>
          <circle cx={cx} cy="24" r="10" stroke="#F5F4F0" strokeWidth="1" />
          <circle cx={cx} cy="24" r="6" stroke="#F5F4F0" strokeWidth="1" />
          <circle cx={cx} cy="24" r="2.5" fill="#F5F4F0" />
        </g>
      ))}
      {[240, 480, 720, 960].map((cx) => (
        <g key={`d-${cx}`}>
          <polygon points={`${cx},14 ${cx + 10},24 ${cx},34 ${cx - 10},24`} stroke="#F5F4F0" strokeWidth="1" />
          <polygon points={`${cx},18 ${cx + 6},24 ${cx},30 ${cx - 6},24`} stroke="#F5F4F0" strokeWidth="1" />
        </g>
      ))}
    </svg>
  </div>
)

/*
 * ── SECTION 1 — OPENING STATEMENT ──
 * One line. Alone. Massive breathing room.
 */
function OpeningStatement() {
  const [ref, visible] = useReveal(0.3)

  return (
    <section
      ref={ref}
      aria-label="Opening"
      className="flex items-center justify-center text-center"
      style={{
        minHeight: '70vh',
        paddingTop: 'clamp(6rem, 15vw, 10rem)',
        paddingBottom: 'clamp(6rem, 15vw, 10rem)',
      }}
    >
      <h1
        className="display-xl container"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        Three years.
        <br />
        One idea.
        <br />
        <span className="text-steeze-pink">The steeze.</span>
      </h1>
    </section>
  )
}

/*
 * ── SECTION 2 — THE FOUNDING STORY ──
 * No headline. The story starts talking.
 * Centered reading column, 720px max-width.
 */
function FoundingStory() {
  const [ref, visible] = useReveal(0.1)

  return (
    <section ref={ref} aria-label="Founding Story" className="container">
      <div
        className="mx-auto"
        style={{
          maxWidth: '720px',
          paddingBottom: 'clamp(4rem, 8vw, 6rem)',
        }}
      >
        {/* Grain texture behind text — very subtle */}
        <div className="relative">
          {/* Paragraphs — staggered reveals */}
          <p
            className="body-lg"
            style={{
              color: 'var(--color-bone)',
              fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
              lineHeight: '1.75',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            I started Tee's and Steeze because I was tired of wearing what
            everyone else was wearing.
          </p>

          <div
            className="mt-8 space-y-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 200ms',
            }}
          >
            <p className="body-lg" style={{ color: 'var(--color-stone)' }}>
              That sounds simple. It wasn't. Walk into any store. Open any page.
              Scroll any feed. It's all the same. Same fits copied from the same
              international brands. Same prints that don't mean anything. Same
              "premium streetwear" with nothing behind it except a logo and a price
              tag. I looked at what was available and I didn't see myself in any of it.
            </p>

            <p
              className="body-lg font-medium"
              style={{
                color: 'var(--color-bone)',
                fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
              }}
            >
              So I made something.
            </p>

            <p className="body-lg" style={{ color: 'var(--color-stone)' }}>
              The first pieces weren't perfect. They weren't supposed to be. They
              were supposed to be real — built from an idea I couldn't stop thinking
              about. That when you put something on and it fits right and it means
              something and nobody else around you is wearing it, there's a feeling.
              A confidence. An energy. We call it the steeze.
            </p>

            <p className="body-lg" style={{ color: 'var(--color-stone)' }}>
              That was September 2022. Three years later, the idea hasn't changed.
              The pieces have gotten sharper. The craft has gotten tighter. But the
              reason we exist is the same reason we existed on day one: to make
              something that carries something.{' '}
              <span className="font-medium" style={{ color: 'var(--color-bone)' }}>
                Not just clothes. Not just a brand. The steeze.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/*
 * ── SECTION 3 — THE JOURNEY (TIMELINE) ──
 * Vertical timeline with cultural line treatment.
 * Each milestone fades in as it enters viewport.
 */
const MILESTONES = [
  {
    year: 'Sept 2022',
    text: 'First pieces. First drop. No website. No following. Just the idea and the work.',
  },
  {
    year: '2023',
    text: 'Started shipping nationwide. Expanded from tees into hoodies, jerseys, and pocket shirts. The pieces got sharper. The audience started finding us.',
  },
  {
    year: '2024',
    text: 'Repeat customers became the core. People weren\'t buying once — they were coming back. That\'s when the steeze stopped being a concept and became a community.',
  },
  {
    year: '2025',
    text: 'Armless range launched. Product range complete. The brand outgrew DMs and IG. Time to build the house properly.',
  },
  {
    year: '2026',
    text: 'You\'re looking at it.',
    highlight: true,
  },
]

function TimelineMilestone({ milestone, index }) {
  const [ref, visible] = useReveal(0.2)

  return (
    <div
      ref={ref}
      className="flex gap-6 md:gap-10"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 500ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms`,
      }}
    >
      {/* Year */}
      <div className="flex-shrink-0" style={{ width: '90px' }}>
        <span
          className="font-display font-semibold uppercase"
          style={{
            fontSize: '0.875rem',
            letterSpacing: '0.04em',
            color: milestone.highlight ? 'var(--color-steeze-pink)' : 'var(--color-bone)',
          }}
        >
          {milestone.year}
        </span>
      </div>

      {/* Line + dot */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: '20px' }}>
        {/* Dot */}
        <div
          style={{
            width: milestone.highlight ? '12px' : '8px',
            height: milestone.highlight ? '12px' : '8px',
            borderRadius: '50%',
            background: milestone.highlight ? 'var(--color-steeze-pink)' : 'var(--color-bone)',
            flexShrink: 0,
            marginTop: '6px',
          }}
        />
        {/* Line — connects to next milestone */}
        {index < MILESTONES.length - 1 && (
          <div
            style={{
              width: '1px',
              flex: 1,
              background: 'var(--color-border)',
              marginTop: '8px',
            }}
          />
        )}
      </div>

      {/* Text */}
      <div style={{ paddingBottom: '2.5rem' }}>
        <p
          className="body-lg"
          style={{
            color: milestone.highlight ? 'var(--color-bone)' : 'var(--color-stone)',
            fontWeight: milestone.highlight ? 500 : 400,
            fontStyle: milestone.highlight ? 'italic' : 'normal',
          }}
        >
          {milestone.text}
        </p>
      </div>
    </div>
  )
}

function Timeline() {
  const [headingRef, headingVisible] = useReveal(0.2)

  return (
    <section aria-label="Brand Timeline" className="container">
      <CulturalDivider className="mb-12 md:mb-16" />

      <div className="mx-auto" style={{ maxWidth: '720px' }}>
        {/* Section heading */}
        <h2
          ref={headingRef}
          className="display-sm mb-10 md:mb-14"
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          The timeline.
        </h2>

        {/* Milestones */}
        <div>
          {MILESTONES.map((m, i) => (
            <TimelineMilestone key={m.year} milestone={m} index={i} />
          ))}
        </div>
      </div>

      <CulturalDivider className="mt-12 md:mt-16" />
    </section>
  )
}

/*
 * ── SECTION 4 — THE UNISEX CONVICTION ──
 * Zainab's trust paragraph.
 * Two-column: image left, copy right.
 */
function UnisexConviction() {
  const [ref, visible] = useReveal(0.15)

  return (
    <section
      ref={ref}
      aria-label="Unisex by design"
      className="container"
      style={{
        paddingTop: 'clamp(4rem, 8vw, 6rem)',
        paddingBottom: 'clamp(4rem, 8vw, 6rem)',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Image */}
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: '4 / 5',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-24px)',
            transition: 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <img
            src="/about-unisex.jpg"
            alt="Two people — different genders, same Tee's and Steeze piece, same steeze"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Grain */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: 0.04,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '128px 128px',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 60px rgba(10,10,10,0.4)' }}
          />
        </div>

        {/* Copy */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 700ms cubic-bezier(0.16, 1, 0.3, 1) 200ms',
          }}
        >
          <span
            className="caption"
            style={{ color: 'var(--color-steeze-pink)', letterSpacing: '0.12em' }}
          >
            By Design
          </span>

          <h2 className="display-md mt-4">
            For everyone.
            <br />
            By design.
          </h2>

          <div className="mt-8 space-y-5">
            <p className="body-lg" style={{ color: 'var(--color-stone)' }}>
              Tee's and Steeze didn't add a women's section after the fact. There
              was never a men's section to begin with. Every piece is designed to be
              worn by anyone — the cuts, the sizing, the photography. All of it.
            </p>

            <p className="body-lg" style={{ color: 'var(--color-stone)' }}>
              This isn't a trend. It's how the brand was built from day one.{' '}
              <span className="font-medium" style={{ color: 'var(--color-bone)' }}>
                We don't believe clothes have a gender. We believe they have a fit,
                a feeling, and a story.
              </span>{' '}
              Who wears them is up to you.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/*
 * ── SECTION 5 — THE PIECES ──
 * Conviction statement about craft.
 * Full-width image with text overlay.
 */
function ThePieces() {
  const [ref, visible] = useReveal(0.15)

  return (
    <section
      ref={ref}
      aria-label="The Pieces"
      className="relative overflow-hidden"
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background image — close-up of fabric / stitching / detail */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/about-pieces.jpg')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-void/70" />

      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 container"
        style={{
          paddingTop: 'clamp(4rem, 8vw, 6rem)',
          paddingBottom: 'clamp(4rem, 8vw, 6rem)',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '720px' }}>
          <h2
            className="display-md"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            Made with something to say.
          </h2>

          <div
            className="mt-8 space-y-5"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) 150ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 150ms',
            }}
          >
            <p className="body-lg" style={{ color: 'var(--color-stone)' }}>
              Every piece starts with an idea — not a trend report. Not a
              competitor's bestseller. Not "what's selling right now." An idea. A
              reference. A story worth carrying.
            </p>

            <p className="body-lg" style={{ color: 'var(--color-stone)' }}>
              We don't mass-produce. We don't chase drops for the sake of dropping.
              When a piece comes out, it's because it earned its place. The fabric is
              chosen because it holds up — not because it's cheap. The fit is tested
              because it has to sit right on every body that wears it. The details are
              there because someone cared enough to put them there.
            </p>

            <p
              className="body-lg font-medium"
              style={{
                color: 'var(--color-bone)',
                fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
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

/*
 * ── SECTION 6 — CTA ──
 * One headline. One button. The only action on the entire page.
 */
function FinalCTA() {
  const [ref, visible] = useReveal(0.2)

  return (
    <section
      ref={ref}
      aria-label="Call to action"
      className="text-center"
      style={{
        paddingTop: 'clamp(5rem, 10vw, 8rem)',
        paddingBottom: 'clamp(5rem, 10vw, 8rem)',
      }}
    >
      <div className="container">
        <CulturalDivider className="mb-12 md:mb-16" />

        <h2
          className="display-md"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          Now see what three years built.
        </h2>

        <div
          className="mt-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) 150ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 150ms',
          }}
        >
          <Link to="/shop" className="btn-primary" style={{ padding: '1.25rem 3rem' }}>
            See the collection
          </Link>
        </div>
      </div>
    </section>
  )
}

/*
 * ── MAIN PAGE COMPONENT ──
 */
export default function About() {
  return (
    <>
      <Helmet>
        <title>The Story — Tee's and Steeze | Nigerian Unisex Streetwear</title>
        <meta
          name="description"
          content="Three years. One idea. The steeze. The founding story of Tee's and Steeze — a unisex streetwear brand from Jos, Nigeria, built on conviction, not trends."
        />
        <link rel="canonical" href="https://teesandsteeze.com/about" />

        <meta property="og:title" content="The Story — Tee's and Steeze" />
        <meta
          property="og:description"
          content="Three years of building something that means something. The founding story of Tee's and Steeze."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://teesandsteeze.com/about" />
        <meta property="og:image" content="https://teesandsteeze.com/og-about.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Story — Tee's and Steeze" />
        <meta name="twitter:description" content="Three years. One idea. The steeze." />
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