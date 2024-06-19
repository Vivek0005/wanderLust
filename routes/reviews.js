const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const reviewSchema = require("../utils/reviewValidation");
const validateMiddleware = require("../utils/validationMiddleware");
const Listing = require("../models/listing");

// Create REVIEW ROUTE
router.post(
  "/",
  validateMiddleware(reviewSchema),
  wrapAsync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(new ExpressError(404, "Listing not found"));
    }
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);

// DELETE REVIEW ROUTE
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res, next) => {
    let { id, reviewId } = req.params;

    let review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return next(new ExpressError(404, "Review not found"));
    }
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
