// studio/schemas/siteSettings.js
// Singleton document — global site settings the client can update.

export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    // ── BRAND ──
    {
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      initialValue: "Tee's & Steeze",
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short tagline for the footer.',
      initialValue: 'Unisex streetwear from Jos. Built with story. Worn with steeze.',
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Upload your logo (PNG or SVG).',
    },

    // ── SOCIAL ──
    {
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
      description: 'Full URL. e.g. https://instagram.com/teesandsteeze',
    },
    {
      name: 'tiktok',
      title: 'TikTok URL',
      type: 'url',
      description: 'Full URL. e.g. https://tiktok.com/@teesandsteeze',
    },
    {
      name: 'whatsapp',
      title: 'WhatsApp Link',
      type: 'url',
      description: 'Full wa.me link. e.g. https://wa.me/234XXXXXXXXXX',
    },

    // ── DELIVERY ──
    {
      name: 'deliveryInfo',
      title: 'Delivery Info (short)',
      type: 'string',
      description: 'One line for the footer and product pages.',
      initialValue: 'Ships nationwide. 3–5 business days.',
    },
    {
      name: 'deliveryDetails',
      title: 'Delivery Details (full)',
      type: 'text',
      rows: 4,
      description: 'Full delivery paragraph for the product page.',
      initialValue: "We ship nationwide. Every order is processed within 24 hours and delivered in 3–5 business days. You'll get a tracking link the moment your piece leaves. Lagos and Abuja orders typically arrive in 2–3 days. Other states 4–5 days.",
    },
    {
      name: 'returnsPolicy',
      title: 'Returns Policy',
      type: 'text',
      rows: 4,
      description: 'Full returns paragraph for the product page.',
      initialValue: "If something's wrong — wrong size, damage, not what you expected — message us on WhatsApp within 48 hours of delivery. Send a photo. We sort it. No long forms, no back-and-forth, no ghosting. We built this brand on trust and that doesn't stop after you pay.",
    },

    // ── SEO DEFAULTS ──
    {
      name: 'seoTitle',
      title: 'Default SEO Title',
      type: 'string',
      initialValue: "Tee's and Steeze — Nigerian Unisex Streetwear | Shop the Drop",
    },
    {
      name: 'seoDescription',
      title: 'Default SEO Description',
      type: 'text',
      rows: 2,
      initialValue: "Unisex streetwear from Jos, Nigeria. Graphic tees, hoodies, jerseys, and more — built with real story, real steeze. Shop the latest drop.",
    },
    {
      name: 'ogImage',
      title: 'Default Social Share Image',
      type: 'image',
      description: 'The image shown when the site is shared on social media. Recommended: 1200×630px.',
    },
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
}