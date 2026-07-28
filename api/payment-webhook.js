// Vercel serverless function — Paystack webhook handler
// Receives payment.success events from Paystack and sends WhatsApp
// messages via Meta WhatsApp Cloud API.
//
// Required env vars (set in Vercel dashboard):
//   PAYSTACK_SECRET_KEY      — your Paystack secret key (starts with sk_)
//   WHATSAPP_TOKEN           — Meta permanent system user access token
//   WHATSAPP_PHONE_NUMBER_ID — from Meta Developer console → WhatsApp → Getting Started
//   BUSINESS_WHATSAPP        — your business WhatsApp number with country code, e.g. 2348012345678

import crypto from "crypto";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const WA_TOKEN = process.env.WHATSAPP_TOKEN;
const WA_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const BUSINESS_WA = process.env.BUSINESS_WHATSAPP;

function verifyPaystackSignature(rawBody, signature) {
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(rawBody)
    .digest("hex");
  return hash === signature;
}

function formatNigerianNumber(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "234" + digits.slice(1);
  if (digits.startsWith("234")) return digits;
  return "234" + digits;
}

async function sendWhatsApp(to, message) {
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${WA_PHONE_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WA_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      }),
    }
  );
  return res.ok;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Collect raw body for signature verification
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
  const customerPhone = meta.phone || "";
  const address = meta.address || "Not provided";
  const city = meta.city || "";
  const items = meta.items || [];
  const reference = data.reference;
  const amountNGN = (data.amount / 100).toLocaleString("en-NG");

  const itemLines = items.length
    ? items.map((i) => `• ${i.name} (${i.size}) × ${i.quantity} — ₦${(i.price * i.quantity).toLocaleString()}`).join("\n")
    : "See order reference.";

  // Message to business
  const businessMsg =
    `🛍️ *NEW ORDER — Tee's & Steeze*\n\n` +
    `*Ref:* ${reference}\n` +
    `*Customer:* ${customerName}\n` +
    `*Phone:* ${customerPhone}\n` +
    `*Address:* ${address}${city ? ", " + city : ""}\n\n` +
    `*Items:*\n${itemLines}\n\n` +
    `*Total paid:* ₦${amountNGN}\n\n` +
    `Confirm and arrange delivery 🚀`;

  // Receipt to customer
  const customerMsg =
    `Hey ${customerName}! 👋\n\n` +
    `Your Tee's & Steeze order is *confirmed* ✅\n\n` +
    `*Order ref:* ${reference}\n\n` +
    `*Items:*\n${itemLines}\n\n` +
    `*Total:* ₦${amountNGN}\n` +
    `*Delivery to:* ${address}${city ? ", " + city : ""}\n\n` +
    `We'll reach out soon to confirm your delivery. Thank you for rocking with us! 🔥\n\n` +
    `— Tee's & Steeze`;

  const sends = [];
  if (BUSINESS_WA) sends.push(sendWhatsApp(BUSINESS_WA, businessMsg));
  if (customerPhone) sends.push(sendWhatsApp(formatNigerianNumber(customerPhone), customerMsg));

  await Promise.allSettled(sends);

  return res.status(200).json({ received: true });
}
