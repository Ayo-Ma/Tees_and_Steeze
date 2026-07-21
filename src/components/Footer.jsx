import { useState } from "react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { saveDropSignup } from "../../tees-and-steeze/settings/src/lib/sanity";

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.97a8.17 8.17 0 004.78 1.52V7.04a4.84 4.84 0 01-1.01-.35z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function FooterCol({ label, children }) {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.6875rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--color-dim)",
          marginBottom: "1.25rem",
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {children}
      </div>
    </div>
  );
}

function FooterLink({ to, children, external = false }) {
  const style = {
    fontFamily: "var(--font-body)",
    fontSize: "0.875rem",
    color: "var(--color-stone)",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "color 150ms ease",
  };
  const hover = (e) => (e.currentTarget.style.color = "var(--color-bone)");
  const leave = (e) => (e.currentTarget.style.color = "var(--color-stone)");

  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" style={style} onMouseEnter={hover} onMouseLeave={leave}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} style={style} onMouseEnter={hover} onMouseLeave={leave}>
      {children}
    </Link>
  );
}

export default function Footer() {
  const settings = useSiteSettings();
  const [signupVal, setSignupVal] = useState("");
  const [signupDone, setSignupDone] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    if (!signupVal.trim()) return;
    saveDropSignup({ contact: signupVal.trim(), source: "footer" })
      .then(() => setSignupDone(true))
      .catch(() => setSignupDone(true));
  };

  return (
    <footer style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}>

      {/* ── BRAND BAR ── */}
      <div
        className="container"
        style={{
          paddingTop: "3rem",
          paddingBottom: "2rem",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/"
          style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}
        >
          <img src="/logo.avif" style={{ width: "36px", height: "36px", objectFit: "contain" }} alt="T&S" />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--color-bone)",
            }}
          >
            Tee's & Steeze
          </span>
        </Link>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-stone)",
          }}
        >
          {settings.tagline || "Unisex streetwear from Jos, Nigeria."}
        </p>
      </div>

      {/* ── LINKS + SIGNUP ── */}
      <div
        className="container"
        style={{
          paddingTop: "3rem",
          paddingBottom: "3rem",
          display: "grid",
          gridTemplateColumns: "repeat(var(--fcols, 2), 1fr)",
          gap: "2.5rem 2rem",
        }}
        className="[--fcols:2] lg:[--fcols:4]"
      >
        {/* Shop */}
        <FooterCol label="Shop">
          <FooterLink to="/shop">All pieces</FooterLink>
          <FooterLink to="/shop?category=tees">Tees</FooterLink>
          <FooterLink to="/shop?category=hoodies">Hoodies</FooterLink>
          <FooterLink to="/shop?category=bags">Steezy Bags</FooterLink>
          <FooterLink to="/drop">Get early access</FooterLink>
        </FooterCol>

        {/* Info */}
        <FooterCol label="Info">
          <FooterLink to="/about">About</FooterLink>
          <FooterLink to="/shop">Shipping info</FooterLink>
          <FooterLink to={settings.whatsapp || "#"} external>Returns</FooterLink>
          <FooterLink to={settings.whatsapp || "#"} external>Contact</FooterLink>
        </FooterCol>

        {/* Connect */}
        <FooterCol label="Connect">
          <FooterLink to={settings.instagram || "#"} external>
            <InstagramIcon /> Instagram
          </FooterLink>
          <FooterLink to={settings.tiktok || "#"} external>
            <TikTokIcon /> TikTok
          </FooterLink>
          <FooterLink to={settings.whatsapp || "#"} external>
            <WhatsAppIcon /> WhatsApp
          </FooterLink>
        </FooterCol>

        {/* Drop signup */}
        <FooterCol label="Get the drop">
          {signupDone ? (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-steeze-green)", fontWeight: 600 }}>
              You're on the list. ✓
            </p>
          ) : (
            <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <input
                type="text"
                value={signupVal}
                onChange={(e) => setSignupVal(e.target.value)}
                placeholder="WhatsApp or email"
                className="input"
                required
                aria-label="WhatsApp or email for drop signup"
              />
              <button
                type="submit"
                className="btn-signup"
                style={{ padding: "0.75rem 1.5rem", fontSize: "0.75rem" }}
              >
                Join the list
              </button>
            </form>
          )}
        </FooterCol>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div
        className="container"
        style={{
          paddingTop: "1.25rem",
          paddingBottom: "1.5rem",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            color: "var(--color-dim)",
          }}
        >
          © 2026 Tee's and Steeze. All rights reserved.
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-dim)" }}>
          Jos, Plateau State, Nigeria
        </p>
      </div>
    </footer>
  );
}
