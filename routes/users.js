const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares/authMiddleware");
const UserController = require("../controllers/usersC.js");

router
  .route("/signup")
  .get(UserController.signUpForm)
  .post(UserController.signUp);

router
  .route("/login")
  .get(UserController.loginForm)
  .post(
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
