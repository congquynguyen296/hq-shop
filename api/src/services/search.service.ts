import Product from "../models/Product";

export interface SearchFilters {
  query?: string;
  category?: string | string[];
  brand?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  maxDiscount?: number;
  minRating?: number;
  minViews?: number;
  minSold?: number;
  isBestSeller?: boolean;
  isNewProduct?: boolean;
  tags?: string | string[];
  sortBy?: "price" | "rating" | "views" | "sold" | "discount" | "createdAt" | "relevance";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export async function searchProductsService(filters: SearchFilters) {
  const {
    query,
    category,
    brand,
    minPrice,
    maxPrice,
    minDiscount,
    maxDiscount,
    minRating,
    minViews,
    minSold,
    isBestSeller,
    isNewProduct,
    tags,
    sortBy = "relevance",
    sortOrder = "desc",
    page = 1,
    limit = 12,
  } = filters;

  const filter: any = {};

  if (query && query.trim()) {
    filter.$text = { $search: query.trim() };
  }

  if (category) {
    filter.category = Array.isArray(category) ? { $in: category } : category;
  }
  if (brand) {
    filter.brand = Array.isArray(brand) ? { $in: brand } : brand;
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }
  if (minDiscount !== undefined || maxDiscount !== undefined) {
    filter.discount = {};
    if (minDiscount !== undefined) filter.discount.$gte = Number(minDiscount);
    if (maxDiscount !== undefined) filter.discount.$lte = Number(maxDiscount);
  }
  if (minRating !== undefined) {
    filter.rating = { $gte: Number(minRating) };
  }
  if (minViews !== undefined) {
    filter.views = { $gte: Number(minViews) };
  }
  if (minSold !== undefined) {
    filter.sold = { $gte: Number(minSold) };
  }
  if (isBestSeller !== undefined) {
    filter.isBestSeller = isBestSeller === true;
  }
  if (isNewProduct !== undefined) {
    filter.isNewProduct = isNewProduct === true;
  }
  if (tags) {
    filter.tags = Array.isArray(tags) ? { $in: tags } : { $in: [tags] };
  }

  let sort: any = {};
  if (sortBy === "relevance" && query) {
    sort = { score: { $meta: "textScore" } };
  } else {
    const sortField = sortBy === "createdAt" ? "createdAt" : sortBy;
    sort[sortField as string] = sortOrder === "asc" ? 1 : -1;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const limitNum = Number(limit);

  const pipeline: any[] = [{ $match: filter }];
  if (query && query.trim()) {
    pipeline.push({ $addFields: { score: { $meta: "textScore" } } });
  }
  pipeline.push({ $sort: sort });
  pipeline.push({ $skip: skip }, { $limit: limitNum });

  const products = await Product.aggregate(pipeline);
  const totalCount = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalCount / limitNum);

  return {
    products,
    pagination: {
      currentPage: Number(page),
      totalPages,
      totalCount,
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1,
      limit: limitNum,
    },
  };
}

export async function getSuggestionsService(searchQuery: string, limit = 10) {
  const suggestions = await Product.aggregate([
    {
      $match: {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { brand: { $regex: searchQuery, $options: "i" } },
          { category: { $regex: searchQuery, $options: "i" } },
          { tags: { $in: [new RegExp(searchQuery, "i")] } },
        ],
      },
    },
    { $project: { name: 1, brand: 1, category: 1, tags: 1, _id: 0 } },
    { $limit: Number(limit) },
  ]);

  const unique = new Set<string>();
  const result: any[] = [];
  suggestions.forEach((p) => {
    if (p.name && !unique.has(p.name)) {
      unique.add(p.name);
      result.push({ type: "product", value: p.name });
    }
    if (p.brand && !unique.has(p.brand)) {
      unique.add(p.brand);
      result.push({ type: "brand", value: p.brand });
    }
    if (p.category && !unique.has(p.category)) {
      unique.add(p.category);
      result.push({ type: "category", value: p.category });
    }
    if (p.tags) {
      p.tags.forEach((tag: string) => {
        if (tag && !unique.has(tag)) {
          unique.add(tag);
          result.push({ type: "tag", value: tag });
        }
      });
    }
  });

  return result.slice(0, Number(limit));
}

export async function getPopularService(limit = 10) {
  const popularCategories = await Product.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: Number(limit) },
    { $project: { category: "$_id", count: 1, _id: 0 } },
  ]);
  const popularBrands = await Product.aggregate([
    { $match: { brand: { $exists: true, $ne: null } } },
    { $group: { _id: "$brand", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: Number(limit) },
    { $project: { brand: "$_id", count: 1, _id: 0 } },
  ]);
  return { popularCategories, popularBrands };
}

export async function getFilterOptionsService() {
  const [categories, brands, priceRange, discountRange] = await Promise.all([
    Product.distinct("category"),
    Product.distinct("brand").then((brands) => brands.filter((b) => b)),
    Product.aggregate([{ $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } }]),
    Product.aggregate([{ $group: { _id: null, min: { $min: "$discount" }, max: { $max: "$discount" } } }]),
  ]);

  return {
    categories,
    brands,
    priceRange: priceRange[0] || { min: 0, max: 0 },
    discountRange: discountRange[0] || { min: 0, max: 0 },
  };
}


