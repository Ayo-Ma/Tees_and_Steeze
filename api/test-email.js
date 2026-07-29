// Temporary test endpoint — delete after confirming email works
export default async function handler(req, res) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL;
  const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL;

  if (!RESEND_API_KEY) return res.status(500).json({ error: "RESEND_API_KEY not set" });
  if (!FROM_EMAIL)    return res.status(500).json({ error: "FROM_EMAIL not set" });
  if (!BUSINESS_EMAIL) return res.status(500).json({ error: "BUSINESS_EMAIL not set" });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: BUSINESS_EMAIL,
      subject: "Test — Tee's & Steeze email is working ✅",
      html: "<p>If you can read this, the email automation is set up correctly. You can delete the test endpoint now.</p>",
    }),
  });

  const data = await response.json();
  return res.status(response.status).json({ status: response.status, resend: data, from: FROM_EMAIL, to: BUSINESS_EMAIL });
}
