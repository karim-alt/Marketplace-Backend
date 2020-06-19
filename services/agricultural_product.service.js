const Agricultural_product = require("../models/agricultural_product.model");
fs = require("fs");

let create_Aproduct = (req, res) => {
  // console.log(req.files);
  imgs = [];
  req.files.forEach(function (i) {
    imgs.push(i.filename);
    // console.log(i.filename);
  });
  let agricultural_product = new Agricultural_product({
    name: req.body.name,
    description: req.body.description,
    quantity: req.body.quantity,
    images: imgs,
    country: req.body.country,
    prix: req.body.prix,
    seller_id: req.body.seller_id,
  });
  agricultural_product
    .save()
    .then((agricultural_product) => {
      res
        .status(200)
        .json({ agricultural_product: "Product added successfully" });
    })
    .catch((err) => {
      res.status(400).send("adding new product failed :" + err);
    });
};

let update_Aproduct = (req, res) => {
  Agricultural_product.findById(req.params.id, (err, Agricultural_product) => {
    if (!Agricultural_product) res.status(404).send("Product not found");
    else {
      // console.log(req.files);
      imgs = [];
      req.files.forEach(function (i) {
        imgs.push(i.filename);
        // console.log(i.filename);
      });
      if (imgs.length !== 0) {
        if (Agricultural_product.images !== 0) {
          for (var x = 0; x < Agricultural_product.images.length; x++) {
            fs.unlink("./uploads/" + Agricultural_product.images[x], function (
              err
            ) {
              if (err) console.log(err);
            });
          }
        }
        Agricultural_product.images = imgs;
      }
      Agricultural_product.name = req.body.name;
      if (req.body.description !== null)
        Agricultural_product.description = req.body.description;
      Agricultural_product.quantity = req.body.quantity;
      Agricultural_product.country = req.body.country;
      Agricultural_product.prix = req.body.prix;
    }
    Agricultural_product.save()
      .then((todo) => {
        res.json("product updated!");
      })
      .catch((err) => {
        res.status(400).send("Update is not possible " + err);
      });
  });
};

let updateRating = (req, res) => {
  Agricultural_product.findById(req.params.id, (err, Agricultural_product) => {
    if (!Agricultural_product) res.status(404).send("product not found");
    else {
      Agricultural_product.rating.push(req.body.rating);
    }
    Agricultural_product.save()
      .then((todo) => {
        res.json("rating updated!");
      })
      .catch((err) => {
        res.status(400).send("Update is not possible " + err);
      });
  });
};

let read_Aproducts = (req, res) => {
  Agricultural_product.find((err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.json(results);
    }
  }).sort({ _id: -1 });
};

let find_Aproduct = (req, res) => {
  // let id = req.params.id;
  Agricultural_product.findById(req.params.id, (err, Agricultural_product) => {
    if (err) {
      res.send("an error has occured " + err);
    } else if (!Agricultural_product) res.status(404).send("Product not found");
    else res.json(Agricultural_product);
  });
};

let find_sellers_product = (req, res) => {
  let sellerId = req.params.id;
  Agricultural_product.find(
    { seller_id: sellerId },
    (err, Agricultural_product) => {
      if (err) {
        res.send("an error has occured " + err);
      } else if (!Agricultural_product)
        res.status(404).send("Product not found");
      else res.json(Agricultural_product);
    }
  ).sort({ _id: -1 });
};

let readProductCountry = (req, res) => {
  let ctr = req.params.id;
  Agricultural_product.find(
    { country: { $in: [ctr] } },
    (err, Agricultural_product) => {
      if (err) {
        res.send("an error has occured " + err);
      } else if (!Agricultural_product)
        res.status(404).send("Product not found");
      else res.json(Agricultural_product);
    }
  ).sort({ _id: -1 });
};

let delete_Aproduct = (req, res) => {
  Agricultural_product.findByIdAndRemove(
    req.params.id,
    (err, Agricultural_product) => {
      if (err) return next(err);
      if (Agricultural_product.images !== 0) {
        for (var x = 0; x < Agricultural_product.images.length; x++) {
          fs.unlink("./uploads/" + Agricultural_product.images[x], function (
            err
          ) {
            if (err) console.log(err);
          });
        }
      }
      res.send("Product deleted successfully!");
    }
  );
};

module.exports = {
  find_Aproduct,
  create_Aproduct,
  update_Aproduct,
  delete_Aproduct,
  read_Aproducts,
  readProductCountry,
  updateRating,
  find_sellers_product,
};
