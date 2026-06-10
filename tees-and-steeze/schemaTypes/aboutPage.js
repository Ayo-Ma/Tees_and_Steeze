// studio/schemas/aboutPage.js
// Singleton document — client can edit the full About page.

export default {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    // ── OPENING ──
    {
      name: 'openingHeadline',
      title: 'Opening Headline',
      type: 'string',
      description: 'The big statement at the top. e.g. "Three years. One idea. The steeze."',
      initialValue: 'Three years. One idea. The steeze.',
    },

    // ── FOUNDING STORY ──
    {
      name: 'foundingStory',
      title: 'Founding Story',
      type: 'text',
      rows: 12,
      description: 'The full founding story. Separate paragraphs with blank lines. Written in first person — "I started..." This is the most important text on the site.',
    },

    // ── TIMELINE ──
    {
      name: 'timeline',
      title: 'Timeline / Journey',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'year',
              title: 'Year / Date',
              type: 'string',
              description: 'e.g. "Sept 2022" or "2024"',
            },
            {
              name: 'text',
              title: 'What Happened',
              type: 'text',
              rows: 2,
              description: '1-2 sentences. What milestone was reached.',
            },
            {
              name: 'highlight',
              title: 'Highlight This Milestone',
              type: 'boolean',
              initialValue: false,
              description: 'Turn on for the most recent / current milestone. Shows in pink.',
            },
          ],
          preview: {
            select: { title: 'year', subtitle: 'text' },
          },
        },
      ],
    },

    // ── UNISEX CONVICTION ──
    {
      name: 'unisexHeadline',
      title: 'Unisex Section Headline',
      type: 'string',
      initialValue: 'For everyone. By design.',
    },
    {
      name: 'unisexBody',
      title: 'Unisex Section Body',
      type: 'text',
      rows: 6,
      description: 'The explanation of why the brand is genuinely unisex. Separate paragraphs with blank lines.',
    },
    {
      name: 'unisexImage',
      title: 'Unisex Section Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Photo showing two people of different genders wearing the same piece.',
    },

    // ── THE PIECES ──
    {
      name: 'piecesHeadline',
      title: 'Pieces Section Headline',
      type: 'string',
      initialValue: 'Made with something to say.',
    },
    {
      name: 'piecesBody',
      title: 'Pieces Section Body',
      type: 'text',
      rows: 8,
      description: 'The conviction statement about how pieces are made. Separate paragraphs with blank lines.',
    },
    {
      name: 'piecesImage',
      title: 'Pieces Section Background Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Close-up of fabric, stitching, or detail. Used as background image.',
    },

    // ── CTA ──
    {
      name: 'ctaHeadline',
      title: 'Bottom CTA Headline',
      type: 'string',
      initialValue: 'Now see what three years built.',
    },
    {
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'See the collection',
    },
  ],
  preview: {
    prepare() {
      return { title: 'About Page' }
    },
  },
}