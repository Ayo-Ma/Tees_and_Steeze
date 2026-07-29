import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { getProductBySlug, getRelatedProducts, urlFor } from "../../tees-and-steeze/settings/src/lib/sanity";
import { useCart } from "../context/CartContext";
import { useSiteSettings } from "../context/SiteSettingsContext";

function useReveal(threshold = 0.12) {
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

/* ── PRODUCT HERO ── */
function ProductHero({ product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const { addItem, items, updateQuantity, removeItem } = useCart();
  const settings = useSiteSettings();

  const inStock = product.inStock !== false;
  const hasColors = product.colors?.length > 0;
  const colorName = selectedColor?.name || null;

  const cartItem = selectedSize
    ? items.find((i) => i.id === product.slug && i.size === selectedSize && i.color === colorName)
    : null;

  const canAdd = inStock && selectedSize && (!hasColors || selectedColor);
  const buttonText = !inStock
    ? "Sold out"
    : !selectedSize
      ? "Select a size"
      : hasColors && !selectedColor
        ? "Select a color"
        : "Add to bag";

  const handleAddToCart = () => {
    if (!canAdd) return;
    addItem(
      {
        id: product.slug,
        name: product.name,
        price: product.price,
        priceFormatted: `₦${product.price.toLocaleString()}`,
        images: product.images.map((img) => urlFor(img).width(400).url()),
      },
      selectedSize,
      colorName,
    );
  };

  const handleDecrement = () => {
    if (!cartItem) return;
    if (cartItem.quantity <= 1) {
      removeItem(product.slug, selectedSize, colorName);
    } else {
      updateQuantity(product.slug, selectedSize, cartItem.quantity - 1, colorName);
    }
  };

  const handleIncrement = () => {
    if (!cartItem) return;
    updateQuantity(product.slug, selectedSize, cartItem.quantity + 1, colorName);
  };

  return (
    <section
      aria-label="Product details"
      className="product-page-section"
    >
      {/* Breadcrumb */}
      <div
        className="container"
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          color: "var(--color-dim)",
        }}
      >
        <Link to="/shop" style={{ color: "var(--color-dim)", textDecoration: "none", transition: "color 150ms ease" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-bone)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-dim)")}
        >
          Shop
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link to={`/shop?category=${product.category}`}
              style={{ color: "var(--color-dim)", textDecoration: "none", textTransform: "capitalize", transition: "color 150ms ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-bone)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-dim)")}
            >
              {product.category}
            </Link>
            <span>/</span>
          </>
        )}
        <span style={{ color: "var(--color-stone)" }}>{product.name}</span>
      </div>

      {/* Main grid */}
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
            paddingBottom: "3rem",
          }}
          className="lg:grid-cols-[1fr_400px] product-main-grid"
        >
          {/* ── LEFT: IMAGES ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {/* Main image */}
            <div
              className="animate-fade-up bg-surface product-main-image"
              style={{ position: "relative", overflow: "hidden", aspectRatio: "3 / 4" }}
            >
              {product.images?.[activeImage] && (
                <img
                  key={activeImage}
                  src={urlFor(product.images[activeImage]).width(900).quality(88).url()}
                  alt={`${product.name} — ${["Front", "Back", "Worn front", "Worn back"][activeImage] || "View"}`}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "opacity 250ms ease" }}
                />
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-1.5 animate-fade-up animate-delay-100">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    aria-label={`View image ${i + 1}`}
                    style={{
                      flex: 1,
                      aspectRatio: "3 / 4",
                      position: "relative",
                      overflow: "hidden",
                      background: "var(--color-surface)",
                      border: "none",
                      cursor: "pointer",
                      outline: activeImage === i ? "2px solid var(--color-bone)" : "2px solid transparent",
                      outlineOffset: "0",
                      transition: "outline-color 150ms ease",
                    }}
                  >
                    <img
                      src={urlFor(img).width(200).quality(70).url()}
                      alt=""
                      loading="lazy"
                      style={{
                        position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                        opacity: activeImage === i ? 1 : 0.45,
                        transition: "opacity 150ms ease",
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: DETAILS (sticky) ── */}
          <div
            className="animate-fade-up animate-delay-100"
            style={{ alignSelf: "start" }}
          >
            <div style={{ position: "sticky", top: "80px" }}>
              {/* Category tag */}
              {product.category && (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-stone)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {product.category}
                </p>
              )}

              {/* Name */}
              <h1
                className="product-page-name"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  color: "var(--color-bone)",
                  lineHeight: 1.05,
                  marginBottom: "0.75rem",
                }}
              >
                {product.name}
              </h1>

              {/* Price */}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1.25rem",
                  fontWeight: 500,
                  color: "var(--color-bone)",
                  marginBottom: "2rem",
                }}
              >
                ₦{product.price.toLocaleString()}
              </p>

              {/* Divider */}
              <div style={{ height: "1px", background: "var(--color-border)", marginBottom: "2rem" }} />

              {/* Color selector */}
              {hasColors && (
                <div style={{ marginBottom: "1.75rem" }}>
                  <span
                    style={{
                      display: "block",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--color-stone)",
                      marginBottom: "0.875rem",
                    }}
                  >
                    Color{selectedColor ? `: ${selectedColor.name}` : ""}
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        aria-label={color.name}
                        title={color.name}
                        style={{
                          width: "1.875rem",
                          height: "1.875rem",
                          borderRadius: "50%",
                          background: color.hex || "#888",
                          border: "1.5px solid rgba(255,255,255,0.15)",
                          padding: 0,
                          cursor: "pointer",
                          outline: selectedColor?.name === color.name
                            ? "2px solid var(--color-bone)"
                            : "2px solid transparent",
                          outlineOffset: "2px",
                          transition: "outline-color 150ms ease",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size selector */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.875rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--color-stone)",
                    }}
                  >
                    Select size
                  </span>
                  <button
                    onClick={() => setSizeGuideOpen(!sizeGuideOpen)}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--color-steeze-pink)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Size guide {sizeGuideOpen ? "↑" : "↓"}
                  </button>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        padding: "0.75rem 1.125rem",
                        border: "1.5px solid",
                        borderColor: selectedSize === size ? "var(--color-bone)" : "var(--color-border)",
                        background: selectedSize === size ? "var(--color-bone)" : "transparent",
                        color: selectedSize === size ? "var(--color-void)" : "var(--color-stone)",
                        cursor: "pointer",
                        transition: "all 150ms ease",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Size guide table */}
                {sizeGuideOpen && product.sizeGuide?.length > 0 && (
                  <div
                    className="animate-fade-up"
                    style={{ marginTop: "1rem", background: "var(--color-surface)", padding: "1.25rem" }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--color-dim)",
                        marginBottom: "0.875rem",
                      }}
                    >
                      Size guide (cm) — measured flat
                    </p>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: "0.8125rem" }}>
                      <thead>
                        <tr>
                          {["Size", "Chest", "Length", "Shoulder"].map((h) => (
                            <th key={h} style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid var(--color-border)", color: "var(--color-stone)", fontWeight: 600, fontSize: "0.75rem" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {product.sizeGuide.map((row) => (
                          <tr key={row.size}>
                            <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--color-border)", color: "var(--color-bone)", fontWeight: 600 }}>{row.size}</td>
                            <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--color-border)", color: "var(--color-stone)" }}>{row.chest}</td>
                            <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--color-border)", color: "var(--color-stone)" }}>{row.length}</td>
                            <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--color-border)", color: "var(--color-stone)" }}>{row.shoulder}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Add to bag / Qty stepper */}
              <div style={{ marginTop: "1.5rem" }}>
                {cartItem ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      border: "1.5px solid var(--color-steeze-pink)",
                      borderRadius: "9999px",
                      overflow: "hidden",
                      height: "3.25rem",
                    }}
                  >
                    <button
                      onClick={handleDecrement}
                      aria-label="Decrease quantity"
                      style={{
                        flex: "0 0 3.25rem",
                        height: "100%",
                        background: "transparent",
                        border: "none",
                        color: "var(--color-steeze-pink)",
                        fontSize: "1.5rem",
                        fontWeight: 300,
                        cursor: "pointer",
                        transition: "background 150ms ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(232,75,138,0.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      −
                    </button>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.9375rem",
                        fontWeight: 700,
                        color: "var(--color-bone)",
                        letterSpacing: "0.04em",
                        userSelect: "none",
                      }}
                    >
                      {cartItem.quantity} in bag
                    </span>
                    <button
                      onClick={handleIncrement}
                      aria-label="Increase quantity"
                      style={{
                        flex: "0 0 3.25rem",
                        height: "100%",
                        background: "transparent",
                        border: "none",
                        color: "var(--color-steeze-pink)",
                        fontSize: "1.25rem",
                        fontWeight: 400,
                        cursor: "pointer",
                        transition: "background 150ms ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(232,75,138,0.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={!canAdd}
                    style={{
                      width: "100%",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "1.125rem 2rem",
                      border: "none",
                      borderRadius: "9999px",
                      background: canAdd ? "var(--color-steeze-pink)" : "var(--color-surface-elevated)",
                      color: canAdd ? "#FFFFFF" : "var(--color-dim)",
                      cursor: canAdd ? "pointer" : "not-allowed",
                      transition: "all 200ms ease",
                    }}
                  >
                    {buttonText}
                  </button>
                )}

                <p
                  style={{
                    marginTop: "0.875rem",
                    textAlign: "center",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    color: "var(--color-dim)",
                  }}
                >
                  {settings.deliveryInfo || "Ships nationwide · 3–5 business days"}
                </p>
              </div>

              {/* Trust signals */}
              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid var(--color-border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.625rem",
                }}
              >
                {[
                  "Secure payment via Paystack",
                  "WhatsApp support on every order",
                  "48-hour return window",
                ].map((t) => (
                  <p
                    key={t}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      color: "var(--color-dim)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ color: "var(--color-steeze-green)", fontSize: "0.625rem" }}>●</span>
                    {t}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── PRODUCT STORY ── */
function ProductStory({ product }) {
  const [ref, visible] = useReveal(0.15);
  if (!product.story) return null;

  return (
    <section
      ref={ref}
      aria-label="Product story"
      style={{
        borderTop: "1px solid var(--color-border)",
        paddingTop: "clamp(3rem, 6vw, 5rem)",
        paddingBottom: "clamp(3rem, 6vw, 5rem)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2.5rem",
          }}
          className="lg:grid-cols-[280px_1fr]"
        >
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 500ms ease, transform 500ms ease",
            }}
          >
            <div className="section-eyebrow">
              <span className="section-eyebrow-label">The story</span>
            </div>
            <h2 className="display-sm" style={{ marginTop: "0.5rem" }}>Behind the piece.</h2>
          </div>

          <div
            style={{
              maxWidth: "600px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 500ms ease 100ms, transform 500ms ease 100ms",
            }}
          >
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--color-stone)", lineHeight: 1.8, marginBottom: "1.25rem" }}>
              {product.story}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 600, color: "var(--color-bone)" }}>
              Wear it how you want. That's the point.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CUSTOMER PHOTOS ── */
