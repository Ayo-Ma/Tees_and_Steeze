import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import { CartProvider } from "./context/CartContext";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import About from "./pages/About";
import DropSignup from "./pages/DropSignup";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";
import Cart from "./pages/Cart";

function App() {
  return (
    <SiteSettingsProvider>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
          </Route>
          {/* Drop signup has no nav/footer — standalone */}
          <Route path="/drop" element={<DropSignup />} />
          <Route path="*" element={<h1>404 Not Found</h1>} /> {/* Catch-all route */}

        </Routes>
      </BrowserRouter>
    </CartProvider>
    </SiteSettingsProvider>
  );
}

export default App;
