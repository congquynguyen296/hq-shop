import CategoryCard from "../components/Cards/CategoryCard";
import SectionTitle from "../components/Navs/SectionTitle";
import { categoriesBrand } from "../data/categoriesBrand";

export default function CategorySection() {
  return (
    <>
      <SectionTitle
        text1="Product Categories"
        text2="More Category For You"
        text3="Landing shop offers a large number of product categories with many different types. Diversity for customers to choose from."
      />

      <div className="flex flex-wrap items-center justify-center gap-10 mt-16">
        {categoriesBrand.map((category, index) => (
          <CategoryCard
            key={index}
            title={category.title}
            description={category.description}
            resource={category.resource}
            color={category.color}
          />
        ))}
      </div>
    </>
  );
}
