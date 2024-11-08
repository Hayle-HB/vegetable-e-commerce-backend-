require("dotenv").config();
require("./config/MongoDB.js");
const express = require("express");
const app = express();

app.use(express.json());

const subscriberRoutes = require("./routes/subscriberRoutes.js");
const newsLetterRoutes = require("./routes/newsLetterRoutes.js");
const productRoutes = require("./routes/ProductRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
// Routes
app.use("/api", subscriberRoutes);
app.use("/api", newsLetterRoutes);
app.use("/api", productRoutes);
app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
