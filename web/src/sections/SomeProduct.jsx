import ProductCard from "../components/Cards/ProductCard";
import SectionTitle from "../components/Navs/SectionTitle";
import { products } from "../data/products";

export default function SomeProduct() {

  return (
    <>
      <SectionTitle
        text1="More Product"
        text2="More Product For You"
        text3="Landing shop offers a large number of product categories with many different types. Diversity for customers to choose from."
      />
      <div className="container mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 place-items-center">
          {products.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
