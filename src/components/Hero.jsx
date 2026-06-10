import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <>
      {/* SEO — only rendered once on the homepage */}
      <Helmet>
        <title>Tee's and Steeze — Nigerian Unisex Streetwear | Shop the Drop</title>
        <meta
          name="description"
          content="Unisex streetwear from Jos, Nigeria. Graphic tees, hoodies, jerseys, and more — built with real story, real steeze. Shop the latest drop."
        />
        <meta
          name="keywords"
          content="Tees and Steeze, Nigerian streetwear, unisex streetwear Nigeria, streetwear Jos, African streetwear brand, buy streetwear online Nigeria"
        />
        <link rel="canonical" href="https://teesandsteeze.com/" />

        {/* Open Graph */}
        <meta property="og:title" content="Tee's and Steeze — Nigerian Unisex Streetwear" />
        <meta
          property="og:description"
          content="Not just clothes. The steeze. Unisex streetwear built from three years of conviction."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://teesandsteeze.com/" />
        <meta property="og:image" content="https://teesandsteeze.com/og-image.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tee's and Steeze — Nigerian Unisex Streetwear" />
        <meta name="twitter:description" content="Not just clothes. The steeze." />
      </Helmet>

      <section
        aria-label="Hero"
        className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      >
        {/* ── PARALLAX BACKGROUND IMAGE ── */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/hero.jpg')`,
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* ── DARK OVERLAY — controls image brightness ── */}
        <div className="absolute inset-0 z-1 bg-void/40" />

        {/* ── GRAIN TEXTURE — cultural texture layer ── */}
        <div
          className="absolute inset-0 z-2 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />

        {/* ── BOTTOM GRADIENT — text readability ── */}
        <div
          className="absolute bottom-0 left-0 right-0 z-3"
          style={{
            height: '60%',
            background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0) 100%)',
          }}
        />

        {/* ── CONTENT ── */}
        <div className="relative z-10 container pb-16 md:pb-24">
          {/* Headline */}
          <h1
            className="font-display font-semibold uppercase text-bone leading-[0.95] tracking-tight animate-fade-up"
            style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', letterSpacing: '-0.02em' }}
          >
            Not just clothes.
            <br />
            <span className="text-steeze-pink">The steeze.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="font-body text-white mt-6 md:mt-8 max-w-lg animate-fade-up animate-delay-100"
            style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)', lineHeight: '1.65' }}
          >
            Three years of building something that means something.
            Unisex streetwear for people who'd rather be felt than followed.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 mt-8 md:mt-10 animate-fade-up animate-delay-200">
            <Link to="/shop" className="btn-primary">
              Shop the drop
            </Link>
            <Link to="/drop" className="link-cta">
              Get the next drop first →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}