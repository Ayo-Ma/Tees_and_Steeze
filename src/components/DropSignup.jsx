import { useRef, useState } from "react";
import { saveDropSignup } from '../../tees-and-steeze/settings/src/lib/sanity';

export default function DropSignup() {
  const [value, setValue] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    saveDropSignup({ contact: value.trim(), source: "homepage" })
      .then(() => setDone(true))
      .catch(() => setDone(true))
      .finally(() => setLoading(false));
  };

  return (
    <section
      aria-label="Drop signup"
      style={{
        borderTop: "1px solid var(--color-border)",
        background: "var(--color-surface)",
      }}
    >
      <div
        className="container"
        style={{
          paddingTop: "clamp(3.5rem, 6vw, 5rem)",
          paddingBottom: "clamp(3.5rem, 6vw, 5rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "2rem",
        }}
      >
        {/* Eyebrow */}
        <div className="section-eyebrow" style={{ width: "100%", maxWidth: "560px" }}>
          <span className="section-eyebrow-label">Next drop</span>
        </div>

        {/* Headline */}
        <div>
          <h2
            className="display-md"
            style={{ maxWidth: "600px", marginBottom: "0.75rem" }}
          >
            Get it first.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "var(--color-stone)",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            Early access, no spam. Just the drop.
          </p>
        </div>

        {/* Form */}
        {done ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem 2rem",
              border: "1px solid var(--color-steeze-green)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-steeze-green)" strokeWidth="2.5" strokeLinecap="square">
              <polyline points="4,12 9,17 20,6" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--color-steeze-green)",
                letterSpacing: "0.04em",
              }}
            >
              You're on the list. We'll hit you first.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              width: "100%",
              maxWidth: "480px",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="WhatsApp number or email"
              className="input"
              required
              aria-label="WhatsApp number or email"
              style={{ flex: 1, borderRight: "none" }}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-signup"
              style={{
                flexShrink: 0,
                opacity: loading ? 0.6 : 1,
                whiteSpace: "nowrap",
              }}
            >
              {loading ? "..." : "Join"}
            </button>
          </form>
        )}

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.6875rem",
            color: "var(--color-dim)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          No spam. Unsubscribe any time.
        </p>
      </div>
    </section>
  );
}
