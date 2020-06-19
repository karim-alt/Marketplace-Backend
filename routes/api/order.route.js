const express = require("express");
const router_Order = express.Router();

//load Services
const {
  create_Order,
  read_Orders,
  update_Order,
  delete_Order,
  find_Oeder,
  find_sellers_orders,
  sendEmail,
} = require("../../services/order.service");

// get all Products
router_Order.get("/", read_Orders);

// find Product by id
router_Order.get("/:id", find_Oeder);

// find user's order
router_Order.get("/myOrders/:id", find_sellers_orders);

// add new Product
router_Order.post("/add", create_Order);

// update Product by id
router_Order.post("/update/:id", update_Order);

// delete Product by Id
router_Order.delete("/delete/:id", delete_Order);

//send mail
router_Order.post("/send", sendEmail);

module.exports = router_Order;
