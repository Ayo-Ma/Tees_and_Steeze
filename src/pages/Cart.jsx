import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSiteSettings } from "../context/SiteSettingsContext";

const PAYSTACK_PUBLIC_KEY =
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
  "pk_live_109e4b40bdaba0937fd8d9c01a41b300fb212f3e";

function loadPaystack(cb) {
  if (window.PaystackPop) return cb();
  const s = document.createElement("script");
  s.src = "https://js.paystack.co/v1/inline.js";
  s.onload = cb;
  document.head.appendChild(s);
}

function payWithPaystack({ email, name, phone, amount, metadata, onSuccess, onClose }) {
  const handler = window.PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email,
    amount: amount * 100,
    currency: "NGN",
    firstname: name.split(" ")[0],
    lastname: name.split(" ").slice(1).join(" ") || "",
    phone,
    metadata,
    callback: (response) => onSuccess(response),
    onClose: () => onClose(),
  });
  handler.openIframe();
}

/* ── ICONS ── */
const Minus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const Plus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const Trash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 6h18M8 6V4h8v2M7 6l1 14h8l1-14" />
  </svg>
);
const WaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);
const CheckCircle = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ── STEP PROGRESS ── */
const STEPS = ["Bag", "Details", "Review"];

function StepProgress({ current }) {
  const idx = ["cart", "details", "review", "success"].indexOf(current);
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "2.5rem", maxWidth: "360px" }}>
      {STEPS.map((label, i) => {
        const done = idx > i;
        const active = idx === i;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem" }}>
              <div style={{
                width: "26px", height: "26px", borderRadius: "50%",
                border: `2px solid ${done || active ? "var(--color-bone)" : "var(--color-border)"}`,
                background: done ? "var(--color-bone)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 200ms ease",
              }}>
                {done ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 700, color: active ? "var(--color-bone)" : "var(--color-dim)" }}>
                    {i + 1}
                  </span>
                )}
              </div>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: active ? 700 : 400, letterSpacing: "0.06em", textTransform: "uppercase", color: done || active ? "var(--color-bone)" : "var(--color-dim)", whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: "1px", background: done ? "var(--color-bone)" : "var(--color-border)", margin: "0 0.625rem", marginTop: "-1rem", transition: "background 200ms ease" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── FORM FIELD ── */
function Field({ label, required, hint, error, children }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-stone)", marginBottom: "0.5rem" }}>
        {label}{required && <span style={{ color: "var(--color-steeze-pink)", marginLeft: "2px" }}>*</span>}
      </label>
      {children}
      {hint && !error && <p style={{ marginTop: "0.3rem", fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-dim)" }}>{hint}</p>}
      {error && <p style={{ marginTop: "0.3rem", fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-danger)" }}>{error}</p>}
    </div>
  );
}

const inputBase = {
  width: "100%", padding: "0.8125rem 1rem",
  background: "#FFFFFF", border: "1.5px solid var(--color-border)",
  borderRadius: 0, color: "var(--color-bone)",
  fontFamily: "var(--font-body)", fontSize: "0.9375rem",
  outline: "none", transition: "border-color 200ms ease",
  boxSizing: "border-box",
};

/* ── CART LINE ITEM ── */
function CartLine({ item, onQty, onRemove, readonly }) {
  return (
    <div style={{ display: "flex", gap: "1rem", padding: "1.25rem 0", borderBottom: "1px solid var(--color-border)" }}>
      <Link to={`/product/${item.id}`} style={{ flexShrink: 0, display: "block", width: "76px", aspectRatio: "3/4", background: "var(--color-surface)", overflow: "hidden" }}>
        <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Link>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 500, color: "var(--color-bone)", lineHeight: 1.3 }}>{item.name}</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-stone)", marginTop: "0.2rem" }}>Size {item.size}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.75rem" }}>
          {readonly ? (
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-stone)" }}>Qty {item.quantity}</span>
          ) : (
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--color-border)" }}>
              <button onClick={() => item.quantity > 1 && onQty(item.id, item.size, item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Decrease quantity" style={{ width: "32px", height: "32px", background: "none", border: "none", color: item.quantity <= 1 ? "var(--color-dim)" : "var(--color-bone)", cursor: item.quantity <= 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus /></button>
              <span style={{ width: "34px", height: "32px", fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 500, borderLeft: "1px solid var(--color-border)", borderRight: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>{item.quantity}</span>
              <button onClick={() => onQty(item.id, item.size, item.quantity + 1)} aria-label="Increase quantity" style={{ width: "32px", height: "32px", background: "none", border: "none", color: "var(--color-bone)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus /></button>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 500, color: "var(--color-bone)" }}>₦{(item.price * item.quantity).toLocaleString()}</span>
            {!readonly && (
              <button onClick={() => onRemove(item.id, item.size)} aria-label={`Remove ${item.name}`} style={{ background: "none", border: "none", color: "var(--color-dim)", cursor: "pointer", display: "flex", padding: "0.25rem", transition: "color 150ms ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-danger)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-dim)")}
              ><Trash /></button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ORDER SUMMARY SIDEBAR ── */
function OrderSummary({ items, totalFormatted, deliveryNote }) {
  return (
    <div style={{ background: "var(--color-surface)", padding: "1.5rem" }}>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-stone)", marginBottom: "1.25rem" }}>Order Summary</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1rem" }}>
        {items.map((item) => (
          <div key={`${item.id}-${item.size}`} style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-stone)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.name} × {item.quantity}
            </span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-bone)", flexShrink: 0 }}>₦{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-stone)" }}>Delivery</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-dim)" }}>Calculated after order</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 700, color: "var(--color-bone)" }}>Total</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 700, color: "var(--color-bone)" }}>{totalFormatted}</span>
        </div>
      </div>
      {deliveryNote && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-dim)", marginTop: "0.875rem", lineHeight: 1.5 }}>{deliveryNote}</p>
      )}
    </div>
  );
}

