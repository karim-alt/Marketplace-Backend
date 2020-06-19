const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Review Schema
const Order = new Schema({
  productName: {
    type: String,
    required: true,
  },
  buyerName: {
    type: String,
    required: true,
  },
  buyerPhone: {
    type: String,
    required: true,
  },
  Qty: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },

  Products_Id: {
    type: Array,
  },
  Seller_Id: {
    type: String,
    required: true,
  },
  Buyer_Id: {
    type: String,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Order", Order);
