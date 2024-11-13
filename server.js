require("dotenv").config();
require("./config/MongoDB.js");
const express = require("express");
const app = express();
const cors = require('cors')
app.use(express.json());
app.use(cors())
const subscriberRoutes = require("./routes/subscriberRoutes.js");
const newsLetterRoutes = require("./routes/newsLetterRoutes.js");
const productRoutes = require("./routes/ProductRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const smsRoutes = require('./routes/smsRoutes.js')
// Routes
app.use("/api", subscriberRoutes);
app.use("/api", newsLetterRoutes);
app.use("/api", productRoutes);
app.use("/api/cart", cartRoutes);
app.use('/api', smsRoutes);
app.get('/', (req, res) => {
  res.send('Home page')
})



const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
