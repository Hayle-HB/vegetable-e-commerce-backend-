const Cart = require("../models/Cart.js");
const Product = require("../models/Products.js");

const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the cart for the specific user
    const cart = await Cart.findOne({ userId })
      .populate("items.productId", "name price")
      .exec();

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user." });
    }

    cart.calculateTotals();
    res.status(200).json({
      userId: cart.userId,
      items: cart.items,
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
      totalDiscount: cart.totalDiscount,
      isPaid: cart.isPaid,
      paymentMethod: cart.paymentMethod,
      status: cart.status,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error while fetching cart." });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    // Find the product details from the Product model
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Check if the quantity is valid
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1." });
    }

    // Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if the product already exists in the cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      // Update quantity if the product is already in the cart
      existingItem.quantity += quantity;
    } else {
      // Add new item to the cart
      cart.items.push({
        productId,
        quantity,
        price: product.price,
        discount: product.discount,
        finalPrice: product.price * ((100 - product.discount) / 100),
      });
    }

    cart.calculateTotals();

    await cart.save();

    res.status(200).json({
      message: "Item added to cart successfully.",
      cart,
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res
      .status(500)
      .json({ message: "Server error while adding item to cart." });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity, price, discount } = req.body;

    // Ensure quantity is provided and is valid
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1." });
    }

    // Find the user's active cart
    const cart = await Cart.findOne({ userId, status: "Active" });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Active cart not found for the user." });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in the cart." });
    }

    // Update the item's details
    const item = cart.items[itemIndex];
    item.quantity = quantity;
    if (price) item.price = price;
    if (discount) item.discount = discount;

    // Calculate the final price for this item
    item.finalPrice =
      item.price * item.quantity * ((100 - item.discount) / 100);

    // Recalculate the cart totals
    cart.calculateTotals();

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      message: "Cart item updated successfully.",
      cart,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Server error while updating cart item." });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Check if the item exists in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Recalculate totals after removing the item
    cart.calculateTotals();

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      message: "Item removed from cart successfully.",
      cart,
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res
      .status(500)
      .json({ message: "Server error while removing item from cart." });
  }
};

const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Clear all items from the cart
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    cart.totalDiscount = 0;

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully." });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Server error while clearing cart." });
  }
};

const checkoutCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { paymentMethod } = req.body;

    // Find the user's cart
    const cart = await Cart.findOne({ userId, status: "Active" });
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Cart is empty or not found." });
    }

    // Ensure the cart has a payment method if it is a paid order
    if (!paymentMethod) {
      return res
        .status(400)
        .json({ message: "Payment method is required for checkout." });
    }

    // Calculate totals if they haven't been calculated
    cart.calculateTotals();

    // Update the cart status and payment details
    cart.isPaid = true;
    cart.paymentMethod = paymentMethod;
    cart.status = "Ordered";
    cart.updatedAt = Date.now();

    // Save the changes
    await cart.save();

    res.status(200).json({
      message: "Checkout successful. Your order has been placed.",
      cart: {
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
        totalDiscount: cart.totalDiscount,
        items: cart.items,
        paymentMethod: cart.paymentMethod,
        status: cart.status,
      },
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ message: "Server error during checkout." });
  }
};


const getCartTotal = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user's active cart
    const cart = await Cart.findOne({ userId, status: "Active" });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Active cart not found for the user." });
    }

    // Calculate the cart totals using the method from the cart schema
    cart.calculateTotals();

    // Respond with the total price and other relevant data
    res.status(200).json({
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
      totalDiscount: cart.totalDiscount,
      message: "Cart totals fetched successfully.",
    });
  } catch (error) {
    console.error("Error fetching cart totals:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching cart totals." });
  }
};


module.exports = {
  getCartByUserId,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  getCartTotal,
  clearCart,
  checkoutCart,
};
