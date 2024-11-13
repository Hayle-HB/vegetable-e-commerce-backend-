const mongoose = require('mongoose');


const TestSchema = mongoose.Schema({
  name: String,
  age: Number,
  country: String,
  roll: String
})


const Test = mongoose.model('Test', TestSchema);
module.exports = Test