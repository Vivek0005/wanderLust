const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please log in first!");
    return res.redirect("/users/login");
  }
  return next();
};

const setRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl; 
  } 
  return next();
};

const isOwner = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!req.user._id.equals(listing.owner._id)) {
    req.flash("error", "You are not authorized to perform this action");
    return res.redirect(`/listings/${id}`);
  }
  return next();
});

const isAuthor = wrapAsync(async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!req.user._id.equals(review.author._id)) {
    req.flash("error", "You are not authorized to perform this action");
    return res.redirect(`/listings/${id}`);
  }
  return next();
});

const isUser = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!req.user._id.equals(user._id)) {
    req.flash("error", "You are not authorized to view others profiles");
    return res.redirect("/listings");
  }
  return next();
});

module.exports = {
  isLoggedIn,
  setRedirectUrl,
  isOwner,
  isAuthor,
  isUser,
};
