const express = require("express");
const router_Fproduct = express.Router();
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
const fileFilter = (req, file, callback) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/gif" ||
    file.mimetype == "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
    return callback(
      new Error("Only .png, .jpg and .jpeg .gif format allowed!")
    );
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});
//load Services
const {
  find_product,
  create_Fproduct,
  update_Fproduct,
  delete_Fproduct,
  read_Fproducts,
  find_sellers_product,
  readProductCountry,
  updateRating,
} = require("../../services/fertilized_products.service");

const { optimize } = require("../../services/recommandation.service");
// get all Products
router_Fproduct.get("/", read_Fproducts);

// find Product by id
router_Fproduct.get("/:id", find_product);

// find Product by id
router_Fproduct.get("/myStore/:id", find_sellers_product);

// find Products by Country
router_Fproduct.get("/country/:id", readProductCountry);

// add new Product
router_Fproduct.post("/add", upload.array("images"), create_Fproduct);

// update Product by id
router_Fproduct.post("/update/:id", upload.array("images"), update_Fproduct);

// update rating
router_Fproduct.post("/rating/:id", updateRating);

// delete Product by Id
router_Fproduct.delete("/delete/:id", delete_Fproduct);

module.exports = router_Fproduct;
