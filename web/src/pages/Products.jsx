import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Filter, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../components/Cards/ProductCard";
import { apiGet } from "../hooks/useApi";
import ProductSidebar from "../sections/ProductSidebar";

export default function Products() {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    priceRange: [0, 3000],
    rating: [],
    brand: [],
  });

  // Server-side data and pagination (lazy load)
  const [items, setItems] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPage = async (page) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: 9,
        sortBy: sortBy === 'rating' ? 'rating' : sortBy === 'newest' ? 'createdAt' : 'relevance',
        sortOrder: 'desc',
      };
      // Use search API to support category and ranges
      const queryParams = { ...params };
      if (filters.category && filters.category !== 'All') queryParams.category = filters.category;
      if (filters.priceRange) {
        queryParams.minPrice = filters.priceRange[0];
        queryParams.maxPrice = filters.priceRange[1];
      }
      if (filters.rating?.length) queryParams.minRating = Math.min(...filters.rating);
      const res = await apiGet('/api/search', queryParams);
      const data = res.data || [];
      const pagination = res.pagination || { hasNextPage: false };
      if (page === 1) setItems(data);
      else setItems((prev) => [...prev, ...data]);
      setHasNextPage(!!pagination.hasNextPage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    const next = currentPage + 1;
    setCurrentPage(next);
    fetchPage(next);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Read category from query string
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
      setCurrentPage(1);
    }
  }, [location.search]);

  // Fetch when filters or sort change
  useEffect(() => {
    fetchPage(1);
  }, [filters, sortBy]);

  return (
    <>
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-20 bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[url('/assets/dark-hero-gradient.svg')] bg-no-repeat bg-cover">
        <h1 className="text-4xl md:text-5xl font-semibold max-w-2xl">
          Our{" "}
          <span className="bg-gradient-to-r from-[#923FEF] dark:from-[#C99DFF] to-[#C35DE8] dark:to-[#E1C9FF] bg-clip-text text-transparent">
            Products
          </span>
        </h1>
        <p className="text-base dark:text-slate-300 max-w-lg mt-4">
          Discover our wide range of high-quality electronic products. From
          laptops to smartphones, we have everything you need.
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <ProductSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onFilterChange={handleFilterChange}
            externalFilters={filters}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <Filter size={16} />
                Filters
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Showing {items.length} products
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>

                {/* View Mode */}
                <div className="flex border border-slate-300 dark:border-slate-600 rounded-md">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-purple-600 text-white"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-purple-600 text-white"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Discount */}
            <div className="flex items-center divide-x divide-gray-300 py-1 text-sm border-none rounded-full mb-6 mt-[-6]">
              <span className="pr-1 pl-3 text-lg">🔥</span>

              <span className="pl-2 pr-5 bg-gradient-to-r from-rose-500 to-indigo-500 font-medium bg-clip-text text-transparent">
                Landing shop gives you many vouchers up to 50% of product value.
                Get it now !!!
              </span>
            </div>

            {/* Products Grid */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* No Results */}
            {items.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                  No products found matching your criteria.
                </p>
                <button
                  onClick={() =>
                    handleFilterChange({
                      search: "",
                      category: "All",
                      priceRange: [0, 3000],
                      rating: [],
                      brand: [],
                    })
                  }
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Load More */}
            {hasNextPage && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 transition text-white rounded-md disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
