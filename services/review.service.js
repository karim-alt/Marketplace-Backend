const Reviews = require("../models/review.model");

let create_Review = (req, res) => {
  let Review = new Reviews(req.body);
  Review.save()
    .then(Review => {
      res.status(200).json({ Review: "Review added successfully" });
    })
    .catch(err => {
      res.status(400).send("adding new Review failed :" + err);
    });
};
//sort({date: 'desc'})
let read_Reviews = (req, res) => {
  Reviews.find((err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.json(results);
    }
  });
};

let update_Review = (req, res) => {
  Reviews.findById(req.params.id, (err, Review) => {
    if (!Review) res.status(404).send("Review not found");
    else {
      Review.comment = req.body.comment;
      Review.rating = req.body.rating;
      Review.product_id = req.body.product_id;
      Review.Date = Date.now();
    }
    Review.save()
      .then(todo => {
        res.json("Review updated!");
      })
      .catch(err => {
        res.status(400).send("Update is not possible " + err);
      });
  });
};

let delete_Review = (req, res) => {
  Reviews.findByIdAndRemove(req.params.id, err => {
    if (err) return next(err);
    res.send("Review deleted successfully!");
  });
};

module.exports = {
  create_Review,
  read_Reviews,
  update_Review,
  delete_Review
};
