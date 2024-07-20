const express = require("express");
const router = express.Router();
const validateMiddleware = require("../middlewares/validationMiddleware");
const listingSchema = require("../utils/listingValidation");
const { isLoggedIn, isOwner } = require("../middlewares/authMiddleware.js");
const ListingController = require("../controllers/listingsC.js");
const multer = require("multer");
const { cloudStorage } = require("../config/cloud.js");
const upload = multer({ storage: cloudStorage });
const bookingSchema = require("../utils/bookingValidation");

router
  .route("/")
  .get(ListingController.index)
  .post(
    isLoggedIn,
    validateMiddleware(listingSchema),
    // upload.single("listing[image]"),
    ListingController.createListing
  );

router.get("/new", isLoggedIn, ListingController.newListingForm);

router.get("/search", ListingController.searchListings);

router
  .route("/:id")
  .get(ListingController.showListing)
  .put(
    isLoggedIn,
    isOwner,
    validateMiddleware(listingSchema),
    ListingController.updateListing
  )
  .delete(isLoggedIn, isOwner, ListingController.destroyListing);

router.get("/:id/edit", isLoggedIn, isOwner, ListingController.editListingForm);

router
  .route("/:id/book")
  .get(isLoggedIn, ListingController.renderBookingForm)
  .post(isLoggedIn, ListingController.createBooking);

router.get(
  "/:id/booking-success",
  isLoggedIn,
  ListingController.renderSuccessPage
);

module.exports = router;
