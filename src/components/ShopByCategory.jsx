import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHomepage, urlFor } from '../../tees-and-steeze/settings/src/lib/sanity'

const CATEGORIES = [
  { slug: 'tees', label: 'Tees' },
  { slug: 'hoodies', label: 'Hoodies' },
  { slug: 'packet-shirts', label: 'Packet Shirts' },
  { slug: 'Tang top shirt', label: 'Tang Top' },
  { slug: 'bags', label: 'Steezy Bags' },
  { slug: 'p cap', label: 'Caps' },
]

function useReveal(threshold = 0.08) {
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

function CategoryTile({ cat, image, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      to={`/shop?category=${cat.slug}`}
      style={{
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
        textDecoration: 'none',
        background: 'var(--color-surface)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ aspectRatio: index < 2 ? '2 / 3' : '1 / 1', position: 'relative', overflow: 'hidden' }}>
        <img
          src={image}
          alt={cat.label}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 600ms cubic-bezier(0.16,1,0.3,1)',
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: hovered
              ? 'rgba(10,10,10,0.55)'
              : 'rgba(10,10,10,0.25)',
            transition: 'background 300ms ease',
          }}
        />

        {/* Label */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.25rem, 3vw, 2rem)',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              color: 'var(--color-bone)',
              textAlign: 'center',
              lineHeight: 1,
            }}
          >
            {cat.label}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: hovered ? 'var(--color-bone)' : 'rgba(245,244,240,0.55)',
              transition: 'color 250ms ease, opacity 250ms ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            Shop <span style={{ fontSize: '0.875rem' }}>→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function ShopByCategory() {
  const [categoryImages, setCategoryImages] = useState({})
  const [ref, visible] = useReveal(0.05)

  useEffect(() => {
    getHomepage()
      .then((data) => {
        if (data?.categoryImages) {
          const map = {}
          data.categoryImages.forEach((ci) => {
            if (ci.category && ci.image) {
              map[ci.category] = urlFor(ci.image).width(700).quality(80).url()
            }
          })
          setCategoryImages(map)
        }
      })
      .catch(() => {})
  }, [])

  const getImage = (slug) => categoryImages[slug] || '/hero.jpg'

  return (
    <section
      ref={ref}
      aria-label="Shop by category"
      style={{ paddingTop: 'clamp(4rem, 7vw, 6rem)', paddingBottom: 'clamp(4rem, 7vw, 6rem)', borderTop: '1px solid var(--color-border)' }}
    >
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2.5rem',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 500ms ease, transform 500ms ease',
          }}
        >
          <div>
            <div className="section-eyebrow">
              <span className="section-eyebrow-label">Browse</span>
            </div>
            <h2 className="display-sm" style={{ marginTop: '0.5rem' }}>Shop by category.</h2>
          </div>
          <Link to="/shop" className="link-cta" style={{ marginBottom: '0.25rem', whiteSpace: 'nowrap' }}>
            View all →
          </Link>
        </div>

        {/* Grid — 3 col on sm, 6 col on lg (balanced) */}
        <div
          className="[--cols:2] sm:[--cols:3]"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(var(--cols, 2), 1fr)',
            gap: '1px',
            background: 'var(--color-border)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 600ms ease 100ms, transform 600ms ease 100ms',
          }}
        >
          {CATEGORIES.map((cat, i) => (
            <div key={cat.slug} style={{ background: 'var(--color-void)' }}>
              <CategoryTile cat={cat} image={getImage(cat.slug)} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
