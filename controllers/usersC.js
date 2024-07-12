const { model } = require("mongoose");
const User = require("../models/user");
const { sendWelcomeEmail } = require("../utils/nodeMailer");
const wrapAsync = require("../utils/wrapAsync");

// Wrap each controller function with wrapAsync

module.exports.signUpForm = (req, res) => {
  res.render("users/signup");
};

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

module.exports.loginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  const redirectUrl = res.locals.redirectUrl || "/listings";
  req.flash("success", "Logged in Successfully");
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out Successfully");
    res.redirect("/listings");
  });
};

module.exports.getProfile = wrapAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/listings");
  }
  res.render("users/userProfile", { user });
});

module.exports.editProfileForm = wrapAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/listings");
  }
  res.render("users/editProfile", { user });
});

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

module.exports.UserListings = wrapAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('listings');
  
  if (!user) {
      return res.status(404).send('User not found');
  }
  
  res.render('users/myListings', { listings: user.listings });
});

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
