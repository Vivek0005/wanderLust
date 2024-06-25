const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

module.exports.createReview = wrapAsync(async (req, res, next) => {
  let listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(new ExpressError(404, "Listing not found"));
  }
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review added successfully");
  res.redirect(`/listings/${listing._id}`);
});

module.exports.destroyReview = wrapAsync(async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully");
  if (!review) {
    return next(new ExpressError(404, "Review not found"));
  }
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  res.redirect(`/listings/${id}`);
});
