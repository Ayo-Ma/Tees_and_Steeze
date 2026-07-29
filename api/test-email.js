export default async function handler(req, res) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || "orders@teesandsteeze.com";
  const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: BUSINESS_EMAIL,
      subject: "Resend domain test",
      html: "<p>Domain verification test from Tee's & Steeze.</p>",
    }),
  });

  const data = await response.json();
  return res.status(200).json({ status: response.status, from: FROM_EMAIL, to: BUSINESS_EMAIL, resend: data });
}
