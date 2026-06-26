import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Commerce pages get white background — homepage stays black
const LIGHT_ROUTES = ['/shop', '/product', '/cart']

export default function MainLayout() {
  const location = useLocation()
  const isLight = LIGHT_ROUTES.some((route) => location.pathname.startsWith(route))

  return (
    <div className={isLight ? 'theme-light' : ''} style={{ minHeight: '100vh', position: 'relative' }}>
      <img src="/logo.avif" alt="" aria-hidden="true" className="logo-watermark" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar isLight={isLight} />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}