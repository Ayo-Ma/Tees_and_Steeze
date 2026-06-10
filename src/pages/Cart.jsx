import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

/*
 * ── PAYSTACK INLINE CHECKOUT ──
 * Loads Paystack's inline JS and opens the payment modal.
 * Replace PAYSTACK_PUBLIC_KEY with your live/test key.
 *
 * Docs: https://paystack.com/docs/payments/accept-payments/#popup
 */
const PAYSTACK_PUBLIC_KEY = "pk_test_85298a51e09eb7758ae6e8d7530e4a9ce212f0a3"; // TODO: replace with real key

function payWithPaystack({ email, amount, onSuccess, onClose }) {
  const handler = window.PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email,
    amount: amount * 100, // Paystack expects kobo (₦1 = 100 kobo)
    currency: "NGN",
    callback: (response) => {
      onSuccess(response);
    },
    onClose: () => {
      onClose();
    },
  });
  handler.openIframe();
}

/*
 * ── ICONS ──
 */
const IconMinus = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
  >
    <line x1="6" y1="12" x2="18" y2="12" />
  </svg>
);

const IconPlus = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
  >
    <line x1="12" y1="6" x2="12" y2="18" />
    <line x1="6" y1="12" x2="18" y2="12" />
  </svg>
);

const IconTrash = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
  >
    <path d="M4 6h16M9 6V4h6v2M7 6l1 14h8l1-14" />
  </svg>
);

/*
 * ── CART LINE ITEM ──
 */
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
      {/* Image */}
      <Link
        to={`/product/${item.id}`}
        className="block flex-shrink-0 overflow-hidden bg-surface"
        style={{ width: "100px", aspectRatio: "3 / 4" }}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <Link
            to={`/product/${item.id}`}
            className="font-body font-medium text-bone block"
            style={{
              fontSize: "0.9375rem",
              textDecoration: "none",
              lineHeight: "1.3",
            }}
          >
            {item.name}
          </Link>
          <p
            className="mt-1"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "var(--color-stone)",
            }}
          >
            Size: {item.size}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity controls */}
          <div
            className="flex items-center"
            style={{ border: "1px solid var(--color-border)" }}
          >
            <button
              onClick={() =>
                onUpdateQuantity(item.id, item.size, item.quantity - 1)
              }
              disabled={item.quantity <= 1}
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: "36px",
                height: "36px",
                background: "transparent",
                border: "none",
                color:
                  item.quantity <= 1 ? "var(--color-dim)" : "var(--color-bone)",
                cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
              }}
              aria-label="Decrease quantity"
            >
              <IconMinus />
            </button>
            <span
              className="flex items-center justify-center font-body font-medium text-bone"
              style={{
                width: "40px",
                height: "36px",
                fontSize: "0.8125rem",
                borderLeft: "1px solid var(--color-border)",
                borderRight: "1px solid var(--color-border)",
              }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() =>
                onUpdateQuantity(item.id, item.size, item.quantity + 1)
              }
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: "36px",
                height: "36px",
                background: "transparent",
                border: "none",
                color: "var(--color-bone)",
              }}
              aria-label="Increase quantity"
            >
              <IconPlus />
            </button>
          </div>

          {/* Price + remove */}
          <div className="flex items-center gap-4">
            <span
              className="font-body font-medium text-bone"
              style={{ fontSize: "0.9375rem" }}
            >
              ₦{(item.price * item.quantity).toLocaleString()}
            </span>
            <button
              onClick={() => onRemove(item.id, item.size)}
              className="flex items-center justify-center cursor-pointer"
              style={{
                background: "none",
                border: "none",
                color: "var(--color-dim)",
                padding: "0.25rem",
                transition: "color 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-danger)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-dim)";
              }}
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

/*
 * ── MAIN CART PAGE ──
 */
