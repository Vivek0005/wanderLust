const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const {
  isLoggedIn,
  saveRedirectUrl,
} = require("../middlewares/authMiddleware");
// SIGNUP ROUTE
router.get("/signup", (req, res) => {
  res.render("users/signup");
});

// CREATE ROUTE
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User Registered Successful");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
});

// LOGIN FORM ROUTE
router.get("/login", (req, res) => {
  res.render("users/login");
});

// LOGIN ROUTE// LOGIN ROUTE
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    // console.log(res.locals.redirectUrl);
    req.flash("success", "Logged in Successfully");
    res.redirect(res.locals.redirectUrl || "/listings");
  }
);

// LOGOUT ROUTE
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out Successfully");
    res.redirect("/listings");
  });
});

module.exports = router;