function CustomerPhotos({ product }) {
  const [ref, visible] = useReveal(0.08);
  if (!product.customerPhotos?.length) return null;

  return (
    <section
      ref={ref}
      aria-label="Customer photos"
      style={{
        borderTop: "1px solid var(--color-border)",
        paddingTop: "clamp(3rem, 6vw, 5rem)",
        paddingBottom: "clamp(3rem, 6vw, 5rem)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "1rem",
            marginBottom: "2rem",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 500ms ease, transform 500ms ease",
          }}
        >
          <div>
            <div className="section-eyebrow">
              <span className="section-eyebrow-label">Community</span>
            </div>
            <h2 className="display-sm" style={{ marginTop: "0.5rem" }}>Real fits.</h2>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1px",
            background: "var(--color-border)",
          }}
          className="sm:grid-cols-4"
        >
          {product.customerPhotos.map((photo, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                overflow: "hidden",
                aspectRatio: "1 / 1",
                background: "var(--color-surface)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 450ms ease ${i * 60}ms, transform 450ms ease ${i * 60}ms`,
              }}
            >
              <img
                src={urlFor(photo).width(400).quality(80).url()}
                alt={`Customer wearing ${product.name}`}
                loading="lazy"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 400ms ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              {photo.handle && (
                <div
                  style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    padding: "0.75rem",
                    background: "linear-gradient(to top, rgba(10,10,10,0.65) 0%, transparent 100%)",
                    opacity: 0, transition: "opacity 200ms ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                >
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-bone)" }}>
                    @{photo.handle}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── DELIVERY & RETURNS ── */
function DeliveryReturns() {
  const [ref, visible] = useReveal(0.15);
  const settings = useSiteSettings();

  return (
    <section
      ref={ref}
      aria-label="Delivery and returns"
      style={{
        borderTop: "1px solid var(--color-border)",
        paddingTop: "clamp(3rem, 6vw, 5rem)",
        paddingBottom: "clamp(3rem, 6vw, 5rem)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
          }}
          className="lg:grid-cols-2"
        >
          {/* Delivery */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 500ms ease, transform 500ms ease",
            }}
          >
            <div className="section-eyebrow">
              <span className="section-eyebrow-label">Delivery</span>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "var(--color-stone)", lineHeight: 1.75, marginTop: "1rem" }}>
              {settings.deliveryDetails}
            </p>
          </div>

          {/* Returns */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 500ms ease 100ms, transform 500ms ease 100ms",
            }}
          >
            <div className="section-eyebrow">
              <span className="section-eyebrow-label">Returns</span>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "var(--color-stone)", lineHeight: 1.75, marginTop: "1rem" }}>
              {settings.returnsPolicy?.split("No long forms")[0]}
              <span style={{ fontWeight: 600, color: "var(--color-bone)" }}>No long forms, no back-and-forth, no ghosting.</span>
              {settings.returnsPolicy?.split("no ghosting.")[1] || " We built this brand on trust and that doesn't stop after you pay."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── MORE STEEZE ── */
function RelatedCard({ product, index, visible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={`/product/${product.slug}`}
      style={{
        display: "block",
        textDecoration: "none",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 500ms ease ${index * 80}ms, transform 500ms ease ${index * 80}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          aspectRatio: "3 / 4",
          background: "var(--color-surface)",
        }}
      >
        {product.images?.[0] && (
          <img
            src={urlFor(product.images[0]).width(500).quality(80).url()}
            alt={product.name}
            loading="lazy"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 400ms cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        )}
      </div>
      <div style={{ paddingTop: "0.875rem" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 500, color: "var(--color-bone)", marginBottom: "0.25rem" }}>
          {product.name}
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-stone)" }}>
          ₦{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

function MoreSteeze({ currentSlug }) {
  const [ref, visible] = useReveal(0.08);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    getRelatedProducts(currentSlug, 3).then(setRelated);
  }, [currentSlug]);

  if (!related.length) return null;

  return (
    <section
      ref={ref}
      aria-label="Related products"
      style={{
        borderTop: "1px solid var(--color-border)",
        paddingTop: "clamp(3rem, 6vw, 5rem)",
        paddingBottom: "clamp(4rem, 8vw, 6rem)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "1rem",
            marginBottom: "2.5rem",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 500ms ease, transform 500ms ease",
          }}
        >
          <div>
            <div className="section-eyebrow">
              <span className="section-eyebrow-label">You might also like</span>
            </div>
            <h2 className="display-sm" style={{ marginTop: "0.5rem" }}>More steeze.</h2>
          </div>
          <Link to="/shop" className="link-cta" style={{ marginBottom: "0.25rem", whiteSpace: "nowrap" }}>
            Shop all →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: "1.5rem",
          }}
          className="sm:grid-cols-3"
        >
          {related.map((item, i) => (
            <RelatedCard key={item._id} product={item} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── LOADING ── */
function ProductLoading() {
  return (
    <main
      className="container"
      style={{ paddingTop: "clamp(6rem, 10vw, 8rem)", paddingBottom: "clamp(4rem, 8vw, 6rem)" }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "3rem" }}>
        <div className="bg-surface animate-pulse" style={{ aspectRatio: "3 / 4" }} />
        <div>
          <div className="bg-surface animate-pulse" style={{ height: "0.75rem", width: "40%", marginBottom: "1rem" }} />
          <div className="bg-surface animate-pulse" style={{ height: "2.5rem", width: "80%", marginBottom: "0.75rem" }} />
          <div className="bg-surface animate-pulse" style={{ height: "1.5rem", width: "30%", marginBottom: "2rem" }} />
          <div className="bg-surface animate-pulse" style={{ height: "3.5rem", width: "100%" }} />
        </div>
      </div>
    </main>
  );
}

/* ── MAIN ── */
export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    window.scrollTo(0, 0);
    getProductBySlug(id)
      .then((data) => {
        if (!data) setNotFound(true);
        else setProduct(data);
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  if (loading) return <ProductLoading />;

  if (notFound) {
    return (
      <main className="container text-center" style={{ paddingTop: "10rem", paddingBottom: "10rem" }}>
        <h1 className="display-md">Piece not found.</h1>
        <Link to="/shop" className="link-cta mt-6 inline-block">
          Back to the collection →
        </Link>
      </main>
    );
  }

  const priceFormatted = `₦${product.price.toLocaleString()}`;
  const firstImageUrl = product.images?.[0] ? urlFor(product.images[0]).width(1200).url() : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.story || "",
    image: product.images ? product.images.map((img) => urlFor(img).width(1200).url()) : [],
    brand: { "@type": "Brand", name: "Tee's and Steeze" },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "NGN",
      availability: product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://teesandsteeze.com/product/${product.slug}`,
      shippingDetails: {
        "@type": "OfferShippingDetails",
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          businessDays: { "@type": "QuantitativeValue", minValue: 3, maxValue: 5 },
        },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "NG" },
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>{product.name} — Tee's and Steeze | Unisex Streetwear Nigeria</title>
        <meta name="description" content={`${product.name} by Tee's and Steeze. ${priceFormatted}. ${(product.story || "").slice(0, 120)}... Shop unisex streetwear. Nationwide delivery.`} />
        <link rel="canonical" href={`https://teesandsteeze.com/product/${product.slug}`} />
        <meta property="og:title" content={`${product.name} — Tee's and Steeze`} />
        <meta property="og:description" content={(product.story || "").slice(0, 150)} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://teesandsteeze.com/product/${product.slug}`} />
        <meta property="og:image" content={firstImageUrl} />
        <meta property="product:price:amount" content={product.price} />
        <meta property="product:price:currency" content="NGN" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <main>
        <ProductHero product={product} />
        <ProductStory product={product} />
        <CustomerPhotos product={product} />
        <DeliveryReturns />
        <MoreSteeze currentSlug={product.slug} />
      </main>
    </>
  );
}
