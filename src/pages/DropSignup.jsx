import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { saveDropSignup } from "../../tees-and-steeze/settings/src/lib/sanity";

/*
 * ── CULTURAL PATTERN — CENTER ORNAMENT ──
 * Adire-geometric accent mark. Sits above the form
 * as a visual anchor — the maker's mark.
 */
const CulturalMark = () => (
  <div className="flex justify-center" style={{ marginBottom: "2.5rem" }}>
    <svg
      width="200"
      height="40"
      viewBox="0 0 200 40"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      style={{ opacity: 0.3 }}
    >
      {/* Center line */}
      <line
        x1="0"
        y1="20"
        x2="200"
        y2="20"
        stroke="#F5F4F0"
        strokeWidth="0.5"
      />

      {/* Adire concentric circles */}
      {[40, 100, 160].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="20" r="12" stroke="#F5F4F0" strokeWidth="1" />
          <circle cx={cx} cy="20" r="7" stroke="#F5F4F0" strokeWidth="1" />
          <circle cx={cx} cy="20" r="3" fill="#F5F4F0" />
        </g>
      ))}

      {/* Diamonds between */}
      {[70, 130].map((cx) => (
        <g key={cx}>
          <polygon
            points={`${cx},10 ${cx + 10},20 ${cx},30 ${cx - 10},20`}
            stroke="#F5F4F0"
            strokeWidth="1"
          />
          <polygon
            points={`${cx},14 ${cx + 6},20 ${cx},26 ${cx - 6},20`}
            stroke="#F5F4F0"
            strokeWidth="1"
          />
        </g>
      ))}

      {/* End caps */}
      <circle cx="8" cy="20" r="3" stroke="#F5F4F0" strokeWidth="1" />
      <circle cx="192" cy="20" r="3" stroke="#F5F4F0" strokeWidth="1" />
    </svg>
  </div>
);

