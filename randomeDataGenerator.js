const fs = require("fs");
const path = require("path");

const categories = [
  "Leafy Greens",
  "Root Vegetables",
  "Fruits",
  "Herbs",
  "Legumes",
  "Others",
];

const subcategories = ["General", "Organic", "Fresh", "Frozen", "Dried"];

const generateRandomProduct = () => {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const subcategory =
    subcategories[Math.floor(Math.random() * subcategories.length)];

  return {
    name: `Product ${Math.floor(Math.random() * 10000)}`,
    description: "This is a description of the product.",
    category: category,
    subcategory: subcategory,
    price: (Math.random() * 100).toFixed(2),
    discount: Math.floor(Math.random() * 30), // Percentage discount
    stock: Math.floor(Math.random() * 100),
    unit: ["kg", "grams", "pieces", "bundle"][Math.floor(Math.random() * 4)],
    images: [
      {
        url: "http://example.com/image.jpg",
        alt: "Product Image",
      },
    ],
    isSeasonal: Math.random() > 0.5, // Randomly true or false
    season: Math.random() > 0.5 ? ["Spring", "Summer", "Autumn", "Winter"] : "",
    nutrition: {
      calories: Math.floor(Math.random() * 500),
      protein: Math.floor(Math.random() * 50),
      carbs: Math.floor(Math.random() * 100),
      fats: Math.floor(Math.random() * 50),
      fiber: Math.floor(Math.random() * 30),
    },
    supplier: {
      name: "Supplier Name",
      contact: "+1234567890",
      location: "Supplier Location",
    },
    ratings: [
      {
        userId: "1234567890",
        rating: Math.floor(Math.random() * 5) + 1, // Rating between 1 and 5
        comment: "This is a review comment.",
      },
    ],
    averageRating: Math.floor(Math.random() * 5) + 1,
    organic: Math.random() > 0.5,
    isPopular: Math.random() > 0.5,
    addedDate: new Date().toISOString(),
    expiryDate: new Date(
      new Date().getTime() + 1000 * 60 * 60 * 24 * 30
    ).toISOString(), // 30 days expiry
  };
};

const generateCSV = (numRows) => {
  const header =
    "name,description,category,subcategory,price,discount,stock,unit,images_url,images_alt,isSeasonal,season,nutrition_calories,nutrition_protein,nutrition_carbs,nutrition_fats,nutrition_fiber,supplier_name,supplier_contact,supplier_location,ratings_userId,ratings_rating,ratings_comment,averageRating,organic,isPopular,addedDate,expiryDate";
  const rows = [header];

  for (let i = 0; i < numRows; i++) {
    const product = generateRandomProduct();
    const row = [
      product.name,
      product.description,
      product.category,
      product.subcategory,
      product.price,
      product.discount,
      product.stock,
      product.unit,
      product.images[0].url,
      product.images[0].alt,
      product.isSeasonal,
      product.season || "",
      product.nutrition.calories,
      product.nutrition.protein,
      product.nutrition.carbs,
      product.nutrition.fats,
      product.nutrition.fiber,
      product.supplier.name,
      product.supplier.contact,
      product.supplier.location,
      product.ratings[0].userId,
      product.ratings[0].rating,
      product.ratings[0].comment,
      product.averageRating,
      product.organic,
      product.isPopular,
      product.addedDate,
      product.expiryDate || "",
    ].join(",");
    rows.push(row);
  }

  fs.writeFileSync(path.join(__dirname, "products.csv"), rows.join("\n"));
};

// Generate 1000 rows for testing
generateCSV(1000);
