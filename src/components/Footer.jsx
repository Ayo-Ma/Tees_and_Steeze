import { useState } from "react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { saveDropSignup } from "../../tees-and-steeze/settings/src/lib/sanity";

/*
 * ── CULTURAL PATTERN BORDER ──
 * Slim version of the Adire-geometric pattern.
 * Acts as the top border of the footer —
 * replacing a plain 1px line with cultural texture.
 */
const FooterBorder = () => (
  <div className="w-full" style={{ height: "32px", opacity: 0.25 }}>
    <svg
      width="100%"
      height="32"
      viewBox="0 0 1200 32"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Center line */}
      <line
        x1="0"
        y1="16"
        x2="1200"
        y2="16"
        stroke="#F5F4F0"
        strokeWidth="0.5"
      />

      {/* Adire circles at intervals */}
      {[100, 300, 500, 700, 900, 1100].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="16" r="6" stroke="#F5F4F0" strokeWidth="1" />
          <circle cx={cx} cy="16" r="2.5" fill="#F5F4F0" />
        </g>
      ))}

      {/* Small diamonds between */}
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
);

export default function Footer() {
  const settings = useSiteSettings();
  const [signupValue, setSignupValue] = useState("");
  const [signupDone, setSignupDone] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    if (!signupValue.trim()) return;

    saveDropSignup({
      contact: signupValue,
      source: "footer",
    })
      .then(() => setSignupDone(true))
      .catch(() => setSignupDone(true));
  };

  return (
    <footer aria-label="Site footer">
      {/* Cultural border replaces plain line */}
      <FooterBorder />

      {/* ── BRAND MARK + MISSION ── */}
      <div
        className="container text-center"
        style={{ paddingTop: "3.5rem", paddingBottom: "2.5rem" }}
      >
        <Link
          to="/"
          className="font-display inline-flex gap-2 items-center justify-center font-semibold uppercase text-bone"
          style={{
            fontSize: "1.5rem",
            letterSpacing: "0.02em",
            textDecoration: "none",
          }}
        >
          <img
            src="/logo.avif"
            className="w-11 h-full border border-y-steeze-pink rounded-lg p-1"
            alt="Tee's & Steeze Logo"
          />
          Tee's & Steeze
        </Link>

        <p
          className="mx-auto mt-4"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.9375rem",
            color: "var(--color-stone)",
            lineHeight: "1.65",
            maxWidth: "480px",
          }}
        >
          {settings.tagline} Fashion is an expression of individuality and
          artistry — every piece carries the steeze.
        </p>

        {/* Newsletter / drop signup */}
        <div className="mt-8 mx-auto" style={{ maxWidth: "420px" }}>
          {!signupDone ? (
            <form
              onSubmit={handleSignup}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                value={signupValue}
                onChange={(e) => setSignupValue(e.target.value)}
                placeholder="WhatsApp or email"
                className="input flex-1"
                required
                aria-label="WhatsApp number or email"
              />
              <button type="submit" className="btn-signup whitespace-nowrap">
                Get 10% off
              </button>
            </form>
          ) : (
            <p
              className="font-body font-medium"
              style={{ fontSize: "0.875rem", color: "var(--color-steeze-green)" }}
            >
              You're on the list. ✓
            </p>
          )}
          <p
            className="mt-3"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "var(--color-dim)",
            }}
          >
            Get 10% off your next order. No spam, just the drop.
          </p>
        </div>
      </div>

      <div
        className="container"
        style={{
          paddingBottom: "3rem",
          borderTop: "1px solid var(--color-border)",
          paddingTop: "3rem",
        }}
      >
        {/* ── TOP ROW — Nav + Social + Delivery ── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-center md:text-left gap-10 md:gap-16 text-center">
          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <p className="caption mb-4" style={{ color: "var(--color-dim)" }}>
              Navigate
            </p>
            <ul className="flex flex-col gap-3" style={{ listStyle: "none" }}>
              <li>
                <Link
                  to="/shop"
                  className="body-sm hover:text-bone"
                  style={{
                    color: "var(--color-stone)",
                    textDecoration: "none",
                    transition: "color 200ms ease",
                  }}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="body-sm hover:text-bone"
                  style={{
                    color: "var(--color-stone)",
                    textDecoration: "none",
                    transition: "color 200ms ease",
                  }}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/drop"
                  className="body-sm hover:text-bone"
                  style={{
                    color: "var(--color-stone)",
                    textDecoration: "none",
                    transition: "color 200ms ease",
                  }}
                >
                  Drop Signup
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social + Contact */}
          <div>
            <p className="caption mb-4" style={{ color: "var(--color-dim)" }}>
              Connect
            </p>
            <ul className="flex flex-col gap-3" style={{ listStyle: "none" }}>
              <li>
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="body-sm hover:text-bone"
                  style={{
                    color: "var(--color-stone)",
                    textDecoration: "none",
                    transition: "color 200ms ease",
                  }}
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="body-sm hover:text-bone"
                  style={{
                    color: "var(--color-stone)",
                    textDecoration: "none",
                    transition: "color 200ms ease",
                  }}
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href={settings.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="body-sm hover:text-bone"
                  style={{
                    color: "var(--color-stone)",
                    textDecoration: "none",
                    transition: "color 200ms ease",
                  }}
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Delivery info — trust signal */}
          <div>
            <p className="caption mb-4" style={{ color: "var(--color-dim)" }}>
              Delivery
            </p>
            <p
              className="body-sm"
              style={{ color: "var(--color-stone)", maxWidth: "200px" }}
            >
              Ships nationwide.
              <br />
              {settings.deliveryInfo}
            </p>
            <p className="mt-3 body-sm" style={{ color: "var(--color-stone)" }}>
              Lagos & Abuja: 2–3 days.
            </p>
          </div>

          {/* Find us — trust signal */}
          <div>
            <p className="caption mb-4" style={{ color: "var(--color-dim)" }}>
              Find Us
            </p>
            <p
              className="body-sm"
              style={{ color: "var(--color-stone)", maxWidth: "200px" }}
            >
              Jos, Plateau State, Nigeria
            </p>
            <p className="mt-3 body-sm" style={{ color: "var(--color-stone)" }}>
              Mon – Sat: 9am – 6pm
            </p>
          </div>
        </div>
{/* G-QV42G64LF7 */}
        {/* ── BOTTOM ROW — Copyright ── */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <p className="caption" style={{ color: "var(--color-dim)" }}>
            © 2026 Tee's and Steeze. All rights reserved.
          </p>
          <p className="caption" style={{ color: "var(--color-dim)" }}>
            Built by{" "}
            <a
              href="https://leadmarkhq.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--color-stone)",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
                transition: "color 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-bone)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-stone)";
              }}
            >
              LeadMarkHQ
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
