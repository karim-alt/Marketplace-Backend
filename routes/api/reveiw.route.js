const express = require("express");
const router_Review = express.Router();

//load Services
const {
  create_Review,
  read_Reviews,
  update_Review,
  delete_Review
} = require("../../services/review.service");

// get all Products
router_Review.get("/", read_Reviews);

// add new Product
router_Review.post("/add", create_Review);

// update Product by id
router_Review.post("/update/:id", update_Review);

// delete Product by Id
router_Review.delete("/delete/:id", delete_Review);

module.exports = router_Review;
