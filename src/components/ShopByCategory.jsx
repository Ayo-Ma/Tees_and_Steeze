import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHomepage, urlFor } from '../../tees-and-steeze/settings/src/lib/sanity'

const CATEGORY_SLUGS = [
  { slug: 'tees', label: 'Tees' },
  { slug: 'hoodies', label: 'Hoodies' },
  { slug: 'Tang top shirt', label: 'Tang Top Shirt' },
  { slug: 'packet-shirts', label: 'Packet Shirts' },
  { slug: 'bags', label: 'Steezy Bags' },
  { slug: 'p cap', label: 'P Cap' },
  { slug: 'net cap', label: 'Net Cap' },
]

function CategoryTile({ category, index, visible }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="relative block overflow-hidden group"
      style={{
        aspectRatio: index === 0 || index === 1 ? '3 / 4' : '1 / 1',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 500ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={category.image}
        alt={`${category.label} — Tee's and Steeze streetwear`}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: hovered ? 'rgba(10, 10, 10, 0.3)' : 'rgba(10, 10, 10, 0.5)',
          transition: 'background 400ms ease',
        }}
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <span
          className="font-display font-semibold uppercase text-bone text-center"
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            letterSpacing: '0.04em',
            transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
            transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {category.label}
        </span>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-5"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 300ms ease, transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <span
          className="caption"
          style={{ color: 'var(--color-bone)', letterSpacing: '0.12em' }}
        >
          Shop →
        </span>
      </div>
    </Link>
  )
}

export default function ShopByCategory() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [categoryImages, setCategoryImages] = useState({})

  const CATEGORIES = CATEGORY_SLUGS.map((cat) => ({
    ...cat,
    image: categoryImages[cat.slug] || '/hero.jpg',
  }))

  useEffect(() => {
    getHomepage()
      .then((data) => {
        if (data?.categoryImages) {
          const imageMap = {}
          data.categoryImages.forEach((item) => {
            if (item.category && item.image) {
              imageMap[item.category] = urlFor(item.image).width(600).quality(80).auto('format').url()
            }
          })
          setCategoryImages(imageMap)
        }
      })
      .catch((err) => console.error('Failed to load category images:', err))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} aria-label="Categories" className="section">
      <div className="container">
        <div
          className="mb-12 md:mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <h2 className="display-md">Find your piece.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
          {CATEGORIES.slice(0, 3).map((cat, i) => (
            <CategoryTile key={cat.slug} category={cat} index={i} visible={visible} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {CATEGORIES.slice(3).map((cat, i) => (
            <CategoryTile key={cat.slug} category={cat} index={i + 3} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  )
}