import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { getProductBySlug, getRelatedProducts, urlFor } from "../../tees-and-steeze/settings/src/lib/sanity";
import { useCart } from "../context/CartContext";
import { useSiteSettings } from "../context/SiteSettingsContext";

/*
 * ── SCROLL REVEAL HOOK ──
 */
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

/*
 * ── PRODUCT HERO — Images + Details ──
 */
function ProductHero({ product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();
  const settings = useSiteSettings();

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem(
      {
        id: product.slug,
        name: product.name,
        price: product.price,
        priceFormatted: `₦${product.price.toLocaleString()}`,
        images: product.images.map((img) => urlFor(img).width(400).url()),
      },
      selectedSize,
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <section
      aria-label="Product details"
      className="container"
      style={{
        paddingTop: "clamp(6rem, 10vw, 8rem)",
        paddingBottom: "clamp(3rem, 6vw, 4rem)",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* ── IMAGES ── */}
        <div>
          <div
            className="relative overflow-hidden bg-surface animate-fade-up"
            style={{ aspectRatio: "3 / 4" }}
          >
            {product.images && product.images[activeImage] && (
              <img
                src={urlFor(product.images[activeImage])
                  .width(800)
                  .quality(85)
                  .url()}
                alt={`${product.name} — ${["Front", "Back", "Worn front", "Worn back"][activeImage] || "View"} — Tee's and Steeze`}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transition: "opacity 300ms ease" }}
              />
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-3 animate-fade-up animate-delay-100">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className="relative overflow-hidden cursor-pointer"
                  style={{
                    width: `${100 / product.images.length}%`,
                    aspectRatio: "3 / 4",
                    border:
                      activeImage === i
                        ? "2px solid var(--color-bone)"
                        : "2px solid transparent",
                    transition: "border-color 200ms ease",
                    background: "var(--color-surface)",
                  }}
                  aria-label={`View image ${i + 1}`}
                >
                  <img
                    src={urlFor(img).width(200).quality(70).url()}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      opacity: activeImage === i ? 1 : 0.5,
                      transition: "opacity 200ms ease",
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── DETAILS (sticky) ── */}
        <div
          className="lg:sticky animate-fade-up animate-delay-200"
          style={{ top: "120px", alignSelf: "start" }}
        >
          <h1
            className="font-display font-semibold uppercase text-bone"
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
            }}
          >
            {product.name}
          </h1>

          <p
            className="mt-3 font-body text-bone"
            style={{ fontSize: "1.25rem" }}
          >
            ₦{product.price.toLocaleString()}
          </p>

          {/* Size selector */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <span className="caption" style={{ color: "var(--color-stone)" }}>
                Size
              </span>
              <button
                onClick={() => setSizeGuideOpen(!sizeGuideOpen)}
                className="caption cursor-pointer"
                style={{
                  color: "var(--color-steeze-pink)",
                  background: "none",
                  border: "none",
                  letterSpacing: "0.08em",
                }}
              >
                Size guide {sizeGuideOpen ? "↑" : "↓"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.sizes &&
                product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="font-body font-medium cursor-pointer"
                    style={{
                      fontSize: "0.8125rem",
                      padding: "0.75rem 1.25rem",
                      border: "1px solid",
                      borderColor:
                        selectedSize === size
                          ? "var(--color-bone)"
                          : "var(--color-border)",
                      background:
                        selectedSize === size
                          ? "var(--color-bone)"
                          : "transparent",
                      color:
                        selectedSize === size
                          ? "var(--color-void)"
                          : "var(--color-stone)",
                      borderRadius: "0",
                      transition: "all 200ms ease",
                    }}
                  >
                    {size}
                  </button>
                ))}
            </div>

            {/* Size guide */}
            {sizeGuideOpen &&
              product.sizeGuide &&
              product.sizeGuide.length > 0 && (
                <div
                  className="mt-4 animate-fade-up"
                  style={{
                    background: "var(--color-surface)",
                    padding: "1.25rem",
                  }}
                >
                  <p
                    className="caption mb-3"
                    style={{ color: "var(--color-dim)" }}
                  >
                    Size guide
                  </p>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8125rem",
                    }}
                  >
                    <thead>
                      <tr>
                        {[
                          "Size",
                          "Chest (cm)",
                          "Length (cm)",
                          "Shoulder (cm)",
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              textAlign: "left",
                              padding: "6px 8px",
                              borderBottom: "1px solid var(--color-border)",
                              color: "var(--color-stone)",
                              fontWeight: 500,
                              fontSize: "0.75rem",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {product.sizeGuide.map((row) => (
                        <tr key={row.size}>
                          <td
                            style={{
                              padding: "6px 8px",
                              borderBottom: "1px solid var(--color-border)",
                              color: "var(--color-bone)",
                              fontWeight: 500,
                            }}
                          >
                            {row.size}
                          </td>
                          <td
                            style={{
                              padding: "6px 8px",
                              borderBottom: "1px solid var(--color-border)",
                              color: "var(--color-stone)",
                            }}
                          >
                            {row.chest}
                          </td>
                          <td
                            style={{
                              padding: "6px 8px",
                              borderBottom: "1px solid var(--color-border)",
                              color: "var(--color-stone)",
                            }}
                          >
                            {row.length}
                          </td>
                          <td
                            style={{
                              padding: "6px 8px",
                              borderBottom: "1px solid var(--color-border)",
                              color: "var(--color-stone)",
                            }}
                          >
                            {row.shoulder}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p
                    className="mt-3 font-body font-medium"
                    style={{ fontSize: "0.75rem", color: "var(--color-bone)" }}
                  >
                    Fits exactly as shown. Measured flat.
                  </p>
                </div>
              )}
          </div>

          {/* Add to cart */}
          <div className="mt-8">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || !product.inStock}
              className="w-full cursor-pointer font-body font-medium uppercase"
              style={{
                fontSize: "0.8125rem",
                letterSpacing: "0.08em",
                padding: "1.125rem 2rem",
                border: "none",
                borderRadius: "0",
                background: addedToCart
                  ? "var(--color-steeze-green)"
                  : !selectedSize
                    ? "var(--color-surface-elevated)"
                    : !product.inStock
                      ? "var(--color-surface-elevated)"
                      : "var(--color-steeze-pink)",
                color: addedToCart
                  ? "var(--color-void)"
                  : !selectedSize || !product.inStock
                    ? "var(--color-dim)"
                    : "var(--color-bone)",
                transition: "all 200ms ease",
                cursor:
                  !selectedSize || !product.inStock ? "not-allowed" : "pointer",
              }}
            >
              {!product.inStock
                ? "Sold out"
                : addedToCart
                  ? "✓ Added to cart"
                  : !selectedSize
                    ? "Select a size"
                    : "Add to cart"}
            </button>
            <p
              className="mt-3 text-center"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--color-dim)",
              }}
            >
              {settings.deliveryInfo}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/*
 * ── PRODUCT STORY ──
 */
