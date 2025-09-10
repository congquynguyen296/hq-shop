import React from "react";
import { useParams } from "react-router-dom";
import ProductDetail from "../sections/ProductDetail";
import { products } from "../data/products";
import Comment from "../components/Cards/Comment";
import SectionTitle from "../components/Navs/SectionTitle";
import ProductCard from "../components/Cards/ProductCard";

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find((p) => String(p.id) === String(id));

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-12 mt-15">
      {!product ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-2">Product not found</h2>
          <p className="text-slate-500">
            The product you are looking for does not exist.
          </p>
        </div>
      ) : (
        <ProductDetail product={product} />
      )}

      {/* Đường kẻ mờ hơn và sát hơn */}
      <hr className="my-8 border-slate-200/60" />

      {/* Comment section full width */}
      <div className="w-full mt-[-40px]">
        <SectionTitle
          text1="Comment"
          text2="Frequently asked questions"
          text3="Ship Beautiful Frontends Without the Overhead — Customizable, Scalable, and Developer-Friendly UI Components."
        />

        <div className="mt-6">
          <Comment />
        </div>
      </div>

      {/* Same product */}
      <div className="w-full">
        <SectionTitle
          text1="Same Product"
          text2="Same Product For You"
          text3="Launch your SaaS product in record time with our all-in-one platform designed for speed"
        />

        <div className="grid mt-10 gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
