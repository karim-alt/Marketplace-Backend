const express = require("express");
const router = express.Router();
const {
  optimize,
  getRProduct,
} = require("../../services/recommandation.service");

//get recommandation
router.post("/:id", optimize);

//get recommanded product
router.post("/", getRProduct);

module.exports = router;
