// src/pages/Home.jsx
import BrandStatement from "../components/BrandStatement";
import DropSignup from "../components/DropSignup";
import FeaturedDrop from "../components/FeaturedDrop";
import Hero from "../components/Hero";
import RealFits from "../components/RealFits";
import ShopByCategory from "../components/ShopByCategory";
export default function Home() {
  return (
    <section className="">
      <Hero />
      <FeaturedDrop />
      <BrandStatement />
      <RealFits />
      <DropSignup />
      <ShopByCategory />
    </section>
  );
}
