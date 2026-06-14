import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  getHomepage,
  urlFor,
} from "../../tees-and-steeze/settings/src/lib/sanity";
import { useSiteSettings } from "../context/SiteSettingsContext";

export default function Hero() {
  const settings = useSiteSettings();
  const [hero, setHero] = useState({
    headline: "Not just clothes. The steeze.",
    subheadline:
      "Three years of building something that means something. Unisex streetwear for people who'd rather be felt than followed.",
    cta: "Shop the drop",
    secondaryLink: "Get the next drop first →",
    image: "/hero.jpg",
  });

  useEffect(() => {
    getHomepage()
      .then((data) => {
        if (data) {
          setHero((prev) => ({
            headline: data.heroHeadline || prev.headline,
            subheadline: data.heroSubheadline || prev.subheadline,
            cta: data.heroCta || prev.cta,
            secondaryLink: data.heroSecondaryLink || prev.secondaryLink,
            image: data.heroImage
              ? urlFor(data.heroImage)
                  .width(1920)
                  .quality(85)
                  .auto("format")
                  .url()
              : prev.image,
          }));
        }
      })
      .catch((err) => console.error("Failed to load hero:", err));
  }, []);

  // Split headline at period to put second part in pink
  const headlineParts = hero.headline.split(".");
  const firstLine = headlineParts[0] + ".";
  const secondLine = headlineParts.length > 1 ? headlineParts[1].trim() : "";

  return (
    <>
      <Helmet>
        <title>{settings.seoTitle}</title>
        <meta name="description" content={settings.seoDescription} />
        <meta
          name="keywords"
          content="Tees and Steeze, Nigerian streetwear, unisex streetwear Nigeria, streetwear Jos, African streetwear brand, buy streetwear online Nigeria"
        />
        <link rel="canonical" href="https://teesandsteeze.com/" />

        <meta property="og:title" content={settings.seoTitle} />
        <meta property="og:description" content={hero.subheadline} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://teesandsteeze.com/" />
        <meta
          property="og:image"
          content="https://teesandsteeze.com/og-image.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={settings.seoTitle} />
        <meta name="twitter:description" content={hero.subheadline} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Tee's and Steeze",
            url: "https://teesandsteeze.com",
            logo: "https://teesandsteeze.com/logo.png",
            description:
              "Unisex streetwear brand from Jos, Nigeria. Built with story. Worn with steeze.",
            foundingDate: "2022-09",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Jos",
              addressCountry: "NG",
            },
            sameAs: [
              "https://instagram.com/teesandsteeze",
              "https://tiktok.com/@teesandsteeze",
            ],
          })}
        </script>
      </Helmet>

      <section
        aria-label="Hero"
        className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      >
        {/* ── BACKGROUND IMAGE ── */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('${hero.image}')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* ── DARK OVERLAY ── */}
        <div className="absolute inset-0 z-1 bg-void/40" />

        {/* ── GRAIN TEXTURE ── */}
        <div
          className="absolute inset-0 z-2 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />

        {/* ── BOTTOM GRADIENT ── */}
        <div
          className="absolute bottom-0 left-0 right-0 z-3"
          style={{
            height: "60%",
            background:
              "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0) 100%)",
          }}
        />

        {/* ── CONTENT ── */}
        <div className="relative z-10 container pb-16 md:pb-24">
          <h1
            className="font-display font-semibold uppercase text-bone leading-[0.95] tracking-tight animate-fade-up"
            style={{
              fontSize: "clamp(3rem, 10vw, 7rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {firstLine}
            <br />
            <span className="text-steeze-pink">
              {secondLine || "The steeze."}
            </span>
          </h1>

          <p
            className="font-body text-white mt-6 md:mt-8 max-w-lg animate-fade-up animate-delay-100"
            style={{
              fontSize: "clamp(0.875rem, 1.5vw, 1.125rem)",
              lineHeight: "1.65",
            }}
          >
            {hero.subheadline}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8 md:mt-10 animate-fade-up animate-delay-200">
            <Link to="/shop" className="btn-primary">
              {hero.cta}
            </Link>
            <Link to="/drop" className="link-cta">
              {hero.secondaryLink}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
