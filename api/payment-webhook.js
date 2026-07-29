// Vercel serverless function — Paystack webhook → email notifications
// Sends order email to business and receipt email to customer via Resend.
//
// Required env vars (set in Vercel dashboard):
//   PAYSTACK_SECRET_KEY  — your Paystack secret key (sk_live_...)
//   RESEND_API_KEY       — from resend.com (free: 3000 emails/month)
//   BUSINESS_EMAIL       — email you want orders sent to, e.g. hello@teesandsteeze.com
//   FROM_EMAIL           — verified sender address in Resend, e.g. orders@teesandsteeze.com

import crypto from "crypto";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL || "orders@teesandsteeze.com";

function verifyPaystackSignature(rawBody, signature) {
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(rawBody)
    .digest("hex");
  return hash === signature;
}

async function sendEmail({ to, subject, html }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  return res.ok;
}

function buildItemRows(items) {
  if (!items?.length) return "<tr><td colspan='3'>See order reference</td></tr>";
  return items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${i.name} (Size ${i.size}${i.color ? `, ${i.color}` : ""})</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${i.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">₦${(i.price * i.quantity).toLocaleString()}</td>
      </tr>`
    )
    .join("");
}

function businessEmailHtml({ name, email, phone, address, city, items, total, ref }) {
  return `
  <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;">
    <div style="background:#0A0A0A;padding:24px 32px;">
      <h1 style="color:#E84B8A;font-size:20px;margin:0;letter-spacing:-0.02em;">Tee's & Steeze</h1>
      <p style="color:#888;font-size:12px;margin:4px 0 0;">New Order Notification</p>
    </div>
    <div style="padding:32px;">
      <h2 style="font-size:18px;color:#0A0A0A;margin:0 0 4px;">New order received 🛍️</h2>
      <p style="color:#666;font-size:13px;margin:0 0 24px;">Ref: <strong>${ref}</strong></p>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.06em;width:120px;">Customer</td><td style="padding:8px 0;color:#0A0A0A;font-size:14px;">${name}</td></tr>
        <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.06em;">Email</td><td style="padding:8px 0;color:#0A0A0A;font-size:14px;">${email}</td></tr>
        <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.06em;">WhatsApp</td><td style="padding:8px 0;color:#0A0A0A;font-size:14px;">${phone}</td></tr>
        <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.06em;">Delivery</td><td style="padding:8px 0;color:#0A0A0A;font-size:14px;">${address}${city ? ", " + city : ""}</td></tr>
      </table>

      <table style="width:100%;border-collapse:collapse;background:#f9f9f9;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#0A0A0A;">
            <th style="padding:10px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.06em;">Item</th>
            <th style="padding:10px 12px;text-align:center;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.06em;">Qty</th>
            <th style="padding:10px 12px;text-align:right;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.06em;">Price</th>
          </tr>
        </thead>
        <tbody>${buildItemRows(items)}</tbody>
        <tfoot>
          <tr style="background:#E84B8A;">
            <td colspan="2" style="padding:12px;color:#fff;font-weight:700;font-size:14px;">Total Paid</td>
            <td style="padding:12px;text-align:right;color:#fff;font-weight:700;font-size:14px;">₦${Number(total).toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      <div style="margin-top:24px;padding:16px;background:#fff8e1;border-left:3px solid #E84B8A;border-radius:4px;">
        <p style="margin:0;font-size:13px;color:#555;">Confirm with the customer on WhatsApp: <strong>${phone}</strong> and arrange delivery.</p>
      </div>
    </div>
  </div>`;
}

function customerEmailHtml({ name, address, city, items, total, ref }) {
  const firstName = name.split(" ")[0];
  return `
  <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;">
    <div style="background:#0A0A0A;padding:24px 32px;">
      <h1 style="color:#E84B8A;font-size:20px;margin:0;letter-spacing:-0.02em;">Tee's & Steeze</h1>
      <p style="color:#888;font-size:12px;margin:4px 0 0;">Order Confirmation</p>
    </div>
    <div style="padding:32px;">
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:56px;height:56px;background:#4ADE47;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:24px;">✓</div>
        <h2 style="font-size:22px;color:#0A0A0A;margin:12px 0 4px;">Order confirmed, ${firstName}!</h2>
        <p style="color:#888;font-size:13px;margin:0;">Ref: ${ref}</p>
      </div>

      <table style="width:100%;border-collapse:collapse;background:#f9f9f9;border-radius:8px;overflow:hidden;margin-bottom:24px;">
        <thead>
          <tr style="background:#0A0A0A;">
            <th style="padding:10px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.06em;">Item</th>
            <th style="padding:10px 12px;text-align:center;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.06em;">Qty</th>
            <th style="padding:10px 12px;text-align:right;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.06em;">Price</th>
          </tr>
        </thead>
        <tbody>${buildItemRows(items)}</tbody>
        <tfoot>
          <tr style="background:#E84B8A;">
            <td colspan="2" style="padding:12px;color:#fff;font-weight:700;font-size:14px;">Total Paid</td>
            <td style="padding:12px;text-align:right;color:#fff;font-weight:700;font-size:14px;">₦${Number(total).toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.06em;width:120px;">Delivery to</td><td style="padding:8px 0;color:#0A0A0A;font-size:14px;">${address}${city ? ", " + city : ""}</td></tr>
        <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.06em;">Timeline</td><td style="padding:8px 0;color:#0A0A0A;font-size:14px;">3–5 business days</td></tr>
      </table>

      <div style="margin-top:24px;padding:20px;background:#0A0A0A;border-radius:8px;text-align:center;">
        <p style="color:#F5F4F0;font-size:14px;margin:0 0 4px;">Questions? Reach us on WhatsApp</p>
        <p style="color:#E84B8A;font-size:13px;margin:0;">We'll reach out to confirm your delivery. Thank you! 🔥</p>
      </div>
    </div>
    <div style="padding:20px 32px;text-align:center;border-top:1px solid #eee;">
      <p style="color:#aaa;font-size:11px;margin:0;">© Tee's & Steeze · Jos, Nigeria · <a href="https://teesandsteeze.com" style="color:#E84B8A;text-decoration:none;">teesandsteeze.com</a></p>
    </div>
  </div>`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString("utf8");

  const signature = req.headers["x-paystack-signature"];
  if (!verifyPaystackSignature(rawBody, signature)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(rawBody);
  if (event.event !== "charge.success") {
    return res.status(200).json({ received: true });
  }

  const { data } = event;
  const meta = data.metadata || {};

  const customerName = meta.fullName || "Customer";
  const customerEmail = data.customer?.email || "";
  const customerPhone = meta.phone || "";
  const address = meta.address || "Not provided";
  const city = meta.city || "";
  const items = meta.items || [];
  const reference = data.reference;
  const total = data.amount / 100;

  const sends = [];

  if (BUSINESS_EMAIL) {
    sends.push(
      sendEmail({
        to: BUSINESS_EMAIL,
        subject: `New Order: ${customerName} — ₦${total.toLocaleString()} (${reference})`,
        html: businessEmailHtml({ name: customerName, email: customerEmail, phone: customerPhone, address, city, items, total, ref: reference }),
      })
    );
  }

  if (customerEmail) {
    sends.push(
      sendEmail({
        to: customerEmail,
        subject: `Your Tee's & Steeze order is confirmed ✅`,
        html: customerEmailHtml({ name: customerName, address, city, items, total, ref: reference }),
      })
    );
  }

  await Promise.allSettled(sends);
  return res.status(200).json({ received: true });
}
