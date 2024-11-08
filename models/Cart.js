const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          default: 0,
        },
        finalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    totalItems: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalDiscount: {
      type: Number,
      required: true,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    
    paymentMethod: {
      type: String,
      enum: [
        "Credit Card",
        "Debit Card",
        "Cash on Delivery",
        "PayPal",
        "Other",
      ],
      required: function () {
        return this.isPaid;
      },
    },
    status: {
      type: String,
      enum: ["Active", "Ordered", "Cancelled"],
      default: "Active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

cartSchema.methods.calculateTotals = function () {
  let totalItems = 0;
  let totalPrice = 0;
  let totalDiscount = 0;

  this.items.forEach((item) => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;
    totalDiscount += (item.price * item.discount * item.quantity) / 100;
    item.finalPrice =
      item.price * item.quantity * ((100 - item.discount) / 100);
  });

  this.totalItems = totalItems;
  this.totalPrice = totalPrice;
  this.totalDiscount = totalDiscount;
};

cartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
