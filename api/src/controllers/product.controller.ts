import { Request, Response } from "express";
import { createNewProduct, deleteByBusinessId, getProductByBusinessId, listBestSellers, listProducts, listProductsByCategory, updateExistingProduct } from "../services/product.service";

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { products, pagination } = await listProducts({
      page: Number(req.query.page || 1),
      limit: Number(req.query.limit || 12),
    });
    res.status(200).json({ success: true, data: products, count: products.length, pagination });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProductByBusinessId(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Create new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await createNewProduct(req.body);
    res.status(201).json({ success: true, data: product, message: "Product created successfully" });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const product = await updateExistingProduct(id, updateData);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await deleteByBusinessId(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get products by category
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { products, pagination } = await listProductsByCategory({
      category,
      page: Number(req.query.page || 1),
      limit: Number(req.query.limit || 12),
    });
    res.status(200).json({ success: true, data: products, count: products.length, pagination });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products by category",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get best sellers
export const getBestSellers = async (req: Request, res: Response) => {
  try {
    const products = await listBestSellers();
    res.status(200).json({ success: true, data: products, count: products.length });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching best sellers",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