/* ── WHATSAPP MESSAGE BUILDERS ── */
function buildBusinessMsg({ form, items, total, ref }) {
  return [
    `🛍️ *New Order — Tee's & Steeze*`,
    ``,
    `*Ref:* ${ref}`,
    `*Name:* ${form.name}`,
    `*Email:* ${form.email}`,
    `*WhatsApp:* ${form.phone}`,
    `*Address:* ${form.address}, ${form.city}`,
    ``,
    `*Items:*`,
    ...items.map((i) => `• ${i.name} (Size ${i.size}) × ${i.quantity} — ₦${(i.price * i.quantity).toLocaleString()}`),
    ``,
    `*Total paid:* ₦${total.toLocaleString()}`,
    ``,
    `Please confirm and process this order. Thank you 🙏`,
  ].join("\n");
}

function buildCustomerMsg({ form, items, total, ref }) {
  return [
    `✅ *Your Order is Confirmed — Tee's & Steeze*`,
    ``,
    `Hi ${form.name.split(" ")[0]}, thank you for your order!`,
    ``,
    `*Payment Ref:* ${ref}`,
    ``,
    `*Items ordered:*`,
    ...items.map((i) => `• ${i.name} (Size ${i.size}) × ${i.quantity} — ₦${(i.price * i.quantity).toLocaleString()}`),
    ``,
    `*Total paid:* ₦${total.toLocaleString()}`,
    `*Delivery to:* ${form.address}, ${form.city}`,
    ``,
    `Expected delivery: 3–5 business days.`,
    `We'll reach out on this number to confirm shipment.`,
    ``,
    `Thank you for shopping with Tee's & Steeze! 🙌`,
  ].join("\n");
}

function waUrl(number, message) {
  const clean = number.replace(/\D/g, "");
  const withCode = clean.startsWith("234") ? clean : `234${clean.replace(/^0/, "")}`;
  return `https://wa.me/${withCode}?text=${encodeURIComponent(message)}`;
}

/* ══════════════════════════════════════════
   MAIN CART PAGE
   ══════════════════════════════════════════ */
