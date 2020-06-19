const express = require("express");
const router = express.Router();

const {
  scrapFertilisez,
  scrapAgricultural,
} = require("../../services/salesScraping.service");

// @route POST api/scraping/sales
// @desc salesScraping
// @access Public
router.get("/sales", scrapFertilisez);
router.get("/agrisales", scrapAgricultural);

module.exports = router;
