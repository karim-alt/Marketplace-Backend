const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create bag_component Schema
// const bag_component = new Schema({
//   N: {
//     type: Number
//   },
//   P: {
//     type: Number
//   },
//   K: {
//     type: Number
//   },
//   M: {
//     type: Number
//   },
//   A: {
//     type: Number
//   },
//   D: {
//     type: Number
//   },
//   S: {
//     type: Number
//   }
// });

// Create Fertilized_product Schema
const Fertilized_product = new Schema({
  name: {
    type: String,
    required: [true, "product name is required"],
  },
  description: {
    type: String,
    trim: true,
  },
  bag_weight: {
    type: Number,
    required: [true, "Waight is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
  images: [
    {
      type: String,
    },
  ],
  seller_id: {
    type: String,
    required: [true, "seller_id is required"],
  },
  country: {
    type: [],
    required: [true, "country is required"],
  },
  prix: {
    type: Number,
    required: [true, "country is required"],
  },
  composition: {
    type: String,
    default: null,
  },
  N: {
    type: Number,
    default: 0,
  },
  P: {
    type: Number,
    default: 0,
  },
  K: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Array,
  },
});

module.exports = mongoose.model("Fertilized_product", Fertilized_product);