function ProductStory({ product }) {
  const [ref, visible] = useReveal(0.2);
  if (!product.story) return null;

  return (
    <section
      ref={ref}
      aria-label="Product story"
      className="container"
      style={{
        paddingTop: "clamp(3rem, 6vw, 4rem)",
        paddingBottom: "clamp(3rem, 6vw, 4rem)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: "720px" }}>
        <h2
          className="display-sm"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition:
              "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          The story.
        </h2>
        <p
          className="body-lg mt-6"
          style={{
            color: "var(--color-stone)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition:
              "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1) 100ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 100ms",
          }}
        >
          {product.story}
        </p>
        <p
          className="mt-4 body-lg font-medium"
          style={{
            color: "var(--color-bone)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition:
              "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 200ms",
          }}
        >
          Wear it how you want. That's the point.
        </p>
      </div>
    </section>
  );
}

/*
 * ── CUSTOMER PHOTOS ──
 */
function CustomerPhotos({ product }) {
  const [ref, visible] = useReveal(0.1);
  if (!product.customerPhotos || product.customerPhotos.length === 0)
    return null;

  return (
    <section
      ref={ref}
      aria-label="Customer photos"
      className="container"
      style={{
        paddingTop: "clamp(3rem, 6vw, 4rem)",
        paddingBottom: "clamp(3rem, 6vw, 4rem)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <h2
        className="display-sm mb-8"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition:
            "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        Real fits.
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {product.customerPhotos.map((photo, i) => (
          <div
            key={i}
            className="relative overflow-hidden group"
            style={{
              aspectRatio: "1 / 1",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 500ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms`,
            }}
          >
            <img
              src={urlFor(photo).width(400).quality(80).url()}
              alt={`Customer wearing ${product.name} — Tee's and Steeze`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
            {photo.handle && (
              <div
                className="absolute bottom-0 left-0 right-0 px-2 py-1.5 opacity-0 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 100%)",
                  transition: "opacity 200ms ease",
                }}
              >
                <span
                  className="caption"
                  style={{ color: "var(--color-bone)" }}
                >
                  {photo.handle}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/*
 * ── DELIVERY & RETURNS ──
 */
function DeliveryReturns() {
  const [ref, visible] = useReveal(0.2);
  const settings = useSiteSettings();

  return (
    <section
      ref={ref}
      aria-label="Delivery and returns"
      className="container"
      style={{
        paddingTop: "clamp(3rem, 6vw, 4rem)",
        paddingBottom: "clamp(3rem, 6vw, 4rem)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: "720px" }}>
        <h2
          className="display-sm"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition:
              "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          Delivery & returns.
        </h2>
        <div
          className="mt-6 space-y-5"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition:
              "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1) 100ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 100ms",
          }}
        >
          <p className="body-lg" style={{ color: "var(--color-stone)" }}>
            {settings.deliveryDetails}
          </p>
          <p className="body-lg" style={{ color: "var(--color-stone)" }}>
            {settings.returnsPolicy.split("No long forms")[0]}
            <span
              className="font-medium"
              style={{ color: "var(--color-bone)" }}
            >
              No long forms, no back-and-forth, no ghosting.
            </span>
            {settings.returnsPolicy.split("no ghosting.")[1] ||
              " We built this brand on trust and that doesn't stop after you pay."}
          </p>
        </div>
      </div>
    </section>
  );
}

/*
 * ── MORE STEEZE ──
 */
function MoreSteeze({ currentSlug }) {
  const [ref, visible] = useReveal(0.1);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    getRelatedProducts(currentSlug, 3).then(setRelated);
  }, [currentSlug]);

  if (related.length === 0) return null;

  return (
    <section
      ref={ref}
      aria-label="Related products"
      className="container"
      style={{
        paddingTop: "clamp(3rem, 6vw, 4rem)",
        paddingBottom: "clamp(4rem, 8vw, 6rem)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <h2
        className="display-sm mb-8 md:mb-12"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition:
            "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        More steeze.
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {related.map((item, i) => (
          <RelatedCard
            key={item._id}
            product={item}
            index={i}
            visible={visible}
          />
        ))}
      </div>
    </section>
  );
}

function RelatedCard({ product, index, visible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 500ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden bg-surface"
        style={{ aspectRatio: "3 / 4" }}
      >
        {product.images && product.images[0] && (
          <img
            src={urlFor(product.images[0]).width(500).quality(80).url()}
            alt={`${product.name} — Tee's and Steeze`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: hovered ? "scale(1.03)" : "scale(1)",
              transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        )}
      </div>
      <div className="mt-4">
        <h3 className="font-body text-[0.9375rem] font-medium text-bone leading-tight">
          {product.name}
        </h3>
        <p className="font-body text-[0.9375rem] text-stone mt-1">
          ₦{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

/*
 * ── LOADING STATE ──
 */
function ProductLoading() {
  return (
    <main
      className="container"
      style={{
        paddingTop: "clamp(6rem, 10vw, 8rem)",
        paddingBottom: "clamp(4rem, 8vw, 6rem)",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <div
          className="bg-surface animate-pulse"
          style={{ aspectRatio: "3 / 4" }}
        />
        <div>
          <div
            className="bg-surface animate-pulse"
            style={{ height: "2rem", width: "60%", marginBottom: "1rem" }}
          />
          <div
            className="bg-surface animate-pulse"
            style={{ height: "1.5rem", width: "30%", marginBottom: "2rem" }}
          />
          <div
            className="bg-surface animate-pulse"
            style={{ height: "3rem", width: "100%" }}
          />
        </div>
      </div>
    </main>
  );
}

/*
 * ── MAIN PAGE ──
 */
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
        if (!data) {
          setNotFound(true);
        } else {
          setProduct(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <ProductLoading />;

  if (notFound) {
    return (
      <main
        className="container text-center"
        style={{ paddingTop: "10rem", paddingBottom: "10rem" }}
      >
        <h1 className="display-md">Piece not found.</h1>
        <Link to="/shop" className="link-cta mt-6 inline-block">
          Back to the collection →
        </Link>
      </main>
    );
  }

  const priceFormatted = `₦${product.price.toLocaleString()}`;
  const firstImageUrl =
    product.images && product.images[0]
      ? urlFor(product.images[0]).width(1200).url()
      : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.story || "",
    image: product.images
      ? product.images.map((img) => urlFor(img).width(1200).url())
      : [],
    brand: { "@type": "Brand", name: "Tee's and Steeze" },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "NGN",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://teesandsteeze.com/product/${product.slug}`,
      shippingDetails: {
        "@type": "OfferShippingDetails",
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          businessDays: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 5,
          },
        },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "NG" },
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>
          {product.name} — Tee's and Steeze | Unisex Streetwear Nigeria
        </title>
        <meta
          name="description"
          content={`${product.name} by Tee's and Steeze. ${priceFormatted}. ${(product.story || "").slice(0, 120)}... Shop unisex streetwear. Nationwide delivery.`}
        />
        <link
          rel="canonical"
          href={`https://teesandsteeze.com/product/${product.slug}`}
        />
        <meta
          property="og:title"
          content={`${product.name} — Tee's and Steeze`}
        />
        <meta
          property="og:description"
          content={(product.story || "").slice(0, 150)}
        />
        <meta property="og:type" content="product" />
        <meta
          property="og:url"
          content={`https://teesandsteeze.com/product/${product.slug}`}
        />
        <meta property="og:image" content={firstImageUrl} />
        <meta property="product:price:amount" content={product.price} />
        <meta property="product:price:currency" content="NGN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${product.name} — Tee's and Steeze`}
        />
        <meta
          name="twitter:description"
          content={`${priceFormatted}. ${(product.story || "").slice(0, 100)}`}
        />
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
