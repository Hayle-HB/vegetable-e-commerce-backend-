const router = require("express").Router();
const {
  createProduct,
  getProductById,
  getAllProducts,
  updateProductById,
  deleteProductById,
  filterProducts,
  searchProducts,
  getPopularProducts,
  csvProducts,
  test
} = require("../controllers/productControllers.js");
const upload = require("../utils/uploads.js");
router.get("/home", (req, res) => {
  res.send({ message: "HI THERE " });
});
// Create a new product
router.post("/products", createProduct);
router.get("/products/:id", getProductById);
router.get("/products", getAllProducts);
router.put("/products/:id", updateProductById);
router.delete("/products/:id", deleteProductById);
router.get("/products/filter", filterProducts);
router.get("/products/search", searchProducts);
router.get("/products/popular",  getPopularProducts);
router.post("/products/csv/uploads", upload.single('file') , csvProducts);
router.get('/test',test)
module.exports = router;
