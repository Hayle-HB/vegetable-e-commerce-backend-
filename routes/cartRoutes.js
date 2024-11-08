const express = require("express");
const {
  getCartByUserId,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  getCartTotal,
  clearCart,
  checkoutCart,
} = require("../controllers/cartControllers.js");

const router = express.Router();

router.get("/", getCartByUserId);
router.post("/", addItemToCart);
router.put("/:productId", updateCartItem);
router.delete("/:productId", removeItemFromCart);
router.get("/total", getCartTotal);
router.delete("/", clearCart);
router.post("/checkout", checkoutCart);

module.exports = router;
