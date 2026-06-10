// studio/schemas/homepage.js
// Singleton document — only one homepage. Client edits content here.

export default {
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    // ── HERO SECTION ──
    {
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'The big headline on the homepage. e.g. "Not just clothes. The steeze."',
      initialValue: 'Not just clothes. The steeze.',
    },
    {
      name: 'heroSubheadline',
      title: 'Hero Subheadline',
      type: 'text',
      rows: 2,
      description: 'The smaller text below the headline.',
      initialValue: "Three years of building something that means something. Unisex streetwear for people who'd rather be felt than followed.",
    },
    {
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Wide lifestyle photo. Someone wearing the brand, real environment.',
    },
    {
      name: 'heroCta',
      title: 'Hero Button Text',
      type: 'string',
      initialValue: 'Shop the drop',
    },
    {
      name: 'heroSecondaryLink',
      title: 'Hero Secondary Link Text',
      type: 'string',
      initialValue: 'Get the next drop first →',
    },

    // ── BRAND STATEMENT SECTION ──
    {
      name: 'brandHeadline',
      title: 'Brand Statement Headline',
      type: 'string',
      initialValue: 'Every piece carries something.',
    },
    {
      name: 'brandBody',
      title: 'Brand Statement Body',
      type: 'text',
      rows: 8,
      description: 'The full brand statement. 3 paragraphs. Separate paragraphs with a blank line.',
    },
    {
      name: 'brandImage',
      title: 'Brand Statement Lifestyle Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Someone wearing the brand expressively. Real, not posed.',
    },

    // ── UGC SECTION ──
    {
      name: 'ugcHeadline',
      title: 'UGC Section Headline',
      type: 'string',
      initialValue: 'Worn, not modelled.',
    },
    {
      name: 'ugcSubheadline',
      title: 'UGC Section Subheadline',
      type: 'string',
      initialValue: 'Real people. Real fits. No casting calls.',
    },
    {
      name: 'ugcImages',
      title: 'Community Photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'handle',
              title: 'IG Handle',
              type: 'string',
            },
          ],
        },
      ],
      description: 'Upload 6-8 real customer photos. Phone quality is fine.',
    },

    // ── DROP SIGNUP SECTION ──
    {
      name: 'dropHeadline',
      title: 'Drop Signup Headline',
      type: 'string',
      initialValue: 'Get the drop first.',
    },
    {
      name: 'dropSubheadline',
      title: 'Drop Signup Subheadline',
      type: 'string',
      initialValue: 'Early access to every release. No spam. No newsletters. Just the drop.',
    },

    // ── CATEGORIES SECTION ──
    {
      name: 'categoriesHeadline',
      title: 'Categories Section Headline',
      type: 'string',
      initialValue: 'Find your piece.',
    },
    {
      name: 'categoryImages',
      title: 'Category Tile Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  { title: 'Tees', value: 'tees' },
                  { title: 'Hoodies', value: 'hoodies' },
                  { title: 'Jerseys', value: 'jerseys' },
                  { title: 'Pocket Shirts', value: 'pocket-shirts' },
                  { title: 'Armless', value: 'armless' },
                ],
              },
            },
            {
              name: 'image',
              title: 'Tile Image',
              type: 'image',
              options: { hotspot: true },
            },
          ],
          preview: {
            select: { title: 'category', media: 'image' },
          },
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return { title: 'Homepage' }
    },
  },
}