export default function DropSignupPage() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Replace handleSubmit:
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contact.trim()) return;

    saveDropSignup({
      name,
      contact,
      source: "drop-page",
    })
      .then(() => setSubmitted(true))
      .catch((err) => {
        console.error("Signup failed:", err);
        setSubmitted(true);
      });
    // After saveDropSignup() succeeds:
    window.gtag?.("event", "generate_lead", {
      currency: "NGN",
      value: 0,
    });
  };

  return (
    <>
      <Helmet>
        <title>
          Get the Drop First — Tee's and Steeze | Streetwear Drops Nigeria
        </title>
        <meta
          name="description"
          content="Early access to every Tee's and Steeze drop. No spam. No newsletters. Just the drop. Sign up for release notifications."
        />
        <link rel="canonical" href="https://teesandsteeze.com/drop" />

        <meta
          property="og:title"
          content="Get the Drop First — Tee's and Steeze"
        />
        <meta
          property="og:description"
          content="Early access. Limited pieces. No noise."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://teesandsteeze.com/drop" />
        <meta
          property="og:image"
          content="https://teesandsteeze.com/og-drop.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Get the Drop First — Tee's and Steeze"
        />
        <meta
          name="twitter:description"
          content="Early access to every release. No spam. Just the drop."
        />
      </Helmet>

      <div
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: "var(--color-void)",
          padding: "2rem 1.5rem",
        }}
      >
        {/* ── GRAIN TEXTURE ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />

        {/* ── LOGO WATERMARK ── */}
        <img src="/logo.avif" alt="" aria-hidden="true" className="logo-watermark" />

        {/* ── CONTENT ── */}
        <div
          className="relative z-10 w-full animate-fade-up"
          style={{ maxWidth: "440px" }}
        >
          {/* Back link — subtle, top-left */}
          <div className="mb-12">
            <Link
              to="/"
              className="font-display flex gap-2 items-center  font-semibold uppercase text-bone"
              style={{
                fontSize: "1rem",
                letterSpacing: "0.02em",
                color: "var(--color-neutral)",
                textDecoration: "none",
                opacity: 0.6,
                transition: "opacity 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.6";
              }}
            >
              <img
                src="/logo.avif"
                className="w-9 h-full border border-y-steeze-pink rounded-lg p-1"
                alt="Tee's & Steeze Logo"
              />
              Back to shop
            </Link>
          </div>

          {/* Cultural mark */}
          <CulturalMark />

          {/* Headline */}
          <h1
            className="font-display font-semibold uppercase text-bone text-center"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 4rem)",
              lineHeight: "0.95",
              letterSpacing: "-0.02em",
            }}
          >
            Get the drop first.
          </h1>

          {/* Context line */}
          <p
            className="text-center mt-5"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
              color: "var(--color-stone)",
              lineHeight: "1.65",
            }}
          >
            We don't send newsletters. We send Latest Arrivals.
            <br />
            Early access. Limited pieces.
          </p>

          {/* Form or success */}
          <div className="mt-10">
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                {/* Name field */}
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your first name"
                  className="input w-full"
                  aria-label="First name"
                />

                {/* Contact field */}
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="WhatsApp number or email"
                  className="input w-full mt-3"
                  required
                  aria-label="WhatsApp number or email for drop notifications"
                />

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full mt-4 cursor-pointer font-body font-medium uppercase"
                  style={{
                    fontSize: "0.8125rem",
                    letterSpacing: "0.08em",
                    padding: "1.125rem 2rem",
                    border: "none",
                    borderRadius: "0",
                    background: "var(--color-steeze-green)",
                    color: "var(--color-void)",
                    transition: "background 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "var(--color-steeze-green-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "var(--color-steeze-green)";
                  }}
                >
                  Put me on the list
                </button>

                {/* Micro-copy */}
                <p
                  className="mt-5 text-center"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    color: "var(--color-dim)",
                    lineHeight: "1.6",
                  }}
                >
                  You'll hear from us when something drops. That's it.
                </p>

                {/* What to expect */}
                <div
                  className="mt-8"
                  style={{
                    borderTop: "1px solid var(--color-border)",
                    paddingTop: "1.25rem",
                  }}
                >
                  <div className="flex flex-col gap-3">
                    {[
                      "Early access before it goes public",
                      "First to see new pieces, first to buy",
                      "One message per drop. Unsubscribe anytime.",
                    ].map((line, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span
                          style={{
                            color: "var(--color-dim)",
                            fontSize: "0.75rem",
                            lineHeight: "1.6",
                            flexShrink: 0,
                          }}
                        >
                          —
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.8125rem",
                            color: "var(--color-stone)",
                            lineHeight: "1.6",
                          }}
                        >
                          {line}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            ) : (
              /* ── SUCCESS STATE ── */
              <div
                className="text-center animate-fade-up"
                style={{
                  padding: "2.5rem 2rem",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-steeze-green)",
                }}
              >
                <p
                  className="font-display font-semibold uppercase"
                  style={{
                    fontSize: "1.5rem",
                    color: "var(--color-steeze-green)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  You're on the list.
                </p>
                <p
                  className="mt-3"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--color-stone)",
                    lineHeight: "1.65",
                  }}
                >
                  When the next drop lands, you'll know first.
                </p>

                {/* Link back to shop */}
                <div className="mt-8">
                  <Link
                    to="/shop"
                    className="link-cta"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Shop the current collection →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── BOTTOM CULTURAL PATTERN ── */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ opacity: 0.15 }}
        >
          <svg
            width="100%"
            height="32"
            viewBox="0 0 1200 32"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <line
              x1="0"
              y1="16"
              x2="1200"
              y2="16"
              stroke="#F5F4F0"
              strokeWidth="0.5"
            />
            {[100, 300, 500, 700, 900, 1100].map((cx) => (
              <g key={cx}>
                <circle
                  cx={cx}
                  cy="16"
                  r="6"
                  stroke="#F5F4F0"
                  strokeWidth="1"
                />
                <circle cx={cx} cy="16" r="2.5" fill="#F5F4F0" />
              </g>
            ))}
            {[200, 400, 600, 800, 1000].map((cx) => (
              <polygon
                key={cx}
                points={`${cx},10 ${cx + 6},16 ${cx},22 ${cx - 6},16`}
                stroke="#F5F4F0"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>
      </div>
    </>
  );
}
