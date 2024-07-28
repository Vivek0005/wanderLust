const User = require("../models/user");
const { sendWelcomeEmail } = require("../utils/nodeMailer");
const wrapAsync = require("../utils/wrapAsync");

// Signup Form
module.exports.signUpForm = (req, res) => {
  res.render("users/signup");
};

// Sign Up  
module.exports.signUp = wrapAsync(async (req, res, next) => {
  const { username, email, password, contact } = req.body;
  const user = new User({ username, email, contact });

  const registeredUser = await User.register(user, password);
  await sendWelcomeEmail(email, username);

  req.login(registeredUser, (err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "User Registered Successfully");
    res.redirect("/listings");
  });
});

// Login Form
module.exports.loginForm = (req, res) => {
  res.render("users/login");
};

// Login
module.exports.login = (req, res) => {
  const redirectUrl = res.locals.redirectUrl || "/listings";
  req.flash("success", "Logged in Successfully!");
  res.redirect(redirectUrl);
};

// Google Login
module.exports.googleLogin = (req, res) => {
  const redirectUrl = res.locals.redirectUrl || "/listings";
  req.flash("success", "Logged in successfully!");
  res.redirect(redirectUrl);
};

// Github Login
module.exports.githubLogin = (req, res) => {
  const redirectUrl = res.locals.redirectUrl || "/listings";
  req.flash("success", "Logged in successfully!");
  res.redirect(redirectUrl);
};

// Logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out Successfully");
    res.redirect("/listings");
  });
};

// User Profile
module.exports.getProfile = wrapAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/listings");
  }
  res.render("users/userProfile", { user });
});

// Edit Profile Form
module.exports.editProfileForm = wrapAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/listings");
  }
  res.render("users/editProfile", { user });
});

// Confirm Password for Deletion
module.exports.confirmPassword = (req, res) => {
  res.render("users/confirmPassword", { user: req.user });
};

// Update Profile
module.exports.updateProfile = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, req.body.user, {
    new: true,
  });
  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect(`/users/${id}`);
  }
  req.flash("success", "Profile updated successfully");
  res.redirect(`/users/${id}`);
});

// Change Password Form
module.exports.changePasswordForm = (req, res) => {
  res.render("users/changePassword", { user: req.user });
};

// Change Password
module.exports.changePassword = wrapAsync(async (req, res, next) => {

  const { oldPassword, newPassword, confirmPassword } = req.body;
  const { id } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect(`/users/${id}/change-password`);
  }

  const isCorrect = await user.authenticate(oldPassword);

  if (!isCorrect.user) {
    await req.flash("error", "Incorrect old password.");
    return res.redirect(`/users/${id}/change-password`);
  }

  if (newPassword !== confirmPassword) {
    await req.flash("error", "New passwords do not match.");
    return res.redirect(`/users/${id}/change-password`);
  }

  if (oldPassword === newPassword) {
    await req.flash("error", "New password cannot be the same as old password.");
    return res.redirect(`/users/${id}/change-password`);
  }

  // Update Password
  await user.setPassword(newPassword);
  await user.save();

  req.flash("success", "Password changed successfully.");
  res.redirect(`/users/${id}`);
});


// User Listings
module.exports.UserListings = wrapAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('listings');

  if (!user) {
    return res.status(404).send('User not found');
  }

  res.render('users/myListings', { listings: user.listings });
});

// User Bookings
module.exports.UserBookings = wrapAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: "bookings",
    populate: {
      path: "listing",
      model: "Listing",
    },
  });

  if (!user) {
    return res.status(404).send("User not found");
  }
  // console.log(user.bookings);
  res.render("users/myBookings", { bookings: user.bookings });
});

