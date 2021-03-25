const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");
const Item = require("../models/Item");
const Payment = require("../models/Payment");
const async = require("async");

router.post("/", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "please fill all things" });
  }
  User.findOne({ email }).then((user) => {
    if (user)
      return res.status(400).json({ msg: "this user is already exist" });
    const newUser = new User({
      name,
      email,
      password,
    });
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(newUser.password, salt, function (err, hash) {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            config.get("jwtsecret"),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                },
              });
            }
          );
        });
      });
    });
  });
});

router.put("/updateUser", auth, (req, res) => {
  const { name, lastname, email, images } = req.body;
  if (!name || !email) {
    return res.status(422).json({
      message: "name, email are  required.",
    });
  }
  User.findOneAndUpdate(
    { _id: req.user.id },
    { $set: { name, lastname, email, images } },
    { new: true }
  ).then(() =>
    User.findOne({ _id: req.user.id })
      .then((user) => res.json(user))
      .catch((err) => err.status(500))
      .catch((err) => res.json(err))
  );
});

router.put("/changePassword", auth, (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  User.findById(req.user.id, (err, userInfo) => {
    if (err) return res.json({ success: false, err });
    const user = userInfo;
    bcrypt.compare(oldPassword, user.password, function (err, isMatch) {
      if (err) res.send({ msg: "mo zabta" });
      if (!isMatch) {
        return res
          .status(422)
          .send({ msg: "You old password is incorrect! Please try again." });
      }
      if (oldPassword === newPassword) {
        return res.status(422).send({
          msg: "Your new password must be different from your old password!",
        });
      }
      user.password = newPassword;
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
          if (err) throw err;
          user.password = hash;
          user.save(function (err, user) {
            if (err) throw err;
            res.json(user);
          });
        });
      });
    });
  });
});

router.get("/addToCart", auth, (req, res) => {
  User.findOne({ _id: req.user.id }, (err, userInfo) => {
    let duplicate = false;
    userInfo.cart.forEach((item) => {
      if (item.id == req.query.productId) {
        duplicate = true;
      }
    });

    if (duplicate) {
      User.findOneAndUpdate(
        { _id: req.user.id, "cart.id": req.query.productId },
        { $inc: { "cart.$.quantity": 1 } },
        { new: true },
        (err, userInfo) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json(userInfo.cart);
        }
      );
    } else {
      User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $push: {
            cart: {
              id: req.query.productId,
              quantity: 1,
              date: new Date().toISOString().replace(/:/g, "-"),
            },
          },
        },
        { new: true },
        (err, userInfo) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json(userInfo.cart);
        }
      );
    }
  });
});

router.get("/removeOneFromCart", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user.id, "cart.id": req.query.productId },
    { $inc: { "cart.$.quantity": -1 } },
    { new: true },
    (err, userInfo) => {
      if (err) return res.json(err);
      res.status(200).json(userInfo.cart);
    }
  );
});

router.get("/removeFromCart", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user.id },
    {
      $pull: { cart: { id: req.query.productId } },
    },
    { new: true },
    (err, userInfo) => {
      if (err) return res.json(err);
      res.status(200).json(userInfo.cart);
    }
  );
});

router.get("/userCartInfo", auth, (req, res) => {
  User.findOne({ _id: req.user.id }, (err, user) => {
    if (err) return res.status(404).send(err);
    let cart = user.cart;
    let array = cart.map((item) => {
      return item.id;
    });

    Item.find({ _id: { $in: array } })
      .populate("writer")
      .exec((err, cartDetail) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json({ cartDetail, cart });
      });
  });
});

router.post("/successBuy", auth, (req, res) => {
  const history = [];
  const transactionData = {};

  req.body.cartDetail.forEach((item) => {
    history.push({
      dateOfPurchase: new Date().toISOString().replace(/:/g, "-"),
      name: item.name,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
    });
  });

  transactionData.user = {
    id: req.user.id,
    name: req.user.name,
    lastname: req.user.lastname,
    email: req.user.email,
  };

  transactionData.product = history;

  User.findOneAndUpdate(
    { _id: req.user.id },
    { $push: { history: history }, $set: { cart: [] } },
    { new: true },
    (err, user) => {
      if (err) return res.json({ success: false, err });
      const payment = new Payment(transactionData);
      payment.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        let products = [];
        doc.product.forEach((item) => {
          products.push({ id: item.id, quantity: item.quantity });
        });
        async.eachSeries(
          products,
          (item, callback) => {
            Item.update(
              { _id: item.id },
              {
                $inc: {
                  sold: item.quantity,
                },
              },
              { new: false },
              callback
            );
          },
          (err) => {
            if (err) return res.json({ success: false, err });
            res.status(200).json({
              cart: [],
              cartDetail: [],
            });
          }
        );
      });
    }
  );
});

router.get("/getHistory", auth, (req, res) => {
  User.findOne({ _id: req.user.id }, (err, doc) => {
    let history = doc.history;
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, history });
  });
});

module.exports = router;