export default function Cart() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    itemCount,
    total,
    totalFormatted,
  } = useCart();
  const [email, setEmail] = useState("");
  const [checkoutStep, setCheckoutStep] = useState("cart"); // 'cart' | 'checkout' | 'success'
  const [paymentRef, setPaymentRef] = useState(null);

  const handleCheckout = () => {
    if (!email.trim() || items.length === 0) return;
    setCheckoutStep("checkout");
  };

  const handlePay = () => {
    // Load Paystack script if not already loaded
    if (!window.PaystackPop) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.onload = () => {
        payWithPaystack({
          email,
          amount: total,
          onSuccess: (response) => {
            setPaymentRef(response.reference);
            setCheckoutStep("success");
            clearCart();
          },
          onClose: () => {
            // User closed payment modal — stay on checkout
          },
        });
      };
      document.head.appendChild(script);
    } else {
      payWithPaystack({
        email,
        amount: total,
        onSuccess: (response) => {
          setPaymentRef(response.reference);
          setCheckoutStep("success");
          clearCart();
        },
        onClose: () => {},
      });
    }
  };

  // ── EMPTY CART ──
  if (items.length === 0 && checkoutStep !== "success") {
    return (
      <>
        <Helmet>
          <title>Cart — Tee's and Steeze</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <main
          className="container text-center"
          style={{
            paddingTop: "clamp(8rem, 15vw, 12rem)",
            paddingBottom: "clamp(4rem, 8vw, 6rem)",
          }}
        >
          <h1 className="display-md">Your cart is empty.</h1>
          <p className="body-lg mt-4" style={{ color: "var(--color-stone)" }}>
            Nothing here yet. Go find your piece.
          </p>
          <div className="mt-8">
            <Link to="/shop" className="btn-primary">
              Shop the collection
            </Link>
          </div>
        </main>
      </>
    );
  }

  // ── SUCCESS ──
  if (checkoutStep === "success") {
    return (
      <>
        <Helmet>
          <title>Order Confirmed — Tee's and Steeze</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <main
          className="container text-center"
          style={{
            paddingTop: "clamp(8rem, 15vw, 12rem)",
            paddingBottom: "clamp(4rem, 8vw, 6rem)",
          }}
        >
          <div
            className="mx-auto animate-fade-up"
            style={{ maxWidth: "480px" }}
          >
            <div
              className="flex items-center justify-center mx-auto"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--color-steeze-green)",
                marginBottom: "1.5rem",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0A0A0A"
                strokeWidth="2.5"
                strokeLinecap="square"
              >
                <polyline points="4,12 9,17 20,6" />
              </svg>
            </div>

            <h1 className="display-md">Order confirmed.</h1>
            <p className="body-lg mt-4" style={{ color: "var(--color-stone)" }}>
              Your steeze is on the way. You'll get a tracking link on WhatsApp
              the moment it ships.
            </p>

            {paymentRef && (
              <p
                className="mt-4"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  color: "var(--color-dim)",
                }}
              >
                Reference: {paymentRef}
              </p>
            )}

            <div className="mt-8">
              <Link to="/shop" className="btn-secondary">
                Continue shopping
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ── CART + CHECKOUT ──
  return (
    <>
      <Helmet>
        <title>Cart — Tee's and Steeze</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main
        className="container"
        style={{
          paddingTop: "clamp(6rem, 10vw, 8rem)",
          paddingBottom: "clamp(4rem, 8vw, 6rem)",
        }}
      >
        <h1 className="display-md animate-fade-up">
          {checkoutStep === "cart" ? "Your cart." : "Checkout."}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 mt-8 md:mt-12">
          {/* ── LEFT: CART ITEMS ── */}
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

          {/* ── RIGHT: ORDER SUMMARY (sticky) ── */}
          <div
            className="lg:sticky animate-fade-up animate-delay-200"
            style={{ top: "100px", alignSelf: "start" }}
          >
            <div
              style={{
                background: "var(--color-surface)",
                padding: "1.5rem",
              }}
            >
              <h2
                className="font-body font-medium text-bone"
                style={{ fontSize: "0.9375rem", marginBottom: "1rem" }}
              >
                Order summary
              </h2>

              {/* Line items summary */}
              <div
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  paddingBottom: "1rem",
                  marginBottom: "1rem",
                }}
              >
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex justify-between mb-2"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8125rem",
                    }}
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
              <div
                className="flex justify-between mb-1"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                }}
              >
                <span style={{ color: "var(--color-stone)" }}>Delivery</span>
                <span style={{ color: "var(--color-stone)" }}>
                  Calculated at checkout
                </span>
              </div>

              {/* Total */}
              <div
                className="flex justify-between"
                style={{
                  borderTop: "1px solid var(--color-border)",
                  paddingTop: "1rem",
                  marginTop: "1rem",
                }}
              >
                <span
                  className="font-body font-medium text-bone"
                  style={{ fontSize: "1rem" }}
                >
                  Total
                </span>
                <span
                  className="font-body font-medium text-bone"
                  style={{ fontSize: "1.125rem" }}
                >
                  {totalFormatted}
                </span>
              </div>

              {/* Checkout step */}
              {checkoutStep === "cart" ? (
                <>
                  {/* Email input */}
                  <div className="mt-6">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email for order confirmation"
                      className="input w-full"
                      required
                      aria-label="Email address"
                    />
                  </div>

                  {/* Proceed button */}
                  <button
                    onClick={handleCheckout}
                    disabled={!email.trim()}
                    className="w-full mt-4 cursor-pointer font-body font-medium uppercase"
                    style={{
                      fontSize: "0.8125rem",
                      letterSpacing: "0.08em",
                      padding: "1.125rem 2rem",
                      border: "none",
                      borderRadius: "0",
                      background: !email.trim()
                        ? "var(--color-surface-elevated)"
                        : "var(--color-steeze-pink)",
                      color: !email.trim()
                        ? "var(--color-dim)"
                        : "var(--color-bone)",
                      cursor: !email.trim() ? "not-allowed" : "pointer",
                      transition: "all 200ms ease",
                    }}
                  >
                    Proceed to payment
                  </button>
                </>
              ) : (
                <>
                  {/* Pay with Paystack */}
                  <p
                    className="mt-6"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8125rem",
                      color: "var(--color-stone)",
                    }}
                  >
                    Paying as: <span className="text-bone">{email}</span>
                  </p>

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
                    Pay {totalFormatted}
                  </button>

                  <button
                    onClick={() => setCheckoutStep("cart")}
                    className="w-full mt-2 cursor-pointer font-body"
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-stone)",
                      background: "none",
                      border: "none",
                      padding: "0.5rem",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    ← Back to cart
                  </button>
                </>
              )}

              {/* Trust line */}
              <p
                className="mt-4 text-center"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.6875rem",
                  color: "var(--color-dim)",
                  lineHeight: "1.5",
                }}
              >
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
