// studio/schemas/index.js
// Register all schemas here. Sanity uses this to build the Studio UI.

import product from './product'
import homepage from './homepage'
import aboutPage from './aboutPage'
import siteSettings from './siteSettings'
import dropSignup from './dropSignup'

export const schemaTypes = [
  product,
  homepage,
  aboutPage,
  siteSettings,
  dropSignup
]