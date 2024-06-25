const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares/authMiddleware");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const UserController = require("../controllers/usersC.js");

// SIGNUP ROUTE
router.get("/signup", UserController.signUpForm);

// CREATE ROUTE
router.post("/signup", UserController.signUp);

// LOGIN FORM ROUTE
router.get("/login", UserController.loginForm);

// LOGIN ROUTE// LOGIN ROUTE
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  UserController.login
);

// LOGOUT ROUTE
router.get("/logout", UserController.logout);

module.exports = router;
