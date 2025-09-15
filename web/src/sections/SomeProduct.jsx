import ProductCard from "../components/Cards/ProductCard";
import SectionTitle from "../components/Navs/SectionTitle";
import React from "react";
import { apiGet } from "../hooks/useApi";

export default function SomeProduct() {
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    apiGet('/api/products', { page: 1, limit: 10 })
      .then((res) => setItems(res.data || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <>
      <SectionTitle
        text1="More Product"
        text2="More Product For You"
        text3="Landing shop offers a large number of product categories with many different types. Diversity for customers to choose from."
      />
      <div className="container mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 place-items-center">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
