import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { getAllProducts, urlFor, saveDropSignup } from "../../tees-and-steeze/settings/src/lib/sanity";

const CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "tees", label: "Tees" },
  { slug: "packet-shirts", label: "Packet Shirts" },
  { slug: "hoodies", label: "Hoodies" },
  { slug: "Tang top shirt", label: "Tang Top" },
  { slug: "bags", label: "Bags" },
  { slug: "p cap", label: "P Cap" },
  { slug: "net cap", label: "Net Cap" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
];

function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(entry.target); } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function ProductCard({ product, index }) {
  const [ref, visible] = useReveal(0.05);
  const [hovered, setHovered] = useState(false);

  const primaryImage = product.images?.[0]
    ? urlFor(product.images[0]).width(560).quality(80).url()
    : "/products/placeholder.jpg";
  const hoverImage = product.images?.length > 2
    ? urlFor(product.images[2]).width(560).quality(80).url()
    : primaryImage;

  return (
    <Link
      ref={ref}
      to={`/product/${product.slug}`}
      style={{
        display: "block",
        textDecoration: "none",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 400ms cubic-bezier(0.16,1,0.3,1) ${Math.min(index, 6) * 40}ms, transform 400ms cubic-bezier(0.16,1,0.3,1) ${Math.min(index, 6) * 40}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          aspectRatio: "3 / 4",
          background: "var(--color-surface)",
        }}
      >
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            opacity: hovered && hoverImage !== primaryImage ? 0 : 1,
            transform: `scale(${hovered ? 1.03 : 1})`,
            transition: "opacity 280ms ease, transform 400ms cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        {hoverImage !== primaryImage && (
          <img
            src={hoverImage}
            alt={`${product.name} — worn`}
            loading="lazy"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
              opacity: hovered ? 1 : 0,
              transition: "opacity 280ms ease",
            }}
          />
        )}
        {product.inStock === false && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-stone)" }}>
              Sold out
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ paddingTop: "0.75rem" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 500, color: "var(--color-bone)", lineHeight: 1.3 }}>
          {product.name}
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-stone)", marginTop: "0.25rem" }}>
          ₦{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

function ShopLoading() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem 1rem" }} className="sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <div style={{ aspectRatio: "3/4", background: "var(--color-surface)", animation: "pulse 2s infinite" }} />
          <div style={{ height: "0.75rem", width: "65%", background: "var(--color-surface)", marginTop: "0.75rem", animation: "pulse 2s infinite" }} />
          <div style={{ height: "0.75rem", width: "35%", background: "var(--color-surface)", marginTop: "0.375rem", animation: "pulse 2s infinite" }} />
        </div>
      ))}
    </div>
  );
}