export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, total, totalFormatted } = useCart();
  const settings = useSiteSettings();

  const [step, setStep] = useState("cart");
  const [savedItems, setSavedItems] = useState([]);
  const [savedTotal, setSavedTotal] = useState(0);
  const [payRef, setPayRef] = useState(null);
  const [businessWa, setBusinessWa] = useState(null);
  const [customerWa, setCustomerWa] = useState(null);

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "" });
  const [errors, setErrors] = useState({});

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name    = "Full name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) e.phone = "Valid phone number required";
    if (!form.address.trim()) e.address = "Delivery address is required";
    if (!form.city.trim())    e.city    = "City / State is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = () => {
    loadPaystack(() => {
      payWithPaystack({
        email: form.email,
        name:  form.name,
        phone: form.phone,
        amount: total,
        metadata: {
          fullName: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          items: items.map((i) => ({
            name: i.name,
            size: i.size,
            quantity: i.quantity,
            price: i.price,
          })),
          custom_fields: [
            { display_name: "Customer Name",     variable_name: "name",    value: form.name },
            { display_name: "WhatsApp",          variable_name: "phone",   value: form.phone },
            { display_name: "Delivery Address",  variable_name: "address", value: `${form.address}, ${form.city}` },
          ],
        },
        onSuccess: (response) => {
          const snapshot = [...items];
          const snap_total = total;
          const bMsg = buildBusinessMsg({ form, items: snapshot, total: snap_total, ref: response.reference });
          const cMsg = buildCustomerMsg({ form, items: snapshot, total: snap_total, ref: response.reference });
          setSavedItems(snapshot);
          setSavedTotal(snap_total);
          setPayRef(response.reference);
          setBusinessWa(waUrl(settings.whatsapp, bMsg));
          setCustomerWa(waUrl(form.phone, cMsg));
          clearCart();
          setStep("success");
        },
        onClose: () => {},
      });
    });
  };

  /* ── TITLE MAP ── */
  const titles = { cart: "Your Bag", details: "Your Details", review: "Review Order", success: "Order Confirmed" };

  /* ── EMPTY BAG ── */
  if (items.length === 0 && step !== "success") {
    return (
      <>
        <Helmet><title>Bag — Tee's and Steeze</title><meta name="robots" content="noindex" /></Helmet>
        <main style={{ paddingTop: "8rem", paddingBottom: "5rem" }}>
          <div className="container" style={{ maxWidth: "440px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ width: "56px", height: "56px", border: "1.5px solid var(--color-border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-dim)" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            </div>
            <h1 style={{ fontFamily: "var(--font-body)", fontSize: "1.25rem", fontWeight: 700, color: "var(--color-bone)", marginBottom: "0.625rem" }}>Your bag is empty</h1>
            <p className="body-sm" style={{ marginBottom: "2rem" }}>Nothing added yet — go find your piece.</p>
            <Link to="/shop" className="btn-primary">Browse the collection</Link>
          </div>
        </main>
      </>
    );
  }

  /* ── SUCCESS ── */
  if (step === "success") {
    return (
      <>
        <Helmet><title>Order Confirmed — Tee's and Steeze</title><meta name="robots" content="noindex" /></Helmet>
        <main style={{ paddingTop: "7rem", paddingBottom: "5rem" }}>
          <div className="container" style={{ maxWidth: "560px", margin: "0 auto" }}>
            {/* Check */}
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--color-steeze-green)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.75rem" }}>
              <CheckCircle />
            </div>

            <h1 style={{ fontFamily: "var(--font-body)", fontSize: "1.75rem", fontWeight: 700, color: "var(--color-bone)", marginBottom: "0.625rem" }}>
              Payment confirmed.
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "var(--color-stone)", lineHeight: 1.65, marginBottom: "0.5rem" }}>
              Your order has been received. Send us a message on WhatsApp to confirm — and get your receipt sent to your number.
            </p>
            {payRef && (
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-dim)", marginBottom: "2rem" }}>
                Payment ref: {payRef}
              </p>
            )}

            {/* Order recap */}
            {savedItems.length > 0 && (
              <div style={{ background: "var(--color-surface)", padding: "1.25rem", marginBottom: "2rem" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-stone)", marginBottom: "0.875rem" }}>
                  Your order
                </p>
                {savedItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-stone)" }}>{item.name} (Size {item.size}) × {item.quantity}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-bone)" }}>₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "0.75rem", marginTop: "0.75rem", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-bone)" }}>Total paid</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-bone)" }}>₦{savedTotal.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* WhatsApp CTAs */}
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-stone)", marginBottom: "0.875rem" }}>
              Tap both buttons below — notify us and save your receipt:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {businessWa && (
                <a
                  href={businessWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem", padding: "1rem 1.5rem", background: "#25D366", color: "#FFFFFF", fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", borderRadius: "9999px", transition: "opacity 180ms ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <WaIcon /> Notify Tee's & Steeze
                </a>
              )}
              {customerWa && (
                <a
                  href={customerWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem", padding: "1rem 1.5rem", background: "transparent", color: "#25D366", border: "1.5px solid #25D366", fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", borderRadius: "9999px", transition: "all 180ms ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#25D366"; e.currentTarget.style.color = "#FFFFFF"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#25D366"; }}
                >
                  <WaIcon /> Send receipt to my WhatsApp
                </a>
              )}
            </div>

            <div style={{ marginTop: "2rem" }}>
              <Link to="/shop" className="link-cta">Continue shopping →</Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const gridStyle = { display: "grid", gridTemplateColumns: "1fr", gap: "2.5rem" };

  return (
    <>
      <Helmet>
        <title>{titles[step] ?? "Checkout"} — Tee's and Steeze</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main style={{ paddingTop: "60px" }}>
        <div className="container" style={{ maxWidth: "1100px", margin: "0 auto", paddingTop: "3rem", paddingBottom: "5rem" }}>

          {/* Page title + progress */}
          <h1 style={{ fontFamily: "var(--font-body)", fontSize: "1.75rem", fontWeight: 700, color: "var(--color-bone)", marginBottom: "1.5rem" }}>
            {titles[step]}
          </h1>
          <StepProgress current={step} />

          {/* ════════════════════════════════
              STEP 1 — CART / BAG
              ════════════════════════════════ */}
          {step === "cart" && (
            <div style={gridStyle} className="lg:grid-cols-[1fr_340px]">
              <div>
                {items.map((item) => (
                  <CartLine key={`${item.id}-${item.size}`} item={item} onQty={updateQuantity} onRemove={removeItem} />
                ))}
                <div style={{ marginTop: "1.5rem" }}>
                  <Link to="/shop" style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-stone)", textDecoration: "underline", textUnderlineOffset: "3px", transition: "color 150ms ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-bone)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-stone)")}
                  >
                    ← Continue shopping
                  </Link>
                </div>
              </div>

              <div style={{ position: "sticky", top: "80px", alignSelf: "start" }}>
                <OrderSummary items={items} totalFormatted={totalFormatted} deliveryNote="Nationwide delivery · 3–5 business days" />
                <button
                  onClick={() => setStep("details")}
                  className="btn-primary"
                  style={{ width: "100%", marginTop: "1rem", justifyContent: "center" }}
                >
                  Continue to details
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════
              STEP 2 — CUSTOMER DETAILS
              ════════════════════════════════ */}
          {step === "details" && (
            <div style={gridStyle} className="lg:grid-cols-[1fr_340px]">
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <Field label="Full Name" required error={errors.name}>
                    <input
                      type="text" value={form.name} placeholder="e.g. Amara Obi"
                      onChange={(e) => setField("name", e.target.value)}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-bone)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = errors.name ? "var(--color-danger)" : "var(--color-border)")}
                      style={{ ...inputBase, borderColor: errors.name ? "var(--color-danger)" : "var(--color-border)" }}
                      aria-label="Full name"
                    />
                  </Field>

                  <Field label="Email Address" required error={errors.email}>
                    <input
                      type="email" value={form.email} placeholder="you@email.com"
                      onChange={(e) => setField("email", e.target.value)}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-bone)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = errors.email ? "var(--color-danger)" : "var(--color-border)")}
                      style={{ ...inputBase, borderColor: errors.email ? "var(--color-danger)" : "var(--color-border)" }}
                      aria-label="Email address"
                    />
                  </Field>

                  <Field
                    label="WhatsApp / Phone Number"
                    required
                    hint="Your order receipt will be sent to this number via WhatsApp"
                    error={errors.phone}
                  >
                    <input
                      type="tel" value={form.phone} placeholder="e.g. 08012345678"
                      onChange={(e) => setField("phone", e.target.value)}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-bone)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = errors.phone ? "var(--color-danger)" : "var(--color-border)")}
                      style={{ ...inputBase, borderColor: errors.phone ? "var(--color-danger)" : "var(--color-border)" }}
                      aria-label="WhatsApp or phone number"
                    />
                  </Field>

                  <Field label="Delivery Address" required error={errors.address}>
                    <textarea
                      value={form.address} placeholder="House number and street name"
                      rows={2} onChange={(e) => setField("address", e.target.value)}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-bone)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = errors.address ? "var(--color-danger)" : "var(--color-border)")}
                      style={{ ...inputBase, resize: "none", borderColor: errors.address ? "var(--color-danger)" : "var(--color-border)" }}
                      aria-label="Delivery address"
                    />
                  </Field>

                  <Field label="City / State" required error={errors.city}>
                    <input
                      type="text" value={form.city} placeholder="e.g. Jos, Plateau State"
                      onChange={(e) => setField("city", e.target.value)}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-bone)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = errors.city ? "var(--color-danger)" : "var(--color-border)")}
                      style={{ ...inputBase, borderColor: errors.city ? "var(--color-danger)" : "var(--color-border)" }}
                      aria-label="City and state"
                    />
                  </Field>
                </div>

                <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                  <button
                    onClick={() => { if (validate()) setStep("review"); }}
                    className="btn-primary"
                    style={{ flexShrink: 0, paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                  >
                    Continue to review
                  </button>
                  <button
                    onClick={() => setStep("cart")}
                    style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-stone)", background: "none", border: "none", cursor: "pointer", transition: "color 150ms ease", padding: 0 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-bone)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-stone)")}
                  >
                    ← Back to bag
                  </button>
                </div>
              </div>

              {/* Mini bag summary */}
              <div style={{ position: "sticky", top: "80px", alignSelf: "start" }}>
                <OrderSummary items={items} totalFormatted={totalFormatted} />
              </div>
            </div>
          )}

          {/* ════════════════════════════════
              STEP 3 — REVIEW & PAY
              ════════════════════════════════ */}
          {step === "review" && (
            <div style={gridStyle} className="lg:grid-cols-[1fr_340px]">
              <div>
                {/* Items */}
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-stone)", marginBottom: "0.25rem" }}>Items</p>
                {items.map((item) => (
                  <CartLine key={`${item.id}-${item.size}`} item={item} readonly />
                ))}

                {/* Delivery details */}
                <div style={{ marginTop: "2rem", paddingTop: "1.75rem", borderTop: "1px solid var(--color-border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-stone)" }}>Delivery Details</p>
                    <button
                      onClick={() => setStep("details")}
                      style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-stone)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px", padding: 0 }}
                    >
                      Edit
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    {[
                      ["Name", form.name],
                      ["Email", form.email],
                      ["WhatsApp", form.phone],
                      ["Address", `${form.address}, ${form.city}`],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-dim)", marginBottom: "0.25rem" }}>{label}</p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-bone)", lineHeight: 1.4 }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep("details")}
                  style={{ marginTop: "1.5rem", fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-stone)", background: "none", border: "none", cursor: "pointer", transition: "color 150ms ease", padding: 0 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-bone)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-stone)")}
                >
                  ← Edit details
                </button>
              </div>

              {/* Pay panel */}
              <div style={{ position: "sticky", top: "80px", alignSelf: "start" }}>
                <div style={{ background: "var(--color-surface)", padding: "1.5rem" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-stone)", marginBottom: "1.25rem" }}>Payment</p>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-stone)" }}>Subtotal</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-bone)" }}>{totalFormatted}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-stone)" }}>Delivery</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-dim)" }}>Calculated after order</span>
                  </div>
                  <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem", marginTop: "1rem", display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 700, color: "var(--color-bone)" }}>Total</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 700, color: "var(--color-bone)" }}>{totalFormatted}</span>
                  </div>

                  <button
                    onClick={handlePay}
                    style={{ width: "100%", padding: "1.125rem", background: "var(--color-steeze-pink)", color: "#FFFFFF", fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", border: "none", borderRadius: "9999px", cursor: "pointer", transition: "opacity 180ms ease, transform 150ms ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    Pay {totalFormatted}
                  </button>

                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", color: "var(--color-dim)", textAlign: "center", marginTop: "0.875rem", lineHeight: 1.55 }}>
                    Secure payment via Paystack · Your receipt will be sent to {form.phone || "your WhatsApp"}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
