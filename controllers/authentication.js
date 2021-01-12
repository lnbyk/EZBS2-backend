const jwt = require("jsonwebtoken"),
  crypto = require("crypto"),
  User = require("../models/User"),
  config = require("../config/config"),
  securityService = require("../security/security"),
  mongoose = require("mongoose");

function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080,
  });
}

//========================================
// Login Route
//========================================
exports.login = function (req, res, next) {
  User.findOne(
    {
      email: req.body.email,
    },
    function (err, user) {
      if (err) {
        return res.status(400).json({
          error: "bad data",
        });
      }
      if (!user) {
        return res.status(400).json({
          error: "Your login details could not be verified. Please try again.",
        });
      }
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) {
          console.log(err);
          return res.status(400).json({
            error: "bad data2",
          });
        }
        if (!isMatch) {
          return res.status(400).json({
            error:
              "Your login details could not be verified. Please try again.",
          });
        }
        let userInfo = user.toJson();
        res.status(200).json({
          token: "Bearer " + generateToken(userInfo),
          user: userInfo,
        });
      });
    }
  );
};

//========================================
// Registration Route
//========================================

exports.register = function (req, res, next) {
  // Check for registration errors
  const email = req.body.email;
  const password = req.body.password;
  if (!email) {
    return res.status(422).send({
      error: "You must enter an email address.",
    });
  }
  if (!password) {
    return res.status(422).send({
      error: "You must enter a password.",
    });
  }
  /*
    if (validatedBirthdate(birthdate)) {
      return res.status(422).send({
        error: "you must be 18 years old or older",
      });
    }
    */
  User.findOne(
    {
      email: email,
    },
    function (err, existingUser) {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        return res.status(422).send({
          error: "That email address is already in use.",
        });
      } else {
        console.log(birthdate);
        let user = new User({
          email: email,
          password: password,
        });
        console.log(user);
        user.save(function (err, user) {
          if (err) {
            return next(err);
          }
          let userInfo = user.toJson();
          res.status(201).json({
            token: "JWT " + generateToken(userInfo),
            user: userInfo,
          });
        });
      }
    }
  );
};
