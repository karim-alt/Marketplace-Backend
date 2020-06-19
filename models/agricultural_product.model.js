const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create agricultural products Schema
const Agricultural_product = new Schema({
  name: {
    type: String,
    required: [true, "product name is required"]
  },
  description: {
    type: String,
    trim: true
  },
  quantity: {
    type: String,
    required: [true, "Quantity is required"]
  },
  images: [
    {
      type: String
    }
  ],
  seller_id: {
    type: String,
    required: [true, "seller_id is required"]
  },
  country: {
    type: [],
    required: [true, "country is required"]
  },
  prix: {
    type: Number,
    required: true
  },
  rating: {
    type: Array
  },
  availability_date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Agricultural_product", Agricultural_product);