function sortProducts(products, sortBy) {
  const arr = [...products];
  switch (sortBy) {
    case "price-asc":  return arr.sort((a, b) => a.price - b.price);
    case "price-desc": return arr.sort((a, b) => b.price - a.price);
    case "name-asc":   return arr.sort((a, b) => a.name.localeCompare(b.name));
    default:           return arr; // newest — preserve Sanity order
  }
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const [sortBy, setSortBy] = useState("newest");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [signupValue, setSignupValue] = useState("");
  const [signupDone, setSignupDone] = useState(false);

  useEffect(() => {
    getAllProducts()
      .then((data) => { setProducts(data || []); setLoading(false); })
      .catch(() => { setProducts([]); setLoading(false); });
  }, []);

  const filtered = activeCategory === "all"
    ? products
    : products.filter((p) => p.category === activeCategory);

  const displayed = sortProducts(filtered, sortBy);

  const handleFilter = (slug) => {
    slug === "all" ? setSearchParams({}) : setSearchParams({ category: slug });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!signupValue.trim()) return;
    saveDropSignup({ contact: signupValue, source: "shop" })
      .then(() => setSignupDone(true))
      .catch(() => setSignupDone(true));
  };

  return (
    <>
      <Helmet>
        <title>Shop the Collection — Tee's and Steeze | Streetwear Nigeria</title>
        <meta name="description" content="Shop unisex streetwear from Tee's and Steeze. Graphic tees, hoodies, jerseys, bags, and caps. Nationwide delivery. Limited drops." />
        <link rel="canonical" href="https://teesandsteeze.com/shop" />
        <meta property="og:title" content="Shop the Collection — Tee's and Steeze" />
        <meta property="og:description" content="Unisex streetwear. Limited drops. Nationwide delivery." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://teesandsteeze.com/shop" />
      </Helmet>

      <main style={{ paddingTop: "60px" }}>

        {/* ── PAGE HEADER ── */}
        <div className="container" style={{ paddingTop: "3rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--color-border)" }}>
          <h1
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              color: "var(--color-bone)",
              marginBottom: "1.5rem",
            }}
          >
            {activeCategory === "all"
              ? "All Products"
              : CATEGORIES.find((c) => c.slug === activeCategory)?.label || "Collection"}
          </h1>

          {/* Filter + Sort bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            {/* Category chips */}
            <nav aria-label="Category filters" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {CATEGORIES.map((cat) => {
                const active = activeCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => handleFilter(cat.slug)}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8125rem",
                      fontWeight: active ? 600 : 400,
                      padding: "0.4375rem 1rem",
                      border: `1px solid ${active ? "var(--color-bone)" : "var(--color-border)"}`,
                      background: active ? "var(--color-bone)" : "transparent",
                      color: active ? "#FFFFFF" : "var(--color-stone)",
                      borderRadius: "100px",
                      cursor: "pointer",
                      transition: "all 180ms ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) { e.currentTarget.style.borderColor = "var(--color-stone)"; e.currentTarget.style.color = "var(--color-bone)"; }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-stone)"; }
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </nav>

            {/* Sort by */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0 }}>
              <label
                htmlFor="sort-select"
                style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-stone)", whiteSpace: "nowrap" }}
              >
                Sort by
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  color: "var(--color-bone)",
                  background: "transparent",
                  border: "1px solid var(--color-border)",
                  padding: "0.4375rem 2rem 0.4375rem 0.75rem",
                  borderRadius: "100px",
                  cursor: "pointer",
                  outline: "none",
                  appearance: "none",
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23767676' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.625rem center",
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Result count */}
          {!loading && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-dim)", marginTop: "1rem" }}>
              {displayed.length} {displayed.length === 1 ? "product" : "products"}
            </p>
          )}
        </div>

        {/* ── PRODUCT GRID ── */}
        <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
          {loading ? (
            <ShopLoading />
          ) : displayed.length > 0 ? (
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem 1rem" }}
              className="sm:grid-cols-3 lg:grid-cols-4"
            >
              {displayed.map((product, i) => (
                <ProductCard key={product._id || product.slug} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div style={{ paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--color-stone)" }}>
                No products in this category yet.
              </p>
              <button
                onClick={() => handleFilter("all")}
                className="link-cta"
                style={{ marginTop: "1rem", display: "inline-block" }}
              >
                See all products →
              </button>
            </div>
          )}
        </div>

        {/* ── DROP SIGNUP STRIP ── */}
        <div style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
          <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-bone)" }}>
                  Get notified on the next drop.
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-stone)", marginTop: "0.25rem" }}>
                  Early access. No spam.
                </p>
              </div>
              {signupDone ? (
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-steeze-green)" }}>
                  You're on the list ✓
                </p>
              ) : (
                <form onSubmit={handleSignup} style={{ display: "flex", gap: "0.5rem" }} className="w-full sm:w-auto">
                  <input
                    type="text"
                    value={signupValue}
                    onChange={(e) => setSignupValue(e.target.value)}
                    placeholder="WhatsApp or email"
                    className="input"
                    style={{ minWidth: 0, flex: 1 }}
                    required
                    aria-label="WhatsApp number or email"
                  />
                  <button type="submit" className="btn-primary" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
