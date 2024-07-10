const express = require("express");
const router = express.Router();
const passport = require("passport");
const { setRedirectUrl } = require("../middlewares/authMiddleware");
const UserController = require("../controllers/usersC.js");

router
  .route("/signup")
  .get(UserController.signUpForm)
  .post(UserController.signUp);

router
  .route("/login")
  .get(UserController.loginForm)
  .post(
    setRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    UserController.login
  );

// LOGOUT ROUTE
router.get("/logout", UserController.logout);

module.exports = router;
