const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Review Schema
const Review = new Schema({
  comment: {
    type: String,
    trim: true
  },
  rating: {
    type: Number
  },
  product_id: {
    type: String,
    required: true
  },
  Date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Review", Review);
