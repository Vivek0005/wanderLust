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

router.get("/logout", UserController.logout);

router.get("/:id", isLoggedIn, isUser, UserController.getProfile);

router.get("/:id/edit", isLoggedIn, isUser, UserController.editProfileForm);

router.put("/:id", isLoggedIn, isUser, UserController.updateProfile);

router.get("/:id/listings", isLoggedIn, isUser, UserController.UserListings);

router.get("/:id/bookings", isLoggedIn, isUser, UserController.UserBookings);

router
  .route("/:id/change-password")
  .get(isLoggedIn, isUser, UserController.changePasswordForm)
  .post(isLoggedIn, isUser, UserController.changePassword);

// router.get("/:id/delete", isLoggedIn, isUser, UserController.sendOtpForDeletion);

// router.post("/:id/verify-otp", isLoggedIn, isUser, UserController.verifyOtp);

// router.delete("/:id/confirm-delete", isLoggedIn, isUser, UserController.deleteProfile);

module.exports = router;
