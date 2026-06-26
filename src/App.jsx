import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ReactGA from "react-ga4";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import { CartProvider } from "./context/CartContext";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import About from "./pages/About";
import DropSignup from "./pages/DropSignup";
import Page404 from "./pages/Page404";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";
import Cart from "./pages/Cart";


ReactGA.initialize("G-QV42G64LF7"); 


function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return null;
}

function App() {
  return (
    <SiteSettingsProvider>
      <CartProvider>
        <BrowserRouter>
          <AnalyticsTracker />

          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home  />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
            </Route>

            {/* Drop signup has no nav/footer — standalone */}
            <Route path="/drop" element={<DropSignup />} />
            <Route path="*" element={<Page404/>} />
          </Routes>

        </BrowserRouter>
      </CartProvider>
    </SiteSettingsProvider>
  );
}

export default App;