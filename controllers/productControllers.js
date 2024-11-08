const Product = require("../models/Products.js");
const createProduct = async (req, res) => {
  const {
    name,
    description,
    category,
    subcategory,
    price,
    discount,
    stock,
    unit,
    images,
    isSeasonal,
    season,
    nutrition,
    supplier,
    ratings,
    organic,
    isPopular,
    addedDate,
    expiryDate,
  } = req.body;

  if (
    !name ||
    !description ||
    !category ||
    !price ||
    !stock ||
    !unit ||
    !supplier?.name ||
    !supplier?.contact ||
    !supplier?.location
  ) {
    return res.status(400).json({
      message:
        "Name, description, category, price, stock, unit, and supplier information are required.",
    });
  }

  try {
    const newProduct = new Product({
      name,
      description,
      category,
      subcategory: subcategory || "General",
      price,
      discount: discount || 0,
      stock,
      unit,
      images,
      isSeasonal: isSeasonal || false,
      season: isSeasonal ? season : null,
      nutrition: {
        calories: nutrition?.calories || 0,
        protein: nutrition?.protein || 0,
        carbs: nutrition?.carbs || 0,
        fats: nutrition?.fats || 0,
        fiber: nutrition?.fiber || 0,
      },
      supplier,
      ratings: ratings || [],
      organic: organic || false,
      isPopular: isPopular || false,
      addedDate: addedDate || Date.now(),
      expiryDate,
    });

    newProduct.calculateAverageRating();

    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "An error occurred while creating the product.",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({
      message: "Error occurred while fetching product",
      error: err.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    subcategory,
    minPrice,
    maxPrice,
  } = req.query;

  try {
    const filter = {};
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    const totalCount = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ addedDate: -1 });

    res.status(200).json({
      products,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({
      message: "Error occurred while fetching products",
      error: err.message,
    });
  }
};

const updateProductById = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({
      message: "Error occurred while updating the product",
      error: err.message,
    });
  }
};

const deleteProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({
      message: "Error occurred while deleting the product",
      error: err.message,
    });
  }
};

const filterProducts = async (req, res) => {
  const { category, minPrice, maxPrice, organic, isSeasonal, minRating } =
    req.query;

  // Build a dynamic query object based on the provided filters
  let filterCriteria = {};

  if (category) filterCriteria.category = category;
  if (organic !== undefined) filterCriteria.organic = organic === "true";
  if (isSeasonal !== undefined)
    filterCriteria.isSeasonal = isSeasonal === "true";
  if (minRating) filterCriteria.averageRating = { $gte: Number(minRating) };
  if (minPrice || maxPrice) {
    filterCriteria.price = {};
    if (minPrice) filterCriteria.price.$gte = Number(minPrice);
    if (maxPrice) filterCriteria.price.$lte = Number(maxPrice);
  }

  try {
    // Query the database with the filter criteria
    const products = await Product.find(filterCriteria);

    // Respond with the filtered products
    res.status(200).json({
      message: "Filtered products retrieved successfully",
      products,
    });
  } catch (err) {
    console.error("Error filtering products:", err);
    res.status(500).json({
      message: "Error occurred while filtering products",
      error: err.message,
    });
  }
};

const searchProducts = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Search query is required." });
  }

  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({
      message: "Products found based on search query",
      products,
    });
  } catch (err) {
    console.error("Error searching for products:", err);
    res.status(500).json({
      message: "Error occurred while searching for products",
      error: err.message,
    });
  }
};

const getPopularProducts = async (req, res) => {
  try {
    const products = await Product.find({ isPopular: true }).sort({
      averageRating: -1,
    });

    res.status(200).json({
      message: "Popular products retrieved successfully",
      products,
    });
  } catch (err) {
    console.error("Error fetching popular products:", err);
    res.status(500).json({
      message: "Error occurred while retrieving popular products",
      error: err.message,
    });
  }
};

module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
  updateProductById,
  deleteProductById,
  filterProducts,
  searchProducts,
  getPopularProducts,
};
