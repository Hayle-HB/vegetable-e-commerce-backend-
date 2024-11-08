const Subscriber = require("../models/Subscriber.js");

// Get all subscribers
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.status(200).json(subscribers);
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching subscribers." });
  }
};

// Get a subscriber by ID
const getSubscriberByID = async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found." });
    }
    res.status(200).json(subscriber);
  } catch (error) {
    console.error("Error fetching subscriber by ID:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching subscriber." });
  }
};

// Register a new subscriber
const subscriberRegister = async (req, res) => {
  const { email, name, preferences } = req.body;

  try {
    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res
        .status(409)
        .json({ message: "Subscriber with this email already exists." });
    }

    const newSubscriber = new Subscriber({ email, name, preferences });
    await newSubscriber.save();

    res
      .status(201)
      .json({
        message: "Subscriber registered successfully.",
        subscriber: newSubscriber,
      });
  } catch (error) {
    console.error("Error registering subscriber:", error);
    res
      .status(500)
      .json({ message: "Server error while registering subscriber." });
  }
};

// Delete a subscriber by ID
const deleteSubscriber = async (req, res) => {
  try {
    const deletedSubscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!deletedSubscriber) {
      return res.status(404).json({ message: "Subscriber not found." });
    }
    res.status(200).json({ message: "Subscriber deleted successfully." });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    res
      .status(500)
      .json({ message: "Server error while deleting subscriber." });
  }
};

module.exports = {
  getSubscriberByID,
  getSubscribers,
  subscriberRegister,
  deleteSubscriber,
};
