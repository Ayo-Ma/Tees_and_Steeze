import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getHomepage, urlFor } from "../../tees-and-steeze/settings/src/lib/sanity";

const DEFAULTS = {
  headline: "Wear the steeze.",
  subheadline: "Unisex streetwear from Jos, Nigeria. Built with story.",
  heroImage: "/hero.jpg",
};

export default function Hero() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getHomepage()
      .then((d) => { if (d) setData(d); })
      .catch(() => {});
  }, []);

  const headline = data?.heroHeadline || DEFAULTS.headline;
  const subheadline = data?.heroSubheadline || DEFAULTS.subheadline;
  const heroImage = data?.heroImage
    ? urlFor(data.heroImage).width(1800).quality(85).url()
    : DEFAULTS.heroImage;

  const dotIdx = headline.indexOf(".");
  const headlineMain = dotIdx > -1 ? headline.slice(0, dotIdx + 1) : headline;
  const headlineRest = dotIdx > -1 ? headline.slice(dotIdx + 1).trim() : "";

  return (
    <>
      <Helmet>
        <title>Tee's and Steeze — Nigerian Unisex Streetwear | Shop the Drop</title>
        <meta name="description" content="Unisex streetwear from Jos, Nigeria. Graphic tees, hoodies, jerseys, and more — built with real story, real steeze. Shop the latest drop." />
        <meta name="keywords" content="Nigerian streetwear, unisex fashion Nigeria, Jos fashion brand, graphic tees Nigeria, Tees and Steeze, African streetwear" />
        <link rel="canonical" href="https://teesandsteeze.com" />
        <meta property="og:title" content="Tee's and Steeze — Nigerian Unisex Streetwear" />
        <meta property="og:description" content="Unisex streetwear from Jos, Nigeria. Built with story. Worn with steeze." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://teesandsteeze.com" />
        <meta property="og:image" content="https://teesandsteeze.com/og-home.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Tee's and Steeze",
          "url": "https://teesandsteeze.com",
          "logo": "https://teesandsteeze.com/logo.avif",
          "description": "Unisex streetwear brand from Jos, Nigeria.",
          "address": { "@type": "PostalAddress", "addressLocality": "Jos", "addressCountry": "NG" },
          "sameAs": ["https://instagram.com/teesandsteeze", "https://tiktok.com/@teesandsteeze"]
        })}</script>
      </Helmet>

      <section
        aria-label="Hero"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
        }}
      >
        {/* Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            zIndex: 0,
          }}
        />

        {/* Gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10,10,10,0.93) 0%, rgba(10,10,10,0.38) 55%, rgba(10,10,10,0.1) 100%)",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div
          className="container hero-content"
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Eyebrow */}
          <p
            className="animate-fade-up"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-steeze-pink)",
              marginBottom: "1.25rem",
            }}
          >
            Tee's & Steeze · Jos, Nigeria
          </p>

          {/* Headline */}
          <h1
            className="display-xl animate-fade-up animate-delay-100"
            style={{ maxWidth: "min(900px, 85vw)", marginBottom: "1.75rem" }}
          >
            {headlineMain}
            {headlineRest && (
              <> <span style={{ color: "var(--color-steeze-pink)" }}>{headlineRest}</span></>
            )}
          </h1>

          {/* Sub */}
          <p
            className="animate-fade-up animate-delay-200"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              fontWeight: 400,
              color: "rgba(245,244,240,0.65)",
              maxWidth: "440px",
              lineHeight: 1.65,
              marginBottom: "2.5rem",
            }}
          >
            {subheadline}
          </p>

          {/* CTAs */}
          <div className="flex items-center flex-wrap gap-4 animate-fade-up animate-delay-300">
            <Link to="/shop" className="btn-primary">
              Shop the drop
            </Link>
            <Link
              to="/drop"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(245,244,240,0.65)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "color 200ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-bone)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,244,240,0.65)")}
            >
              Get early access →
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="animate-fade-in animate-delay-400"
          style={{
            position: "absolute",
            bottom: "1.5rem",
            right: "1.75rem",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div style={{ width: "1px", height: "36px", background: "linear-gradient(to bottom, transparent, rgba(245,244,240,0.3))" }} />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.5625rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(245,244,240,0.35)",
              writingMode: "vertical-rl",
            }}
          >
            Scroll
          </span>
        </div>
      </section>
    </>
  );
}
