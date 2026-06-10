import { useEffect, useRef, useState } from "react";
import { saveDropSignup } from '../../tees-and-steeze/settings/src/lib/sanity';
/*
 * ── CULTURAL ACCENT LINE ──
 * A slim horizontal strip of the Adire-geometric pattern.
 * Sits above the signup section as a visual marker —
 * "you're entering a different space."
 */
const CulturalAccent = () => (
  <div className="w-full flex justify-center mb-12 md:mb-16">
    <svg
      width="240"
      height="24"
      viewBox="0 0 240 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      style={{ opacity: 0.35 }}
    >
      {/* Center line */}
      <line
        x1="0"
        y1="12"
        x2="240"
        y2="12"
        stroke="#F5F4F0"
        strokeWidth="0.5"
      />

      {/* Adire circles */}
      {[40, 120, 200].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="12" r="8" stroke="#F5F4F0" strokeWidth="1" />
          <circle cx={cx} cy="12" r="4" stroke="#F5F4F0" strokeWidth="1" />
          <circle cx={cx} cy="12" r="1.5" fill="#F5F4F0" />
        </g>
      ))}

      {/* Diamonds between circles */}
      {[80, 160].map((cx) => (
        <polygon
          key={cx}
          points={`${cx},4 ${cx + 8},12 ${cx},20 ${cx - 8},12`}
          stroke="#F5F4F0"
          strokeWidth="1"
        />
      ))}
    </svg>
  </div>
);

export default function DropSignup() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;

    saveDropSignup({
      contact: value,
      source: "homepage",
    })
      .then(() => setSubmitted(true))
      .catch((err) => {
        console.error("Signup failed:", err);
        // Still show success — don't punish the user for a backend error
        setSubmitted(true);
      });
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Drop Signup"
      className="relative overflow-hidden"
      style={{
        paddingTop: "clamp(5rem, 10vw, 8rem)",
        paddingBottom: "clamp(5rem, 10vw, 8rem)",
      }}
    >
      {/* ── GRAIN TEXTURE — cultural layer ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <div className="container relative z-10">
        {/* Cultural accent */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <CulturalAccent />
        </div>

        {/* Content — centred, narrow */}
        <div className="mx-auto text-center" style={{ maxWidth: "480px" }}>
          {/* Headline */}
          <h2
            className="display-md"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition:
                "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            Get the drop first.
          </h2>

          {/* Subheadline */}
          <p
            className="body-lg mt-4"
            style={{
              color: "var(--color-stone)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition:
                "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) 100ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 100ms",
            }}
          >
            Early access to every release. No spam. No newsletters. Just the
            drop.
          </p>

          {/* Form or success state */}
          <div
            className="mt-8 md:mt-10"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition:
                "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 200ms",
            }}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Your WhatsApp number or email"
                    className="input flex-1"
                    required
                    aria-label="WhatsApp number or email for drop notifications"
                  />
                  <button
                    type="submit"
                    className="btn-signup whitespace-nowrap"
                  >
                    Put me on the list
                  </button>
                </div>

                {/* Micro-copy */}
                <p
                  className="mt-4"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    color: "var(--color-dim)",
                    lineHeight: "1.5",
                  }}
                >
                  You'll hear from us once — when something drops. That's it.
                </p>
              </form>
            ) : (
              /* ── SUCCESS STATE ── */
              <div
                className="animate-fade-up"
                style={{
                  padding: "2rem",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-steeze-green)",
                }}
              >
                <p
                  className="font-body font-medium"
                  style={{
                    fontSize: "1.125rem",
                    color: "var(--color-steeze-green)",
                  }}
                >
                  You're on the list.
                </p>
                <p
                  className="mt-2"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    color: "var(--color-stone)",
                  }}
                >
                  When the next drop lands, you'll know first.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
