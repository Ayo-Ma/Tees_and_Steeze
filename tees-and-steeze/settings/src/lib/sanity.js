// src/lib/sanity.js
// Sanity client for fetching data in the React app.
// Image URL builder for responsive images.

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID, // from .env
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // faster reads, cached
})

// ── IMAGE URL BUILDER ──
// Usage: urlFor(image).width(800).url()
const builder = imageUrlBuilder(client)
export function urlFor(source) {
  return builder.image(source)
}

// ── QUERY HELPERS ──`

// Get all products (for Shop page)
export async function getAllProducts() {
  return client.fetch(`
    *[_type == "product"] | order(order asc) {
      _id,
      name,
      "slug": slug.current,
      price,
      category,
      sizes,
      images,
      story,
      sizeGuide,
      customerPhotos,
      inStock,
      featured,
      order
    }
  `)
}

// Get featured products (for Homepage)
export async function getFeaturedProducts() {
  return client.fetch(`
    *[_type == "product" && featured == true] | order(order asc) [0...4] {
      _id,
      name,
      "slug": slug.current,
      price,
      category,
      images
    }
  `)
}

// Get single product by slug (for Product page)
export async function getProductBySlug(slug) {
  return client.fetch(`
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current,
      price,
      category,
      sizes,
      images,
      story,
      sizeGuide,
      customerPhotos,
      inStock
    }
  `, { slug })
}

// Get related products (for Product page — "More steeze")
export async function getRelatedProducts(currentSlug, limit = 3) {
  return client.fetch(`
    *[_type == "product" && slug.current != $currentSlug && inStock == true] | order(order asc) [0...$limit] {
      _id,
      name,
      "slug": slug.current,
      price,
      images
    }
  `, { currentSlug, limit })
}

// Get products by category (for filtered Shop page)
export async function getProductsByCategory(category) {
  return client.fetch(`
    *[_type == "product" && category == $category] | order(order asc) {
      _id,
      name,
      "slug": slug.current,
      price,
      category,
      images,
      inStock
    }
  `, { category })
}

// Get homepage content
export async function getHomepage() {
  return client.fetch(`
    *[_type == "homepage"][0] {
      heroHeadline,
      heroSubheadline,
      heroImage,
      heroCta,
      heroSecondaryLink,
      brandHeadline,
      brandBody,
      brandImage,
      ugcHeadline,
      ugcSubheadline,
      ugcImages,
      dropHeadline,
      dropSubheadline,
      categoriesHeadline,
      categoryImages
    }
  `)
}

// Get about page content
export async function getAboutPage() {
  return client.fetch(`
    *[_type == "aboutPage"][0] {
      openingHeadline,
      foundingStory,
      timeline,
      unisexHeadline,
      unisexBody,
      unisexImage,
      piecesHeadline,
      piecesBody,
      piecesImage,
      ctaHeadline,
      ctaButtonText
    }
  `)
}

// Get site settings
export async function getSiteSettings() {
  return client.fetch(`
    *[_type == "siteSettings"][0] {
      brandName,
      tagline,
      logo,
      instagram,
      tiktok,
      whatsapp,
      deliveryInfo,
      deliveryDetails,
      returnsPolicy,
      seoTitle,
      seoDescription,
      ogImage
    }
  `)
}


// ── WRITE CLIENT (for form submissions) ──
const writeClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: import.meta.env.VITE_SANITY_WRITE_TOKEN,
})

export async function saveDropSignup({ name, contact, source }) {
  return writeClient.create({
    _type: 'dropSignup',
    name: name || '',
    contact,
    source: source || 'homepage',
    signedUpAt: new Date().toISOString(),
  })
}