import { Link } from "react-router-dom";

export default function CategoryCard({ title, description, resource, color }) {
  return (
    <Link to={`/products?category=${encodeURIComponent(title)}`} className={`p-[5px] rounded-lg cursor-pointer transition-colors duration-300 hover:opacity-90 bg-gradient-to-r ${color}`}>
      <div className="p-4 rounded-lg shadow max-w-80 bg-white">
        <img
          className="rounded-md max-h-40 w-1/4 object-cover"
          src={resource}
          alt={title}
        />

        <p className="text-gray-900 text-xl font-semibold ml-2 mt-2">{title}</p>

        <p className="text-gray-500 text-sm my-3 ml-2">{description}</p>
      </div>
    </Link>
  );
}
