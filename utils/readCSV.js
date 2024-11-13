
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const readCSV = async (file) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, "../uploads", file.filename); 

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

module.exports = readCSV;



// const fs = require("fs");
// const path = require("path");
// const csv = require("csv-parser");

// const readCSV = async (file) => {
//   return new Promise((resolve, reject) => {
//     const results = [];
//     const filePath = path.join(__dirname, "uploads", file.filename);

//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", (data) => {
//         const product = {
//           name: data.name,
//           description: data.description,
//           category: data.category,
//           subcategory: data.subcategory,
//           price: parseFloat(data.price),
//           discount: parseInt(data.discount, 10),
//           stock: parseInt(data.stock, 10),
//           unit: data.unit,
//           images: [
//             {
//               url: data.image_url,
//               alt: data.image_alt,
//             },
//           ],
//           isSeasonal: data.isSeasonal.toLowerCase() === "true",
//           season: data.season,
//           nutrition: {
//             calories: parseInt(data.calories, 10),
//             protein: parseInt(data.protein, 10),
//             carbs: parseInt(data.carbs, 10),
//             fats: parseInt(data.fats, 10),
//             fiber: parseInt(data.fiber, 10),
//           },
//           supplier: {
//             name: data.supplier_name,
//             contact: data.supplier_contact,
//             location: data.supplier_location,
//           },
//         };

//         results.push(product);
//       })
//       .on("end", () => {
//         resolve(results);
//       })
//       .on("error", (err) => {
//         reject(err);
//       });
//   });
// };

// module.exports = readCSV;
