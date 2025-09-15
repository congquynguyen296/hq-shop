import Product, { IProduct } from "../models/Product";

export async function listProducts(params: { page?: number; limit?: number }) {
  const page = Number(params.page || 1);
  const limit = Number(params.limit || 12);
  const skip = (page - 1) * limit;

  const [products, totalCount] = await Promise.all([
    Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(),
  ]);

  return {
    products,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      hasNextPage: page * limit < totalCount,
      hasPrevPage: page > 1,
      limit,
    },
  };
}

export async function getProductByBusinessId(id: string) {
  const product = await Product.findOneAndUpdate(
    { id },
    { $inc: { views: 1 } },
    { new: true }
  );
  return product;
}

export async function createNewProduct(productData: Partial<IProduct>) {
  const data: any = { ...productData };
  if (!data.id) {
    const count = await Product.countDocuments();
    data.id = `PROD-${String(count + 1).padStart(4, "0")}`;
  }

  const searchKeywords: string[] = [];
  if (data.name) searchKeywords.push(...data.name.toLowerCase().split(" "));
  if (data.description)
    searchKeywords.push(...data.description.toLowerCase().split(" "));
  if (data.brand) searchKeywords.push(data.brand.toLowerCase());
  if (data.category) searchKeywords.push(data.category.toLowerCase());
  if (data.tags) searchKeywords.push(...data.tags.map((t: string) => t.toLowerCase()));
  data.searchKeywords = [...new Set(searchKeywords.filter((k) => k.trim()))];

  const product = new Product(data);
  await product.save();
  return product;
}

export async function updateExistingProduct(id: string, updateData: Partial<IProduct>) {
  const product = await Product.findOneAndUpdate({ id }, updateData, {
    new: true,
    runValidators: true,
  });
  return product;
}

export async function deleteByBusinessId(id: string) {
  const product = await Product.findOneAndDelete({ id });
  return product;
}

export async function listProductsByCategory(params: {
  category: string;
  page?: number;
  limit?: number;
}) {
  const page = Number(params.page || 1);
  const limit = Number(params.limit || 12);
  const skip = (page - 1) * limit;

  const [products, totalCount] = await Promise.all([
    Product.find({ category: params.category })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments({ category: params.category }),
  ]);

  return {
    products,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      hasNextPage: page * limit < totalCount,
      hasPrevPage: page > 1,
      limit,
    },
  };
}

export async function listBestSellers() {
  const products = await Product.find({ isBestSeller: true });
  return products;
}


