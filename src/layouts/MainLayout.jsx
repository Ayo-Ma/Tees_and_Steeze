import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Commerce pages get white background
const LIGHT_ROUTES = ['/shop', '/product', '/cart']

export default function MainLayout() {
  const location = useLocation()
  const isLight = LIGHT_ROUTES.some((route) => location.pathname.startsWith(route))

  return (
    <div className={isLight ? 'theme-light' : ''} style={{ minHeight: '100vh' }}>
      <Navbar isLight={isLight} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}