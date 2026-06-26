/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSiteSettings } from "../context/SiteSettingsContext";

/*
 * ── ICONS ──
 * Minimal SVG icons — no library dependency.
 * Consistent 20px size, 1.5px stroke.
 */
const CartIcon = ({ count = 0 }) => (
  <div className="relative">
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
    {count > 0 && (
      <span
        style={{
          position: "absolute",
          top: "-6px",
          right: "-8px",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: "var(--color-steeze-pink)",
          color: "var(--color-bone)",
          fontSize: "10px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-body)",
        }}
      >
        {count}
      </span>
    )}
  </div>
);

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

/*
 * ── NAV LINKS ──
 */
const NAV_LINKS = [
  { to: "/about", label: "About" },
  { to: "/drop", label: "Drops" },
];

const SHOP_CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "tees", label: "Tees" },
  { slug: "packet-shirts", label: "Packet Shirts" },
  { slug: "hoodies", label: "Hoodies" },
  { slug: "Tang top shirt", label: "Tang Top Shirt" },
  { slug: "bags", label: "Steezy Bags" },
  { slug: "p cap", label: "P Cap" },
  { slug: "net cap", label: "Net Cap" },
];

export default function Navbar({ isLight = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();
  const settings = useSiteSettings();
  

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Scroll detection — adds background after 50px
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <>
      {/* ══════════════════════════════════════
          DESKTOP + MOBILE TOP BAR
          ══════════════════════════════════════ */}
      <nav
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          padding: scrolled ? "0.75rem 1rem" : "1.25rem 1rem",
          transition: "padding 300ms ease",
        }}
      >
        <div
          className="container grid items-center mx-auto"
          style={{
            height: "64px",
            maxWidth: "var(--container-max)",
            gridTemplateColumns: "1fr auto 1fr",
            background: isLight
              ? "rgba(255, 255, 255, 0.7)"
              : "rgba(20, 20, 20, 0.6)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${isLight ? "rgba(224, 224, 220, 0.7)" : "rgba(255, 255, 255, 0.08)"}`,
            borderRadius: "var(--radius-pill)",
            boxShadow: scrolled
              ? isLight
                ? "var(--shadow-soft-light)"
                : "var(--shadow-soft)"
              : "none",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
            transition: "box-shadow 300ms ease, background 300ms ease",
          }}
        >
          {/* ── DESKTOP LEFT NAV ── */}
          <div className="hidden md:flex items-center gap-7">
            {/* Shop — hover dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <Link
                to="/shop"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 400,
                  color: isActive("/shop")
                    ? "var(--color-bone)"
                    : "var(--color-stone)",
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  display: "inline-block",
                  padding: "0.5rem 0.875rem",
                  borderRadius: "var(--radius-pill)",
                  background: shopOpen
                    ? isLight
                      ? "rgba(10, 10, 10, 0.06)"
                      : "rgba(255, 255, 255, 0.08)"
                    : "transparent",
                  transition: "color 200ms ease, background 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-bone)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive("/shop"))
                    e.currentTarget.style.color = "var(--color-stone)";
                }}
              >
                Shop
              </Link>

              {/* Dropdown panel */}
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  paddingTop: "1.25rem",
                  opacity: shopOpen ? 1 : 0,
                  transform: shopOpen ? "translateY(0)" : "translateY(-6px)",
                  pointerEvents: shopOpen ? "auto" : "none",
                  transition: "opacity 200ms ease, transform 200ms ease",
                }}
              >
                <div
                  style={{
                    background: isLight
                      ? "rgba(255, 255, 255, 0.85)"
                      : "rgba(28, 28, 28, 0.85)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: `1px solid ${isLight ? "#E0E0DC" : "var(--color-border)"}`,
                    borderRadius: "var(--radius-md)",
                    boxShadow: isLight ? "var(--shadow-soft-light)" : "var(--shadow-soft)",
                    minWidth: "200px",
                    padding: "0.75rem 0",
                    overflow: "hidden",
                  }}
                >
                  {SHOP_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={cat.slug === "all" ? "/shop" : `/shop?category=${cat.slug}`}
                      style={{
                        display: "block",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8125rem",
                        color: "var(--color-stone)",
                        textDecoration: "none",
                        padding: "0.5rem 1.25rem",
                        transition: "color 150ms ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--color-bone)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--color-stone)";
                      }}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 400,
                  color: isActive(link.to)
                    ? "var(--color-bone)"
                    : "var(--color-stone)",
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  display: "inline-block",
                  padding: "0.5rem 0.875rem",
                  borderRadius: "var(--radius-pill)",
                  background: "transparent",
                  transition: "color 200ms ease, background 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-bone)";
                  e.currentTarget.style.background = isLight
                    ? "rgba(10, 10, 10, 0.06)"
                    : "rgba(255, 255, 255, 0.08)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.to))
                    e.currentTarget.style.color = "var(--color-stone)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── CENTERED LOGO ── */}
          <Link
            to="/"
            className="font-display flex gap-2 items-center justify-center font-semibold uppercase text-bone"
            style={{
              fontSize: "1.125rem",
              letterSpacing: "0.02em",
              textDecoration: "none",
              gridColumn: 2,
            }}
          >
            <img
              src="/logo.avif"
              className="w-9 h-full border border-y-steeze-pink rounded-lg p-1"
              alt="Tee's & Steeze Logo"
            />
            <span>Tee's & Steeze</span>
          </Link>

          {/* ── DESKTOP RIGHT (search, whatsapp, cart) ── */}
          <div className="hidden md:flex items-center justify-end gap-6">
            {/* Search (visual — opens shop) */}
            <Link
              to="/shop"
              aria-label="Search products"
              style={{
                color: "var(--color-stone)",
                transition: "color 200ms ease, background 200ms ease",
                display: "flex",
                alignItems: "center",
                padding: "0.5rem",
                borderRadius: "50%",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-bone)";
                e.currentTarget.style.background = isLight
                  ? "rgba(10, 10, 10, 0.06)"
                  : "rgba(255, 255, 255, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-stone)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <SearchIcon />
            </Link>

            {/* WhatsApp */}
            <a
              href={settings.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us on WhatsApp"
              style={{
                color: "var(--color-stone)",
                transition: "color 200ms ease, background 200ms ease",
                display: "flex",
                alignItems: "center",
                padding: "0.5rem",
                borderRadius: "50%",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-steeze-green)";
                e.currentTarget.style.background = isLight
                  ? "rgba(10, 10, 10, 0.06)"
                  : "rgba(255, 255, 255, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-stone)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <WhatsAppIcon />
            </a>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Shopping cart"
              style={{
                color: "var(--color-stone)",
                transition: "color 200ms ease, background 200ms ease",
                display: "flex",
                alignItems: "center",
                padding: "0.5rem",
                borderRadius: "50%",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-bone)";
                e.currentTarget.style.background = isLight
                  ? "rgba(10, 10, 10, 0.06)"
                  : "rgba(255, 255, 255, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-stone)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <CartIcon count={itemCount} />
            </Link>
          </div>

          {/* ── MOBILE RIGHT (visible on mobile only) ── */}
          <div className="flex md:hidden items-center justify-end gap-5" style={{ gridColumn: 3 }}>
            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Shopping cart"
              style={{
                color: "var(--color-bone)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <CartIcon count={itemCount} />
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              style={{
                background: "none",
                border: "none",
                color: "var(--color-bone)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: 0,
              }}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          MOBILE FULL-SCREEN OVERLAY
          ══════════════════════════════════════ */}
      <div
        className="fixed inset-0 z-[60] md:hidden flex flex-col"
        style={{
          background: "var(--color-void)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 300ms ease",
        }}
      >
        {/* Top bar — logo + close */}
        <div
          className="flex items-center justify-between"
          style={{
            height: "64px",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
          }}
        >
          <Link
            to="/"
            className="font-display font-semibold uppercase text-bone"
            style={{
              fontSize: "1.125rem",
              letterSpacing: "0.02em",
              textDecoration: "none",
            }}
            onClick={() => setMenuOpen(false)}
          >
            Tee's & Steeze
          </Link>

          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{
              background: "none",
              border: "none",
              color: "var(--color-bone)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: 0,
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Nav links — large, centered */}
        <div
          className="flex-1 flex flex-col items-center justify-center gap-2"
          style={{ paddingBottom: "4rem" }}
        >
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="font-display font-semibold uppercase text-bone"
              style={{
                fontSize: "2.5rem",
                letterSpacing: "-0.01em",
                textDecoration: "none",
                lineHeight: "1.3",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 400ms cubic-bezier(0.16, 1, 0.3, 1) ${150 + i * 80}ms, transform 400ms cubic-bezier(0.16, 1, 0.3, 1) ${150 + i * 80}ms`,
                color: isActive(link.to)
                  ? "var(--color-steeze-pink)"
                  : "var(--color-bone)",
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* CTA button in mobile menu */}
          <div
            className="mt-8"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 400ms cubic-bezier(0.16, 1, 0.3, 1) ${150 + NAV_LINKS.length * 80}ms, transform 400ms cubic-bezier(0.16, 1, 0.3, 1) ${150 + NAV_LINKS.length * 80}ms`,
            }}
          >
            <Link
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className="btn-primary"
              style={{
                padding: "1rem 2.5rem",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
              }}
            >
              Shop the drop
            </Link>
          </div>
        </div>

        {/* Bottom — social + WhatsApp */}
        <div
          className="flex items-center justify-center gap-8"
          style={{
            paddingBottom: "2rem",
            opacity: menuOpen ? 1 : 0,
            transition: "opacity 400ms ease 500ms",
          }}
        >
          <a
            href={settings.instagram}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "var(--color-stone)",
              textDecoration: "none",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Instagram
          </a>
          <a
            href={settings.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "var(--color-stone)",
              textDecoration: "none",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            TikTok
          </a>
          <a
            href={settings.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--color-steeze-green)",
              display: "flex",
              alignItems: "center",
            }}
            aria-label="WhatsApp"
          >
            <WhatsAppIcon />
          </a>
        </div>

        {/* Cultural pattern — bottom edge */}
        <div style={{ opacity: 0.12 }}>
          <svg
            width="100%"
            height="24"
            viewBox="0 0 1200 24"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <line
              x1="0"
              y1="12"
              x2="1200"
              y2="12"
              stroke="#F5F4F0"
              strokeWidth="0.5"
            />
            {[200, 400, 600, 800, 1000].map((cx) => (
              <g key={cx}>
                <circle
                  cx={cx}
                  cy="12"
                  r="4"
                  stroke="#F5F4F0"
                  strokeWidth="1"
                />
                <circle cx={cx} cy="12" r="1.5" fill="#F5F4F0" />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </>
  );
}
