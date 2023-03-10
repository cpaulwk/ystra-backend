var express = require("express");
var router = express.Router();

const Product = require("../models/products");
const User = require("../models/users");

router.get("/all/:token", (req, res) => {
  console.log("Reached backend products");
  User.findOne({ token: req.params.token })
    .then((data) => {
      if (data) {
        Product.find().then((data) => {
          res.json({ result: true, Products: data });
        });
      } else {
        res.status(401).send({ result: false, error: "User not found" });
      }
    })
    .catch((error) => {
      console.log(error.message);
      res.status(500).send({ result: false, error: error.message });
    });
});

module.exports = router;
