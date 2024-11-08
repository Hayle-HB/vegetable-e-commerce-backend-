const mongoose = require("mongoose");

const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
  },
  name: {
    type: String,
    trim: true,
  },
  subscriptionDate: {
    type: Date,
    default: Date.now,
  },
  preferences: {
    type: [String],
    enum: ["vegetable news", "discount offers", "recipes", "new arrivals"],
    default: ["vegetable news"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Subscriber = mongoose.model("Subscriber", SubscriberSchema);

module.exports = Subscriber;
