"use client";
import { FaqSection } from "../sections/FaqSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import CategorySection from "../sections/CategorySection";
import PopularSection from "../sections/PopularSestion";
import SomeProduct from "../sections/SomeProduct";
import MainSection from "../sections/MainSection";

export default function Page() {
  return (
    <>
      {/* MainSection */}
      <MainSection />

      {/* PopularSection */}
      <PopularSection />

      {/* Category */}
      <CategorySection />

      {/* Product */}
      <SomeProduct />

      {/* Review */}
      <TestimonialsSection />

      <FaqSection />
    </>
  );
}
