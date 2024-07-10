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

const setRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    // console.log("Redirect URL in session:", req.session.redirectUrl);
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl; 
  } 
  return next();
};


const isOwner = async (req, res, next) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    if (!req.user._id.equals(listing.owner._id)) {
      req.flash("error", "You are not authorized to perform this action");
      return res.redirect(`/listings/${id}`);
    }
    return next();
  } catch (err) {
    console.error("Error in isOwner middleware:", err);
    req.flash("error", "Failed to verify ownership");
    return res.redirect(`/listings/${id}`);
  }
};

const isAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  try {
    const review = await Review.findById(reviewId);
    if (!req.user._id.equals(review.author._id)) {
      req.flash("error", "You are not authorized to perform this action");
      return res.redirect(`/listings/${id}`);
    }
    return next();
  } catch (err) {
    console.error("Error in isAuthor middleware:", err);
    req.flash("error", "Failed to verify authorship");
    return res.redirect(`/listings/${id}`);
  }
};

module.exports = {
  isLoggedIn,
  setRedirectUrl,
  isOwner,
  isAuthor,
};
