import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import {
  getAllProducts,
  urlFor,
  saveDropSignup,
} from "../../tees-and-steeze/settings/src/lib/sanity";

const CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "tees", label: "Tees" },
  { slug: "hoodies", label: "Hoodies" },
  { slug: "jerseys", label: "Jerseys" },
  { slug: "pocket-shirts", label: "Pocket Shirts" },
  { slug: "armless", label: "Armless" },
];

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function ProductCard({ product, index }) {
  const [ref, visible] = useReveal(0.1);
  const [hovered, setHovered] = useState(false);

  // Primary image and hover image from Sanity
  const primaryImage =
    product.images && product.images[0]
      ? urlFor(product.images[0]).width(600).quality(80).url()
      : "/products/placeholder.jpg";

  const hoverImage =
    product.images && product.images.length > 2
      ? urlFor(product.images[2]).width(600).quality(80).url() // worn front (3rd image)
      : primaryImage;

  const priceFormatted = `₦${product.price.toLocaleString()}`;

  return (
    <Link
      ref={ref}
      to={`/product/${product.slug}`}
      className="group block"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 500ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 60}ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 60}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden bg-surface"
        style={{ aspectRatio: "3 / 4" }}
      >
        <img
          src={primaryImage}
          alt={`${product.name} — Tee's and Steeze Nigerian streetwear`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: hovered ? 0 : 1,
            transform: hovered ? "scale(1.03)" : "scale(1)",
            transition:
              "opacity 300ms ease, transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
        <img
          src={hoverImage}
          alt={`${product.name} worn — Tee's and Steeze`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "scale(1)" : "scale(1.03)",
            transition:
              "opacity 300ms ease, transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Out of stock overlay */}
        {product.inStock === false && (
          <div className="absolute inset-0 bg-void/60 flex items-center justify-center">
            <span
              className="caption"
              style={{ color: "var(--color-bone)", letterSpacing: "0.12em" }}
            >
              Sold out
            </span>
          </div>
        )}
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-body text-[0.9375rem] font-medium text-bone leading-tight">
            {product.name}
          </h2>
          <p className="font-body text-[0.9375rem] text-stone mt-1">
            {priceFormatted}
          </p>
        </div>
        <span
          className="font-body text-[0.75rem] font-medium uppercase whitespace-nowrap pt-0.5"
          style={{
            letterSpacing: "0.08em",
            color: hovered ? "var(--color-bone)" : "var(--color-dim)",
            transition: "color 200ms ease",
          }}
        >
          View →
        </span>
      </div>
    </Link>
  );
}

function ShopLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
      {[0, 1, 2, 3].map((i) => (
        <div key={i}>
          <div
            className="bg-surface animate-pulse"
            style={{ aspectRatio: "3 / 4" }}
          />
          <div className="mt-5">
            <div
              className="bg-surface animate-pulse"
              style={{ height: "1rem", width: "60%" }}
            />
            <div
              className="bg-surface animate-pulse mt-2"
              style={{ height: "1rem", width: "30%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [signupValue, setSignupValue] = useState("");
  const [signupDone, setSignupDone] = useState(false);

  // Fetch products from Sanity
  useEffect(() => {
    setLoading(true);
    getAllProducts()
      .then((data) => {
        setProducts(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  // Filter products by category
  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleFilter = (slug) => {
    if (slug === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: slug });
    }
    document
      .getElementById("product-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!signupValue.trim()) return;

    saveDropSignup({
      contact: signupValue,
      source: "shop",
    })
      .then(() => setSignupDone(true))
      .catch(() => setSignupDone(true));
  };

  return (
    <>
      <Helmet>
        <title>
          Shop the Collection — Tee's and Steeze | Buy Streetwear Online Nigeria
        </title>
        <meta
          name="description"
          content="Shop unisex streetwear from Tee's and Steeze. Graphic tees, hoodies, jerseys, pocket shirts, and armless pieces. Nationwide delivery. Limited drops."
        />
        <link rel="canonical" href="https://teesandsteeze.com/shop" />
        <meta
          property="og:title"
          content="Shop the Collection — Tee's and Steeze"
        />
        <meta
          property="og:description"
          content="Unisex streetwear. Limited drops. Nationwide delivery."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://teesandsteeze.com/shop" />
        <meta
          property="og:image"
          content="https://teesandsteeze.com/og-shop.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Shop — Tee's and Steeze" />
        <meta
          name="twitter:description"
          content="Not just clothes. The steeze. Shop the drop."
        />
      </Helmet>

      <main>
        {/* ── HEADER ── */}
        <section
          aria-label="Shop header"
          className="container"
          style={{ paddingTop: "clamp(7rem, 12vw, 10rem)", paddingBottom: "0" }}
        >
          <h1 className="display-lg animate-fade-up">The Collection.</h1>
        </section>

        {/* ── FILTER BAR ── */}
        <section
          aria-label="Category filters"
          className="container"
          style={{ paddingTop: "2rem", paddingBottom: "3rem" }}
        >
          <nav
            aria-label="Product categories"
            className="flex flex-wrap gap-2 animate-fade-up animate-delay-100"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleFilter(cat.slug)}
                  className="font-body font-medium uppercase cursor-pointer"
                  style={{
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                    padding: "0.625rem 1.25rem",
                    border: "1px solid",
                    borderColor: isActive
                      ? "var(--color-bone)"
                      : "var(--color-border)",
                    background: isActive ? "var(--color-bone)" : "transparent",
                    color: isActive
                      ? "var(--color-void)"
                      : "var(--color-stone)",
                    borderRadius: "0",
                    transition: "all 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "var(--color-stone)";
                      e.currentTarget.style.color = "var(--color-bone)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      e.currentTarget.style.color = "var(--color-stone)";
                    }
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>

          {!loading && (
            <p className="mt-4 caption" style={{ color: "var(--color-dim)" }}>
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
              {activeCategory !== "all" && (
                <>
                  {" "}
                  in{" "}
                  <span style={{ color: "var(--color-stone)" }}>
                    {CATEGORIES.find((c) => c.slug === activeCategory)?.label}
                  </span>
                </>
              )}
            </p>
          )}
        </section>

        {/* ── PRODUCT GRID ── */}
        <section
          id="product-grid"
          aria-label="Products"
          className="container"
          style={{ paddingBottom: "clamp(4rem, 8vw, 6rem)" }}
        >
          {loading ? (
            <ShopLoading />
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {filtered.map((product, i) => (
                <ProductCard
                  key={product._id || product.slug}
                  product={product}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div
              className="text-center"
              style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
            >
              <p className="body-lg" style={{ color: "var(--color-stone)" }}>
                No pieces in this category yet.
              </p>
              <button
                onClick={() => handleFilter("all")}
                className="link-cta mt-4"
              >
                See all pieces →
              </button>
            </div>
          )}
        </section>

        {/* ── DROP SIGNUP STRIP ── */}
        <section
          aria-label="Drop signup"
          style={{
            borderTop: "1px solid var(--color-border)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div
            className="container flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
            style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem" }}
          >
            <div className="flex-shrink-0">
              <p
                className="font-body font-medium text-bone"
                style={{ fontSize: "0.9375rem" }}
              >
                Next drop coming.
              </p>
              <p
                className="font-body text-stone mt-0.5"
                style={{ fontSize: "0.8125rem" }}
              >
                Early access to every release. No spam. Just the drop.
              </p>
            </div>
            {!signupDone ? (
              <form
                onSubmit={handleSignup}
                className="flex gap-3 w-full sm:w-auto"
              >
                <input
                  type="text"
                  value={signupValue}
                  onChange={(e) => setSignupValue(e.target.value)}
                  placeholder="WhatsApp or email"
                  className="input flex-1 sm:flex-none"
                  style={{ minWidth: "220px" }}
                  required
                  aria-label="WhatsApp number or email for drop notifications"
                />
                <button type="submit" className="btn-signup whitespace-nowrap">
                  Get early access
                </button>
              </form>
            ) : (
              <p
                className="font-body font-medium"
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-steeze-green)",
                }}
              >
                You're on the list. ✓
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
