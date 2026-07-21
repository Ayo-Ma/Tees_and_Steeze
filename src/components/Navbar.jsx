import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSiteSettings } from "../context/SiteSettingsContext";

/* ── ICONS ── */
const CartIcon = ({ count = 0 }) => (
  <div className="relative">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
    {count > 0 && (
      <span style={{
        position: "absolute",
        top: "-5px",
        right: "-7px",
        width: "16px",
        height: "16px",
        background: "var(--color-steeze-pink)",
        color: "var(--color-bone)",
        fontSize: "10px",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-body)",
      }}>
        {count}
      </span>
    )}
  </div>
);

const WhatsAppIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
);

const NAV_LINKS = [
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/drop", label: "Drops" },
];

const SHOP_CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "tees", label: "Tees" },
  { slug: "packet-shirts", label: "Packet Shirts" },
  { slug: "hoodies", label: "Hoodies" },
  { slug: "Tang top shirt", label: "Tang Top" },
  { slug: "bags", label: "Steezy Bags" },
  { slug: "p cap", label: "P Cap" },
  { slug: "net cap", label: "Net Cap" },
];

/* ── NAV LINK ── */
function NavLink({ to, label, isActive, isLight }) {
  return (
    <Link
      to={to}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.8125rem",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        textDecoration: "none",
        color: isActive
          ? isLight ? "#0A0A0A" : "var(--color-bone)"
          : isLight ? "#555555" : "var(--color-stone)",
        transition: "color 150ms ease",
        padding: "0.25rem 0",
        borderBottom: isActive
          ? `1.5px solid ${isLight ? "#0A0A0A" : "var(--color-bone)"}`
          : "1.5px solid transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = isLight ? "#0A0A0A" : "var(--color-bone)";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.color = isLight ? "#555555" : "var(--color-stone)";
      }}
    >
      {label}
    </Link>
  );
}

export default function Navbar({ isLight = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();
  const settings = useSiteSettings();

  const isHome = location.pathname === "/";

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  /* colours resolve based on page theme + scroll */
  const bgColor = isLight
    ? scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.0)"
    : isHome && !scrolled
      ? "transparent"
      : scrolled ? "rgba(10,10,10,0.97)" : "rgba(10,10,10,0.85)";

  const borderColor = isLight
    ? scrolled ? "rgba(224,224,220,0.8)" : "transparent"
    : scrolled ? "rgba(42,42,42,0.8)" : "transparent";

  const iconColor = isLight && scrolled ? "#0A0A0A" : "var(--color-bone)";

  return (
    <>
      {/* ══ MAIN NAV BAR ══ */}
      <nav
        aria-label="Main navigation"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: bgColor,
          borderBottom: `1px solid ${borderColor}`,
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          transition: "background 300ms ease, border-color 300ms ease",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          {/* ── LOGO LEFT ── */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <img
              src="/logo.avif"
              style={{ width: "30px", height: "30px", objectFit: "contain" }}
              alt="T&S"
            />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.875rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: isLight && scrolled ? "#0A0A0A" : "var(--color-bone)",
              }}
            >
              Tee's & Steeze
            </span>
          </Link>

          {/* ── DESKTOP NAV CENTER ── */}
          <div className="hidden md:flex items-center" style={{ gap: "2.5rem", flex: 1, justifyContent: "center" }}>
            {/* Shop with dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <NavLink to="/shop" label="Shop" isActive={isActive("/shop")} isLight={isLight && scrolled} />

              {/* Dropdown */}
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  opacity: shopOpen ? 1 : 0,
                  pointerEvents: shopOpen ? "auto" : "none",
                  transition: "opacity 150ms ease, transform 150ms ease",
                  translateY: shopOpen ? "0" : "-4px",
                }}
              >
                <div
                  style={{
                    background: isLight ? "rgba(255,255,255,0.97)" : "rgba(20,20,20,0.97)",
                    backdropFilter: "blur(12px)",
                    border: `1px solid ${isLight ? "#E0E0DC" : "var(--color-border)"}`,
                    minWidth: "180px",
                    padding: "0.5rem 0",
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
                        fontWeight: 500,
                        color: isLight ? "#555" : "var(--color-stone)",
                        textDecoration: "none",
                        padding: "0.5rem 1.25rem",
                        letterSpacing: "0.02em",
                        transition: "color 100ms ease, background 100ms ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = isLight ? "#0A0A0A" : "var(--color-bone)";
                        e.currentTarget.style.background = isLight ? "#F5F5F3" : "rgba(255,255,255,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = isLight ? "#555" : "var(--color-stone)";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <NavLink to="/about" label="About" isActive={isActive("/about")} isLight={isLight && scrolled} />
            <NavLink to="/drop" label="Drops" isActive={isActive("/drop")} isLight={isLight && scrolled} />
          </div>

          {/* ── DESKTOP ICONS RIGHT ── */}
          <div className="hidden md:flex items-center" style={{ gap: "1.5rem", flexShrink: 0 }}>
            <Link
              to="/shop"
              aria-label="Search products"
              style={{ color: iconColor, display: "flex", alignItems: "center", transition: "opacity 150ms ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <SearchIcon />
            </Link>

            <a
              href={settings.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact on WhatsApp"
              style={{ color: iconColor, display: "flex", alignItems: "center", transition: "opacity 150ms ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <WhatsAppIcon />
            </a>

            <Link
              to="/cart"
              aria-label="Cart"
              style={{ color: iconColor, display: "flex", alignItems: "center", transition: "opacity 150ms ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <CartIcon count={itemCount} />
            </Link>
          </div>

          {/* ── MOBILE RIGHT ── */}
          <div className="flex md:hidden items-center" style={{ gap: "1.25rem" }}>
            <Link to="/cart" aria-label="Cart" style={{ color: "var(--color-bone)", display: "flex" }}>
              <CartIcon count={itemCount} />
            </Link>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              style={{ background: "none", border: "none", color: "var(--color-bone)", cursor: "pointer", display: "flex", padding: 0 }}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* ══ MOBILE OVERLAY ══ */}
      <div
        className="fixed inset-0 z-[60] md:hidden flex flex-col"
        style={{
          background: "var(--color-void)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 250ms ease",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1.5rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.875rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
              color: "var(--color-bone)",
            }}
          >
            Tee's & Steeze
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{ background: "none", border: "none", color: "var(--color-bone)", cursor: "pointer", display: "flex", padding: 0 }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Nav links */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "3rem 1.5rem 2rem" }}>
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2.75rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: isActive(link.to) ? "var(--color-steeze-pink)" : "var(--color-bone)",
                lineHeight: 1.2,
                padding: "0.75rem 0",
                borderBottom: "1px solid var(--color-border)",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 350ms var(--ease-out-expo) ${100 + i * 60}ms, transform 350ms var(--ease-out-expo) ${100 + i * 60}ms`,
              }}
            >
              {link.label}
            </Link>
          ))}

          <div
            style={{
              marginTop: "auto",
              paddingTop: "2rem",
              opacity: menuOpen ? 1 : 0,
              transition: "opacity 350ms ease 400ms",
            }}
          >
            <Link
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className="btn-primary"
              style={{ display: "block", textAlign: "center" }}
            >
              Shop now
            </Link>

            <div className="flex items-center gap-6 mt-6">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-stone)", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                Instagram
              </a>
              <a
                href={settings.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-stone)", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                TikTok
              </a>
              <a
                href={settings.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--color-steeze-green)", display: "flex" }}
                aria-label="WhatsApp"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
