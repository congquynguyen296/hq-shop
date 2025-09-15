import React, { useState, useEffect } from "react";
import { apiGet } from "../hooks/useApi";
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";

const ProductSidebar = ({ isOpen, onClose, onFilterChange, externalFilters }) => {
    const [expandedSections, setExpandedSections] = useState({
        search: true,
        category: true,
        price: true,
        rating: true,
        brand: true
    });

    const [filters, setFilters] = useState({
        search: "",
        category: "All",
        priceRange: [0, 3000],
        rating: [],
        brand: []
    });

    const [categories, setCategories] = useState(["All"]);

    // Sync with external filters from parent
    useEffect(() => {
        if (externalFilters) {
            setFilters((prev) => ({
                ...prev,
                ...externalFilters,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [externalFilters?.category, externalFilters?.priceRange, externalFilters?.rating, externalFilters?.brand, externalFilters?.search]);

    // Load categories from API
    useEffect(() => {
        apiGet('/api/search/filters')
            .then((res) => {
                const list = res?.data?.categories || [];
                setCategories(["All", ...list]);
            })
            .catch(() => setCategories(["All"]));
    }, []);
    const brands = ["Apple", "Samsung", "Sony", "Dell", "HP", "Lenovo", "Asus", "Microsoft"];
    const ratings = [4, 3, 2, 1];

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handlePriceChange = (index, value) => {
        const newPriceRange = [...filters.priceRange];
        newPriceRange[index] = parseInt(value);
        handleFilterChange('priceRange', newPriceRange);
    };

    const handleRatingChange = (rating) => {
        const newRatings = filters.rating.includes(rating)
            ? filters.rating.filter(r => r !== rating)
            : [...filters.rating, rating];
        handleFilterChange('rating', newRatings);
    };

    const handleBrandChange = (brand) => {
        const newBrands = filters.brand.includes(brand)
            ? filters.brand.filter(b => b !== brand)
            : [...filters.brand, brand];
        handleFilterChange('brand', newBrands);
    };

    const clearAllFilters = () => {
        const clearedFilters = {
            search: "",
            category: "All",
            priceRange: [0, 3000],
            rating: [],
            brand: []
        };
        setFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    const FilterSection = ({ title, sectionKey, children }) => (
        <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
            <button
                onClick={() => toggleSection(sectionKey)}
                className="flex items-center justify-between w-full text-left font-semibold text-slate-900 dark:text-white mb-3"
            >
                <span>{title}</span>
                {expandedSections[sectionKey] ? (
                    <ChevronUp size={16} className="text-slate-500" />
                ) : (
                    <ChevronDown size={16} className="text-slate-500" />
                )}
            </button>
            {expandedSections[sectionKey] && children}
        </div>
    );

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:relative lg:translate-x-0 z-50 lg:z-auto
                top-0 left-0 h-full w-80 max-w-[90vw]
                bg-white dark:bg-slate-800 shadow-xl lg:shadow-none
                border-r border-slate-200 dark:border-slate-700
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 h-full overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Filter size={20} className="text-purple-600" />
                            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Filters</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={clearAllFilters}
                                className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={onClose}
                                className="lg:hidden p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <FilterSection title="Search" sectionKey="search">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search coming soon..."
                                value={filters.search}
                                readOnly
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none"
                            />
                        </div>
                    </FilterSection>

                    {/* Categories */}
                    <FilterSection title="Categories" sectionKey="category">
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <label key={category} className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="category"
                                        value={category}
                                        checked={filters.category === category}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        className="mr-3 text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{category}</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Price Range */}
                    <FilterSection title="Price Range" sectionKey="price">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.priceRange[0]}
                                    onChange={(e) => handlePriceChange(0, e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <span className="text-slate-500">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => handlePriceChange(1, e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type="range"
                                    min="0"
                                    max="3000"
                                    step="50"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => handlePriceChange(1, e.target.value)}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>$0</span>
                                    <span>${filters.priceRange[1]}</span>
                                </div>
                            </div>
                        </div>
                    </FilterSection>

                    {/* Rating */}
                    <FilterSection title="Rating" sectionKey="rating">
                        <div className="space-y-2">
                            {ratings.map((rating) => (
                                <label key={rating} className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.rating.includes(rating)}
                                        onChange={() => handleRatingChange(rating)}
                                        className="mr-3 text-purple-600 focus:ring-purple-500"
                                    />
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                width="14"
                                                height="13"
                                                viewBox="0 0 18 17"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
                                                    fill={i < rating ? "#615fff" : "#e5e7eb"}
                                                />
                                            </svg>
                                        ))}
                                        <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">& up</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Brands */}
                    <FilterSection title="Brands" sectionKey="brand">
                        <div className="space-y-2">
                            {brands.map((brand) => (
                                <label key={brand} className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.brand.includes(brand)}
                                        onChange={() => handleBrandChange(brand)}
                                        className="mr-3 text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{brand}</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>
                </div>
            </div>
        </>
    );
};

export default ProductSidebar;
