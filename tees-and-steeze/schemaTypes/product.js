// studio/schemas/product.js
// This schema defines what the client sees when adding/editing a product.

export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      description: 'e.g. "Nightshift Graphic Tee"',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'Auto-generated from the name. This becomes the product URL.',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price (₦)',
      type: 'number',
      description: 'Price in Naira. e.g. 18500 for ₦18,500',
      validation: (Rule) => Rule.required().positive(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Tees', value: 'tees' },
          { title: 'Hoodies', value: 'hoodies' },
          { title: 'Tang Top Shirt', value: 'Tang top shirt' },
          { title: 'Packet Shirts', value: 'packet-shirts' },
          { title: 'Steezy Bags', value: 'bags' },
          { title: 'P Cap', value: 'p cap' },
          { title: 'Net Cap', value: 'net cap' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'S', value: 'S' },
          { title: 'M', value: 'M' },
          { title: 'L', value: 'L' },
          { title: 'XL', value: 'XL' },
          { title: 'XXL', value: 'XXL' },
        ],
      },
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Description (for accessibility)',
              type: 'string',
              description: 'Describe the image. e.g. "Nightshift Graphic Tee front view"',
            },
          ],
        },
      ],
      description: 'Upload 4 images in order: front flat, back flat, worn front, worn back.',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'story',
      title: 'The Story',
      type: 'text',
      rows: 4,
      description: 'What inspired this piece? 2-3 sentences. Write in brand voice. Ends with "Wear it how you want. That\'s the point."',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'sizeGuide',
      title: 'Size Guide (measurements in cm)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'size', title: 'Size', type: 'string' },
            { name: 'chest', title: 'Chest (cm)', type: 'string' },
            { name: 'length', title: 'Length (cm)', type: 'string' },
            { name: 'shoulder', title: 'Shoulder (cm)', type: 'string' },
          ],
          preview: {
            select: { title: 'size', subtitle: 'chest' },
            prepare({ title, subtitle }) {
              return { title: `Size ${title}`, subtitle: `Chest: ${subtitle}cm` }
            },
          },
        },
      ],
      description: 'Add measurements for each available size.',
    },
    {
      name: 'customerPhotos',
      title: 'Customer Photos (Real Fits)',
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
              description: 'e.g. @username',
            },
          ],
        },
      ],
      description: 'Upload real customer photos wearing this piece. 4-6 images.',
    },
    {
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
      description: 'Turn off when sold out.',
    },
    {
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
      description: 'Turn on to show this product in the "Latest Drop" section on the homepage.',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first. Use 1, 2, 3, etc.',
      initialValue: 99,
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Price (Low to High)',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'images.0',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? subtitle.charAt(0).toUpperCase() + subtitle.slice(1) : '',
        media,
      }
    },
  },
}