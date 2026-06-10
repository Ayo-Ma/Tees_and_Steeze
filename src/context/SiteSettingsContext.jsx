// src/context/SiteSettingsContext.jsx
// Fetches site settings from Sanity once on app load.
// Navbar, Footer, and Product pages all pull from here.

import { createContext, useContext, useEffect, useState } from 'react'
import { getSiteSettings } from '../../tees-and-steeze/settings/src/lib/sanity'


// Fallback values — used while Sanity loads or if fetch fails
const DEFAULTS = {
    brandName: "Tee's & Steeze",
    tagline: 'Unisex streetwear from Jos. Built with story. Worn with steeze.',
    instagram: 'https://instagram.com/teesandsteeze',
    tiktok: 'https://tiktok.com/@teesandsteeze',
    whatsapp: 'https://wa.me/234XXXXXXXXXX',
    deliveryInfo: 'Ships nationwide. 3–5 business days.',
    deliveryDetails: "We ship nationwide. Every order is processed within 24 hours and delivered in 3–5 business days. You'll get a tracking link the moment your piece leaves. Lagos and Abuja orders typically arrive in 2–3 days. Other states 4–5 days.",
    returnsPolicy: "If something's wrong — wrong size, damage, not what you expected — message us on WhatsApp within 48 hours of delivery. Send a photo. We sort it. No long forms, no back-and-forth, no ghosting. We built this brand on trust and that doesn't stop after you pay.",
    seoTitle: "Tee's and Steeze — Nigerian Unisex Streetwear | Shop the Drop",
    seoDescription: 'Unisex streetwear from Jos, Nigeria. Graphic tees, hoodies, jerseys, and more — built with real story, real steeze. Shop the latest drop.',
}
const SiteSettingsContext = createContext(DEFAULTS)

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        if (data) {
          setSettings({ ...DEFAULTS, ...data })
        }
        setLoaded(true)
      })
      .catch((err) => {
        console.error('Failed to load site settings:', err)
        setLoaded(true) // still render with defaults
      })
  }, [])

  return (
    <SiteSettingsContext.Provider value={{ ...settings, loaded }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}