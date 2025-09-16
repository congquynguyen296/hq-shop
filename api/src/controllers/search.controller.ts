import { Request, Response } from "express";
import Product, { IProduct } from "../models/Product";
import {
  getFilterOptionsService,
  getPopularService,
  getSuggestionsService,
  searchProductsService,
  searchWithElasticsearch,
} from "../services/search.service";
import esClient from "../config/elastic";

// Interface for search filters
interface SearchFilters {
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
  sortBy?:
    | "price"
    | "rating"
    | "views"
    | "sold"
    | "discount"
    | "createdAt"
    | "relevance";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Advanced search with fuzzy search and multiple filters
export const searchProducts = async (req: Request, res: Response) => {
  const {
    query: textQuery,
    q,
    page = 1,
    limit = 12,
    sortBy = "relevance",
    sortOrder = "desc",
  } = req.query as any;

  // If no params at all
  if (!req.query) {
    return res.status(200).json({
      success: true,
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: Number(limit),
      },
    });
  }

  // Prefer ES only when there is an actual text query
  const searchText = (textQuery || q || "").toString().trim();

  if (searchText.length > 0) {
    try {
      const esResult = await searchWithElasticsearch(searchText, {
        ...req.query,
        sortBy,
        sortOrder,
        page,
        limit,
      });

      return res.status(200).json({
        ...esResult,
        filters: req.query,
        sort: { by: sortBy, order: sortOrder },
      });
    } catch (error) {
      // Fall through to Mongo service on ES error
      console.error("Elasticsearch error, falling back to MongoDB:", error);
    }
  }

  // Fallback: MongoDB service with full filtering and pagination
  const result = await searchProductsService(req.query as any);
  return res.status(200).json({
    success: true,
    data: result.products,
    pagination: result.pagination,
    filters: req.query,
    sort: {
      by: (req.query as any).sortBy || "relevance",
      order: (req.query as any).sortOrder || "desc",
    },
  });
};

// Get search suggestions/autocomplete
export const getSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query || query.toString().trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Query must be at least 2 characters long",
      });
    }

    const searchQuery = query.toString().trim();

    const result = await getSuggestionsService(searchQuery, Number(limit));
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting search suggestions",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get popular search terms
export const getPopularSearches = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    const data = await getPopularService(Number(limit));
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting popular searches",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get filter options for search
export const getFilterOptions = async (req: Request, res: Response) => {
  try {
    const data = await getFilterOptionsService();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting filter options",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
