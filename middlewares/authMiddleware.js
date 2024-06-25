const Listing = require("../models/listing");
const Review = require("../models/review");

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please log in first!");
    return res.redirect("/login");
  }
  return next();
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  return next();
};

const isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  let user = res.locals.CurrentUser;
  if (!user._id.equals(listing.owner._id)) {
    req.flash("error", "You are not authorized to perform this action");
    return res.redirect(`/listings/${id}`);
  }
  return next();
};

const isAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  let user = res.locals.CurrentUser;
  if (!user._id.equals(review.author._id)) {
    req.flash("error", "You are not authorized to perform this action");
    return res.redirect(`/listings/${id}`);
  }
  return next();
};

module.exports = {
  isLoggedIn,
  saveRedirectUrl,
  isOwner,
  isAuthor,
};
