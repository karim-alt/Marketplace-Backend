const express = require("express");
const router_users = express.Router();

//load Services
const {
  loginService,
  RegistrationService,
  SMSverification,
  updateUser,
  find_user
} = require("../../services/users.service");

// @route POST api/users/register
// @desc Register user
// @access Public
router_users.post("/register", RegistrationService);

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router_users.post("/login", loginService);

// @route POST api/users/verify
// @desc verify that the user've got a msg on his phone number
// @access Public
router_users.post("/verify", SMSverification);

// @route POST api/users/update/:id
// @desc verify that the user've got a msg on his phone number
// @access Public
router_users.post("/update/:id", updateUser);

// @route POST api/:id
// @desc find user
// @access Public
router_users.get("/:id", find_user);

module.exports = router_users;
