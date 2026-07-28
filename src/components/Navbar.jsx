import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartIcon = ({ count = 0 }) => (
  <div style={{ position: "relative" }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
    {count > 0 && (
      <span style={{
        position: "absolute", top: "-6px", right: "-8px",
        width: "16px", height: "16px", borderRadius: "50%",
        background: "var(--color-steeze-pink)", color: "#FFFFFF",
        fontSize: "9px", fontWeight: 700, lineHeight: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-body)",
      }}>
        {count}
      </span>
    )}
  </div>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="3" y1="7" x2="21" y2="7" />
    <line x1="3" y1="17" x2="21" y2="17" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

const NAV_LINKS = [
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/drop", label: "Drops" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isActive = (path) =>
    path === "/shop"
      ? location.pathname.startsWith("/shop") || location.pathname.startsWith("/product")
      : location.pathname === path;

  return (
    <>
      {/* ── TOP BAR ── */}
      <nav
        aria-label="Main navigation"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 50,
          height: "60px",
          background: "#FFFFFF",
          borderBottom: `1px solid ${scrolled ? "var(--color-border)" : "transparent"}`,
          transition: "border-color 250ms ease",
        }}
      >
        <div
          className="container"
          style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          {/* Logo + Wordmark */}
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none", flexShrink: 0 }}
          >
            <img
              src="/logo.avif"
              alt="Tee's & Steeze"
              style={{ width: "30px", height: "30px", objectFit: "contain" }}
            />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.9375rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "var(--color-bone)",
              }}
            >
              Tee's & Steeze
            </span>
          </Link>

          {/* Desktop nav — centered absolutely */}
          <div
            className="hidden md:flex"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              gap: "2.5rem",
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  fontWeight: isActive(link.to) ? 600 : 400,
                  color: isActive(link.to) ? "var(--color-bone)" : "var(--color-stone)",
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                  paddingBottom: "2px",
                  borderBottom: isActive(link.to) ? "1.5px solid var(--color-bone)" : "1.5px solid transparent",
                  transition: "color 150ms ease, border-color 150ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-bone)"; }}
                onMouseLeave={(e) => { if (!isActive(link.to)) e.currentTarget.style.color = "var(--color-stone)"; }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right — cart + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <Link
              to="/cart"
              aria-label={`Cart — ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
              style={{ color: "var(--color-bone)", display: "flex", alignItems: "center", transition: "opacity 150ms ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <CartIcon count={itemCount} />
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden"
              style={{ background: "none", border: "none", color: "var(--color-bone)", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* ── DRAWER BACKDROP ── */}
      <div
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 59,
          background: "rgba(0,0,0,0.18)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 300ms ease",
        }}
      />

      {/* ── DRAWER PANEL ── */}
      <div
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        style={{
          position: "fixed",
          top: 0, right: 0, bottom: 0,
          zIndex: 60,
          width: "min(300px, 82vw)",
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "-2px 0 24px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <div style={{ height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem", borderBottom: "1px solid var(--color-border)", flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-stone)" }}>
            Menu
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{ background: "none", border: "none", color: "var(--color-bone)", cursor: "pointer", display: "flex", alignItems: "center", padding: "0.25rem" }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Links */}
        <nav style={{ flex: 1, overflowY: "auto" }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.25rem",
                fontFamily: "var(--font-body)",
                fontSize: "1.25rem",
                fontWeight: 500,
                color: isActive(link.to) ? "var(--color-steeze-pink)" : "var(--color-bone)",
                textDecoration: "none",
                borderBottom: "1px solid var(--color-border)",
                transition: "color 150ms ease",
              }}
            >
              {link.label}
              <span style={{ opacity: 0.3, fontSize: "0.875rem" }}>→</span>
            </Link>
          ))}
        </nav>

        {/* Footer CTA */}
        <div style={{ padding: "1.25rem", borderTop: "1px solid var(--color-border)", flexShrink: 0 }}>
          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              width: "100%", padding: "0.875rem",
              background: "var(--color-bone)", color: "#FFFFFF",
              fontFamily: "var(--font-body)", fontSize: "0.8125rem",
              fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            <CartIcon count={0} />
            Bag{itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>
        </div>
      </div>
    </>
  );
}
