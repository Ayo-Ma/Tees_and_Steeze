import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSiteSettings } from "../context/SiteSettingsContext";

const PAYSTACK_PUBLIC_KEY =
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
  "pk_live_85298a51e09eb7758ae6e8d7530e4a9ce212f0a3";

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

function loadPaystack(cb) {
  if (window.PaystackPop) return cb();
  const script = document.createElement("script");
  script.src = "https://js.paystack.co/v1/inline.js";
  script.onload = cb;
  document.head.appendChild(script);
}

/* ── ICONS ── */
const IconMinus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <line x1="6" y1="12" x2="18" y2="12" />
  </svg>
);
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <line x1="12" y1="6" x2="12" y2="18" />
    <line x1="6" y1="12" x2="18" y2="12" />
  </svg>
);
const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <path d="M4 6h16M9 6V4h6v2M7 6l1 14h8l1-14" />
  </svg>
);
const IconWhatsApp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ── FIELD ── */
function Field({ label, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: "var(--font-body)",
          fontSize: "0.6875rem",
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-stone)",
          marginBottom: "0.375rem",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

/* ── CART LINE ITEM ── */
function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div
      className="flex gap-4 sm:gap-6"
      style={{
        paddingTop: "1.5rem",
        paddingBottom: "1.5rem",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <Link
        to={`/product/${item.id}`}
        className="block flex-shrink-0 overflow-hidden bg-surface"
        style={{ width: "96px", aspectRatio: "3 / 4" }}
      >
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </Link>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <Link
            to={`/product/${item.id}`}
            className="font-body font-medium text-bone block"
            style={{ fontSize: "0.9375rem", textDecoration: "none", lineHeight: "1.3" }}
          >
            {item.name}
          </Link>
          <p className="mt-1" style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-stone)" }}>
            Size: {item.size}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center" style={{ border: "1px solid var(--color-border)" }}>
            <button
              onClick={() => item.quantity > 1 && onUpdateQuantity(item.id, item.size, item.quantity - 1)}
              disabled={item.quantity <= 1}
              style={{ width: "36px", height: "36px", background: "transparent", border: "none", color: item.quantity <= 1 ? "var(--color-dim)" : "var(--color-bone)", cursor: item.quantity <= 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              aria-label="Decrease quantity"
            >
              <IconMinus />
            </button>
            <span
              className="font-body font-medium text-bone"
              style={{ width: "40px", height: "36px", fontSize: "0.8125rem", borderLeft: "1px solid var(--color-border)", borderRight: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.size, item.quantity + 1)}
              style={{ width: "36px", height: "36px", background: "transparent", border: "none", color: "var(--color-bone)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              aria-label="Increase quantity"
            >
              <IconPlus />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-body font-medium text-bone" style={{ fontSize: "0.9375rem" }}>
              ₦{(item.price * item.quantity).toLocaleString()}
            </span>
            <button
              onClick={() => onRemove(item.id, item.size)}
              style={{ background: "none", border: "none", color: "var(--color-dim)", padding: "0.25rem", transition: "color 200ms ease", cursor: "pointer", display: "flex" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-danger)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-dim)")}
              aria-label={`Remove ${item.name} from cart`}
            >
              <IconTrash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── WHATSAPP RECEIPT ── */
function buildWhatsAppReceipt({ name, phone, email, address, items, total, paymentRef, waNumber }) {
  const lines = [
    `🛍️ *New Order — Tee's & Steeze*`,
    ``,
    `*Ref:* ${paymentRef}`,
    `*Name:* ${name}`,
    `*WhatsApp:* ${phone}`,
    `*Email:* ${email}`,
    `*Delivery address:* ${address}`,
    ``,
    `*Items:*`,
    ...items.map((i) => `• ${i.name} (${i.size}) ×${i.quantity} — ₦${(i.price * i.quantity).toLocaleString()}`),
    ``,
    `*Total paid:* ₦${total.toLocaleString()}`,
    ``,
    `Please confirm and process my order. Thank you! 🙏`,
  ];
  const raw = lines.join("\n");
  const number = waNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(raw)}`;
}

/* ── MAIN CART PAGE ── */
export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, total, totalFormatted } = useCart();
  const settings = useSiteSettings();

  const [step, setStep] = useState("cart"); // 'cart' | 'checkout' | 'success'
  const [paymentRef, setPaymentRef] = useState(null);
  const [whatsappUrl, setWhatsappUrl] = useState(null);

  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const formValid = name.trim() && phone.trim() && email.trim() && address.trim();

  const handleCheckout = () => {
    if (!formValid || items.length === 0) return;
    setStep("checkout");
  };

  const handlePay = () => {
    loadPaystack(() => {
      payWithPaystack({
        email,
        name,
        phone,
        amount: total,
        metadata: {
          custom_fields: [
            { display_name: "Customer Name", variable_name: "name", value: name },
            { display_name: "WhatsApp", variable_name: "phone", value: phone },
            { display_name: "Delivery Address", variable_name: "address", value: address },
          ],
        },
        onSuccess: (response) => {
          const url = buildWhatsAppReceipt({
            name, phone, email, address, items, total,
            paymentRef: response.reference,
            waNumber: settings.whatsapp,
          });
          setPaymentRef(response.reference);
          setWhatsappUrl(url);
          setStep("success");
          clearCart();
        },
        onClose: () => {},
      });
    });
  };

  /* ── EMPTY CART ── */
  if (items.length === 0 && step !== "success") {
    return (
      <>
        <Helmet>
          <title>Cart — Tee's and Steeze</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <main className="container text-center" style={{ paddingTop: "clamp(8rem, 15vw, 12rem)", paddingBottom: "clamp(4rem, 8vw, 6rem)" }}>
          <h1 className="display-md">Your cart is empty.</h1>
          <p className="body-lg mt-4" style={{ color: "var(--color-stone)" }}>
            Nothing here yet. Go find your piece.
          </p>
          <div className="mt-8">
            <Link to="/shop" className="btn-primary">Shop the collection</Link>
          </div>
        </main>
      </>
    );
  }

  /* ── SUCCESS ── */
  if (step === "success") {
    return (
      <>
        <Helmet>
          <title>Order Confirmed — Tee's and Steeze</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <main className="container text-center" style={{ paddingTop: "clamp(8rem, 15vw, 12rem)", paddingBottom: "clamp(4rem, 8vw, 6rem)" }}>
          <div className="mx-auto animate-fade-up" style={{ maxWidth: "520px" }}>
            {/* Check circle */}
            <div
              className="flex items-center justify-center mx-auto"
              style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--color-steeze-green)", marginBottom: "1.5rem" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="square">
                <polyline points="4,12 9,17 20,6" />
              </svg>
            </div>

            <h1 className="display-md">Order confirmed.</h1>
            <p className="body-lg mt-4" style={{ color: "var(--color-stone)" }}>
              Payment received. Tap the button below to send your order details to us on WhatsApp — we'll confirm and ship fast.
            </p>

            {paymentRef && (
              <p className="mt-3" style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-dim)" }}>
                Ref: {paymentRef}
              </p>
            )}

            {/* WhatsApp CTA */}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full mt-8 font-body font-medium uppercase"
                style={{
                  fontSize: "0.8125rem",
                  letterSpacing: "0.08em",
                  padding: "1.125rem 2rem",
                  background: "#25D366",
                  color: "#fff",
                  borderRadius: "var(--radius-pill)",
                  textDecoration: "none",
                  transition: "opacity 200ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <IconWhatsApp />
                Send order to WhatsApp
              </a>
            )}

            <div className="mt-4">
              <Link to="/shop" className="btn-secondary">Continue shopping</Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  /* ── CART + CHECKOUT ── */
  return (
    <>
      <Helmet>
        <title>Cart — Tee's and Steeze</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className="container" style={{ paddingTop: "clamp(6rem, 10vw, 8rem)", paddingBottom: "clamp(4rem, 8vw, 6rem)" }}>
        <h1 className="display-md animate-fade-up">
          {step === "cart" ? "Your cart." : "Checkout."}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 mt-8 md:mt-12">
          {/* ── LEFT: ITEMS ── */}
          <div className="lg:col-span-2 animate-fade-up animate-delay-100">
            {items.map((item) => (
              <CartItem
                key={`${item.id}-${item.size}`}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* ── RIGHT: ORDER SUMMARY ── */}
          <div className="lg:sticky animate-fade-up animate-delay-200" style={{ top: "100px", alignSelf: "start" }}>
            <div style={{ background: "var(--color-surface)", padding: "1.5rem" }}>
              <h2 className="font-body font-medium text-bone" style={{ fontSize: "0.9375rem", marginBottom: "1rem" }}>
                Order summary
              </h2>

              {/* Line items */}
              <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex justify-between mb-2"
                    style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem" }}
                  >
                    <span style={{ color: "var(--color-stone)" }}>
                      {item.name} ({item.size}) × {item.quantity}
                    </span>
                    <span style={{ color: "var(--color-bone)" }}>
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery */}
              <div className="flex justify-between mb-1" style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem" }}>
                <span style={{ color: "var(--color-stone)" }}>Delivery</span>
                <span style={{ color: "var(--color-stone)" }}>Calculated after order</span>
              </div>

              {/* Total */}
              <div className="flex justify-between" style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem", marginTop: "1rem" }}>
                <span className="font-body font-medium text-bone" style={{ fontSize: "1rem" }}>Total</span>
                <span className="font-body font-medium text-bone" style={{ fontSize: "1.125rem" }}>{totalFormatted}</span>
              </div>

              {/* ── CART STEP: customer details ── */}
              {step === "cart" && (
                <>
                  <div className="mt-6 flex flex-col gap-3">
                    <Field label="Full name *">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Amara Obi"
                        className="input w-full"
                        required
                        aria-label="Full name"
                      />
                    </Field>

                    <Field label="WhatsApp number *">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 08012345678"
                        className="input w-full"
                        required
                        aria-label="WhatsApp number"
                      />
                    </Field>

                    <Field label="Email *">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="for payment receipt"
                        className="input w-full"
                        required
                        aria-label="Email address"
                      />
                    </Field>

                    <Field label="Delivery address *">
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Full address with city and state"
                        className="input w-full"
                        rows={3}
                        required
                        aria-label="Delivery address"
                        style={{ resize: "vertical", minHeight: "80px" }}
                      />
                    </Field>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={!formValid}
                    className="w-full mt-4 cursor-pointer font-body font-medium uppercase"
                    style={{
                      fontSize: "0.8125rem",
                      letterSpacing: "0.08em",
                      padding: "1.125rem 2rem",
                      border: "none",
                      borderRadius: "0",
                      background: !formValid ? "var(--color-surface-elevated)" : "var(--color-steeze-pink)",
                      color: !formValid ? "var(--color-dim)" : "var(--color-bone)",
                      cursor: !formValid ? "not-allowed" : "pointer",
                      transition: "all 200ms ease",
                    }}
                  >
                    Proceed to payment
                  </button>
                </>
              )}

              {/* ── CHECKOUT STEP: review & pay ── */}
              {step === "checkout" && (
                <>
                  <div
                    className="mt-6"
                    style={{
                      background: "var(--color-surface-elevated)",
                      padding: "0.875rem 1rem",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    {[
                      ["Name", name],
                      ["WhatsApp", phone],
                      ["Email", email],
                      ["Address", address],
                    ].map(([label, val]) => (
                      <div key={label} className="flex gap-2 mb-1 last:mb-0" style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem" }}>
                        <span style={{ color: "var(--color-dim)", minWidth: "60px" }}>{label}</span>
                        <span style={{ color: "var(--color-stone)" }}>{val}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handlePay}
                    className="w-full mt-4 cursor-pointer font-body font-medium uppercase"
                    style={{
                      fontSize: "0.8125rem",
                      letterSpacing: "0.08em",
                      padding: "1.125rem 2rem",
                      border: "none",
                      borderRadius: "0",
                      background: "var(--color-steeze-green)",
                      color: "var(--color-void)",
                      transition: "opacity 200ms ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Pay {totalFormatted}
                  </button>

                  <button
                    onClick={() => setStep("cart")}
                    className="w-full mt-2 font-body cursor-pointer"
                    style={{ fontSize: "0.75rem", color: "var(--color-stone)", background: "none", border: "none", padding: "0.5rem", textDecoration: "underline", textUnderlineOffset: "3px" }}
                  >
                    ← Edit details
                  </button>
                </>
              )}

              <p className="mt-4 text-center" style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", color: "var(--color-dim)", lineHeight: "1.5" }}>
                Ships nationwide. 3–5 business days.
                <br />
                Secure payment via Paystack.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
