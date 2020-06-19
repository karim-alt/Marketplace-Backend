const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
// Load input validation
const validateRegisterInput = require("../validation/users/register");
const validateLoginInput = require("../validation/users/login");

// Load User model
const User = require("../models/User.model");
// request id as a globale variable
let req_id;
//registred user id
let user_id;
//  Nexmo credentials:
const Nexmo = require("nexmo");
const nexmo = new Nexmo({
  apiKey: "c6d5996e",
  apiSecret: "kjSYykyNaD0Pzw8y"
});

let loginService = (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.json({ status: "failure", msg: errors });
  }
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ $or: [{ email: email }, { phone: email }] }).then(user => {
    // Check if user exists
    if (!user) {
      return res.json({
        status: "failure",
        msg: {
          email: "User not found, you must create an account first "
        }
      });
    }
    // if (!user.isVerified) {
    //   return res.json({
    //     status: "failure",
    //     msg: "your account has not been verified yet"
    //   });
    // }

    // Check password
    else
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            type: user.type,
            phone: user.phone,
            country: user.country
          };
          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                status: "success",
                token: "Bearer " + token
              });
            }
          );
        } else {
          return res.json({
            status: "failure",
            msg: {
              password: "Password incorrect, please try again"
            }
          });
        }
      });
  });
};

// verify SMS pin code
let SMSverification = (req, res) => {
  let pin = req.body.pin;
  let requestId = req_id;
  nexmo.verify.check(
    {
      request_id: requestId,
      code: pin
    },
    (err, result) => {
      if (err) {
        res.json({ status: "failure", msg: err });
      } else {
        console.log("result : " + result);
        // Error status code: https://developer.nexmo.com/api/verify#verify-check
        if (result && result.status == "0") {
          res.json({ status: "success", msg: "Account verified! 🎉" });
          console.log("Account verified!");

          User.findById(user_id, (err, User) => {
            if (!User) res.json({ status: "failure", msg: "user not found" });
            else {
              User.isVerified = true;
              User.save()
                .then(todo => {
                  res.json({ status: "success", msg: "user verified" });
                })
                .catch(err => {
                  res.json({
                    status: "failure",
                    msg: "Verification failed :" + err
                  });
                });
            }
          });
        } else {
          res.json({ status: "failure", msg: result.error_text });
        }
      }
    }
  );
};

let RegistrationService = (req, res) => {
  // Form validation
  console.log(req.body);
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.json({ status: "failure", msg: errors });
  }
  User.findOne({ phone: req.body.phone }).then(user => {
    if (user) {
      return res.json({
        status: "failure",
        msg: {
          email: "User already exists"
        }
      });
    } else {
      // A user registers with a mobile phone number :
      //  link for mor detail : https://www.nexmo.com/blog/2017/04/11/implement-two-factor-authentication-2fa-web-apps-node-js-dr
      let phone = req.body.phone;
      console.log(phone);
      // nexmo.verify.request(
      //   { number: phone, brand: "AgriEdge" },
      //   (err, result) => {
      //     if (err) {
      //       res.json({ status: "failure", msg: err });
      //     } else {
      //       req_id = result.request_id;
      //       // console.log("requestId: " + id);
      //       if (result.status == "0") {
      //         console.log("requestId: " + req_id);
      const newUser = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        type: req.body.type,
        password: req.body.password,
        country: req.body.country
      });
      // if (newUser.isVerified == true)
      newUser
        .save
        //   (err, user) => {
        //   user_id = user._id;
        // }
        ()
        .then(user =>
          res.json({
            status: "success",
            msg: user
          })
        )
        .catch(err => console.log(err));
      // } else {
      //   res.json({ status: "failure", msg: result.error_text });
      //       }
      //     }
      //   }
      // );
    }
  });
};

let updateUser = (req, res) => {
  User.findById(req.params.id, (err, User) => {
    if (!User) res.status(404).send("User not found");
    else {
      if (user) {
        let isMatch = User.comparePassword(req.body.password);
        if (isMatch) {
          User.fullName = req.body.fullName;
          User.email = req.body.email;
          User.phone = req.body.phone;
          User.password = req.body.password;
          User.country = req.body.country;
          User.save()
            .then(todo => {
              res.json("User updated!");
            })
            .catch(err => {
              res.status(400).send("Update is not possible " + err);
            });
        } else {
          throw new Error("this password does not match the old password !");
        }
      }
    }
  });
};

let find_user = (req, res) => {
  // let id = req.params.id;
  User.findById(req.params.id, (err, User) => {
    if (err) {
      res.send("an error has occured " + err);
    } else if (!User) res.status(404).send("User not found");
    else res.json(User);
  });
};

module.exports = {
  loginService,
  RegistrationService,
  SMSverification,
  updateUser,
  find_user
};
