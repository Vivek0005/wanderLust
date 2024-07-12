const express = require("express");
const router = express.Router();
const passport = require("passport");
const { setRedirectUrl } = require("../middlewares/authMiddleware");
const UserController = require("../controllers/usersC.js");
const { isLoggedIn, isUser } = require("../middlewares/authMiddleware.js");

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

// PROFILE ROUTE
router.get("/users/:id", isLoggedIn, isUser, UserController.getProfile);

router.get("/users/:id/edit", isLoggedIn, isUser, UserController.editProfileForm);

router.put("/users/:id", isLoggedIn, isUser, UserController.updateProfile);

router.get("/users/:id/listings", isLoggedIn, isUser, UserController.UserListings);

router.get("/users/:id/bookings", isLoggedIn, isUser, UserController.UserBookings);


module.exports = router;
