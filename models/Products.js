const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Leafy Greens",
        "Root Vegetables",
        "Fruits",
        "Herbs",
        "Legumes",
        "Others",
      ],
    },

    subcategory: {
      type: String,
      default: "General",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0, // Percentage discount (e.g., 15 for 15% off)
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "grams", "pieces", "bundle"],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: "Vegetable product image",
        },
      },
    ],
    isSeasonal: {
      type: Boolean,
      default: false,
    },
    season: {
      type: String,
      enum: ["Spring", "Summer", "Autumn", "Winter"],
      required: function () {
        return this.isSeasonal;
      },
    },
    nutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 }, 
      carbs: { type: Number, default: 0 },
      fats: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
    },
    supplier: {
      name: { type: String, required: true },
      contact: { type: String, required: true },
      location: { type: String, required: true },
    },
    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    organic: {
      type: Boolean,
      default: false,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    addedDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);


productSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0);
    this.averageRating = (sum / this.ratings.length).toFixed(1);
  } else {
    this.averageRating = 0;
  }
  return this.averageRating;
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
