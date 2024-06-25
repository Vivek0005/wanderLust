const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewSchema = require("../utils/reviewValidation");
const validateMiddleware = require("../middlewares/validationMiddleware");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const { isAuthor } = require("../middlewares/authMiddleware");
const ReviewController = require("../controllers/reviewsC.js");

// Create REVIEW ROUTE
router.post(
  "/",
  isLoggedIn,
  validateMiddleware(reviewSchema),
  ReviewController.createReview
);

// DELETE REVIEW ROUTE
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  ReviewController.destroyReview
);

module.exports = router;
