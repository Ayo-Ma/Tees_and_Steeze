import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedProducts, urlFor } from '../../tees-and-steeze/settings/src/lib/sanity'

function ProductCard({ product, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  const primaryImage = product.images?.[0]
    ? urlFor(product.images[0]).width(600).quality(80).auto('format').url()
    : '/hero.jpg'

  const hoverImage = product.images?.length > 2
    ? urlFor(product.images[2]).width(600).quality(80).auto('format').url()
    : primaryImage

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
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <Link
      ref={ref}
      to={`/product/${product.slug}`}
      className="group block"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 500ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden bg-surface" style={{ aspectRatio: '3 / 4' }}>
        <img
          src={primaryImage}
          alt={`${product.name} — Tee's and Steeze`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
            opacity: hovered ? 0 : 1,
            transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease',
          }}
        />
        <img
          src={hoverImage}
          alt={`${product.name} worn — Tee's and Steeze`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: hovered ? 'scale(1)' : 'scale(1.03)',
            opacity: hovered ? 1 : 0,
            transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease',
          }}
        />
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-body text-[0.9375rem] font-medium text-bone leading-tight">
            {product.name}
          </h3>
          <p className="font-body text-[0.9375rem] text-stone mt-1">
            ₦{product.price?.toLocaleString()}
          </p>
        </div>
        <span
          className="font-body text-[0.75rem] font-medium uppercase whitespace-nowrap pt-0.5"
          style={{
            letterSpacing: '0.08em',
            color: hovered ? 'var(--color-bone)' : 'var(--color-stone)',
            transition: 'color 200ms ease',
          }}
        >
          View piece →
        </span>
      </div>
    </Link>
  )
}

export default function FeaturedDrop() {
  const headingRef = useRef(null)
  const [headingVisible, setHeadingVisible] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFeaturedProducts()
      .then((data) => {
        setProducts(data || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load featured products:', err)
        setProducts([])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadingVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15 }
    )
    if (headingRef.current) observer.observe(headingRef.current)
    return () => observer.disconnect()
  }, [])

  // Don't render section if no featured products
  if (!loading && products.length === 0) return null

  return (
    <section aria-label="Featured Drop" className="section container">
      <div
        ref={headingRef}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-8 mb-12 md:mb-16"
        style={{
          opacity: headingVisible ? 1 : 0,
          transform: headingVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div>
          <h2 className="display-md">The latest drop.</h2>
          <p className="body-sm mt-2" style={{ color: 'var(--color-dim)' }}>
            Limited pieces. No restocks.
          </p>
        </div>
        <Link
          to="/shop"
          className="link-cta whitespace-nowrap"
          style={{ fontSize: '0.9375rem' }}
        >
          See the full collection →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <div className="bg-surface animate-pulse" style={{ aspectRatio: '3 / 4' }} />
              <div className="mt-5">
                <div className="bg-surface animate-pulse" style={{ height: '1rem', width: '60%' }} />
                <div className="bg-surface animate-pulse mt-2" style={{ height: '1rem', width: '30%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {products.map((product, i) => (
            <ProductCard key={product._id || product.slug} product={product} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}