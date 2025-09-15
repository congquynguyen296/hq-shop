import { Request, Response } from "express";
import Category from "../models/Category";

export const listCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ title: 1 });
    res.status(200).json({ success: true, data: categories, count: categories.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching categories", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const { title } = req.params;
    const category = await Category.findOne({ title });
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching category", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const upsertCategory = async (req: Request, res: Response) => {
  try {
    const { title, description, color, resource } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Title is required" });
    const category = await Category.findOneAndUpdate(
      { title },
      { title, description, color, resource },
      { upsert: true, new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error upserting category", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { title } = req.params;
    const deleted = await Category.findOneAndDelete({ title });
    if (!deleted) return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting category", error: error instanceof Error ? error.message : "Unknown error" });
  }
};


