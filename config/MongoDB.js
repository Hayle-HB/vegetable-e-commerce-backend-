module.exports = require("mongoose")
  .connect(process.env.Mongo_DB_Url)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log("Error in connecting MongoDB", err);
  });
