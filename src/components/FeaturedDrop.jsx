import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedProducts, urlFor } from '../../tees-and-steeze/settings/src/lib/sanity'

function useReveal(threshold = 0.1) {
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

function ProductCard({ product, index }) {
  const [ref, visible] = useReveal(0.08)
  const [hovered, setHovered] = useState(false)

  const primary = product.images?.[0]
    ? urlFor(product.images[0]).width(700).quality(85).url()
    : '/products/placeholder.jpg'

  const hover = product.images?.length > 2
    ? urlFor(product.images[2]).width(700).quality(85).url()
    : primary

  return (
    <Link
      ref={ref}
      to={`/product/${product.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 450ms cubic-bezier(0.16,1,0.3,1) ${index * 60}ms, transform 450ms cubic-bezier(0.16,1,0.3,1) ${index * 60}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '3 / 4', overflow: 'hidden', background: 'var(--color-surface)' }}>
        <img
          src={primary}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            opacity: hovered ? 0 : 1,
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'opacity 300ms ease, transform 500ms cubic-bezier(0.16,1,0.3,1)',
          }}
        />
        <img
          src={hover}
          alt={`${product.name} worn`}
          loading="lazy"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scale(1)' : 'scale(1.04)',
            transition: 'opacity 300ms ease, transform 500ms cubic-bezier(0.16,1,0.3,1)',
          }}
        />

        {product.inStock === false && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-bone)' }}>
              Sold out
            </span>
          </div>
        )}

        {/* Quick-view hover badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: `translateX(-50%) translateY(${hovered ? '0' : '8px'})`,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 200ms ease, transform 200ms ease',
            background: 'var(--color-bone)',
            color: 'var(--color-void)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '0.5rem 1.25rem',
            whiteSpace: 'nowrap',
          }}
        >
          View piece
        </div>
      </div>

      {/* Info */}
      <div style={{ paddingTop: '0.875rem' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-bone)', lineHeight: 1.3, marginBottom: '0.25rem' }}>
          {product.name}
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-stone)' }}>
          ₦{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div>
      <div style={{ aspectRatio: '3 / 4', background: 'var(--color-surface)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ paddingTop: '0.875rem' }}>
        <div style={{ height: '0.875rem', width: '65%', background: 'var(--color-surface)', marginBottom: '0.4rem' }} />
        <div style={{ height: '0.875rem', width: '35%', background: 'var(--color-surface)' }} />
      </div>
    </div>
  )
}

export default function FeaturedDrop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [ref, visible] = useReveal(0.05)

  useEffect(() => {
    getFeaturedProducts()
      .then((data) => { setProducts(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (!loading && products.length === 0) return null

  return (
    <section
      ref={ref}
      aria-label="Featured products"
      style={{ paddingTop: 'clamp(4rem, 7vw, 6rem)', paddingBottom: 'clamp(4rem, 7vw, 6rem)', borderTop: '1px solid var(--color-border)' }}
    >
      <div className="container">
        {/* Section header */}
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
              <span className="section-eyebrow-label">New arrivals</span>
            </div>
            <h2 className="display-sm" style={{ marginTop: '0.5rem' }}>The Drop.</h2>
          </div>
          <Link
            to="/shop"
            className="link-cta"
            style={{ marginBottom: '0.25rem', whiteSpace: 'nowrap' }}
          >
            Shop all →
          </Link>
        </div>

        {/* Grid — 2 mobile, 4 desktop */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(var(--cols, 2), 1fr)',
            gap: '1.25rem',
          }}
          className="[--cols:2] sm:[--cols:4]"
        >
          {loading
            ? [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)
            : products.map((p, i) => <ProductCard key={p._id || p.slug} product={p} index={i} />)
          }
        </div>
      </div>
    </section>
  )
}
