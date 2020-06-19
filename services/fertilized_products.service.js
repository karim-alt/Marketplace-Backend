const Fertilized_product = require("../models/fertilized_product.model");
// const mongoose = require("mongoose");
fs = require("fs");
const isEmpty = require("is-empty");
let create_Fproduct = (req, res) => {
  imgs = [];
  req.files.forEach(function (i) {
    imgs.push(i.filename);
    // console.log(i.filename);
  });
  let fertilized_product = new Fertilized_product({
    name: req.body.name,
    description: req.body.description,
    quantity: req.body.quantity,
    bag_weight: req.body.bag_weight,
    images: imgs,
    country: req.body.country,
    prix: req.body.prix,
    seller_id: req.body.seller_id,
    composition: req.body.composition,
    N: req.body.N,
    P: req.body.P,
    K: req.body.K,
  });
  fertilized_product
    .save()
    .then((fertilized_product) => {
      res
        .status(200)
        .json({ fertilized_product: "Product added successfully" });
    })
    .catch((err) => {
      res.status(400).send("adding new product failed :" + err);
    });
};

let update_Fproduct = (req, res) => {
  Fertilized_product.findById(req.params.id, (err, Fertilized_product) => {
    if (!Fertilized_product) res.status(404).send("Product not found 0");
    else {
      // console.log(req.files);
      imgs = [];
      req.files.forEach(function (i) {
        imgs.push(i.filename);
        // console.log(i.filename);
      });
      if (imgs.length !== 0) {
        if (Fertilized_product.images !== 0) {
          for (var x = 0; x < Fertilized_product.images.length; x++) {
            fs.unlink("./uploads/" + Fertilized_product.images[x], function (
              err
            ) {
              if (err) console.log(err);
            });
          }
        }
        Fertilized_product.images = imgs;
      }
      Fertilized_product.name = req.body.name;
      if (req.body.description !== null)
        Fertilized_product.description = req.body.description;
      Fertilized_product.bag_weight = req.body.bag_weight;
      Fertilized_product.quantity = req.body.quantity;
      Fertilized_product.seller_id = req.body.seller_id;
      Fertilized_product.country = req.body.country;
      Fertilized_product.composition = req.body.composition;
      if (!isEmpty(req.body.N)) Fertilized_product.N = req.body.N;
      if (!isEmpty(req.body.P)) Fertilized_product.P = req.body.P;
      if (!isEmpty(req.body.K)) Fertilized_product.K = req.body.K;
      Fertilized_product.prix = req.body.prix;
    }
    Fertilized_product.save()
      .then((todo) => {
        res.json("product updated!");
      })
      .catch((err) => {
        res.status(400).send("Update is not possible " + err);
      });
  });
};

let updateRating = (req, res) => {
  Fertilized_product.findById(req.params.id, (err, Fertilized_product) => {
    if (!Fertilized_product) res.status(404).send("product not found 1");
    else {
      Fertilized_product.rating.push(req.body.rating);
    }
    Fertilized_product.save()
      .then((todo) => {
        res.json("rating updated!");
      })
      .catch((err) => {
        res.status(400).send("Update is not possible " + err);
      });
  });
};

let read_Fproducts = (req, res) => {
  Fertilized_product.find((err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.json(results);
    }
  }).sort({ _id: -1 });
};
// mongoose “Find” with multiple conditions
let find_product = (req, res) => {
  // let id = req.params.id;
  Fertilized_product.findById(req.params.id, (err, Fertilized_product) => {
    if (err) {
      res.send("an error has occured " + err);
    } else if (!Fertilized_product) res.status(404).send("Product not found 2");
    else res.json(Fertilized_product);
  });
};

let find_sellers_product = (req, res) => {
  let sellerId = req.params.id;
  Fertilized_product.find(
    { seller_id: sellerId },
    (err, Fertilized_product) => {
      if (err) {
        res.send("an error has occured " + err);
      } else if (!Fertilized_product)
        res.status(404).send("Product not found 3");
      else res.json(Fertilized_product);
    }
  ).sort({ _id: -1 });
};

let readProductCountry = (req, res) => {
  let ctr = req.params.id;
  Fertilized_product.find(
    { country: { $in: [ctr] } },
    (err, Fertilized_product) => {
      if (err) {
        res.send("an error has occured " + err);
      } else if (!Fertilized_product)
        res.status(404).send("Product not found 4");
      else res.json(Fertilized_product);
    }
  ).sort({ _id: -1 });
};

let delete_Fproduct = (req, res) => {
  Fertilized_product.findByIdAndRemove(
    req.params.id,
    (err, Fertilized_product) => {
      if (err) return next(err);
      if (Fertilized_product.images !== 0) {
        for (var x = 0; x < Fertilized_product.images.length; x++) {
          fs.unlink("./uploads/" + Fertilized_product.images[x], function (
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
  create_Fproduct,
  read_Fproducts,
  update_Fproduct,
  delete_Fproduct,
  find_product,
  find_sellers_product,
  updateRating,
  readProductCountry,
};
