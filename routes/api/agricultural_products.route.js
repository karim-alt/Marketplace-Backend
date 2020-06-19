const express = require("express");
const router_Aproduct = express.Router();
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
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
    return callback(new Error("Only .png, .jpg and .jpeg format allowed!"));
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});
//load Services
const {
  find_Aproduct,
  create_Aproduct,
  update_Aproduct,
  delete_Aproduct,
  read_Aproducts,
  find_sellers_product,
  readProductCountry,
  updateRating
} = require("../../services/agricultural_product.service");

// get all Products
router_Aproduct.get("/", read_Aproducts);

// find Product by id
router_Aproduct.get("/:id", find_Aproduct);

// find Products by sellerID
router_Aproduct.get("/myStore/:id", find_sellers_product);

// find Products by Country
router_Aproduct.get("/country/:id", readProductCountry);

// add new Product
router_Aproduct.post("/add", upload.array("images"), create_Aproduct);

// update Product by id
router_Aproduct.post("/update/:id", upload.array("images"), update_Aproduct);

// update rating
router_Aproduct.post("/rating/:id", updateRating);

// delete Product by Id
router_Aproduct.delete("/delete/:id", delete_Aproduct);

module.exports = router_Aproduct;
