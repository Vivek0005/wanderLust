const express = require("express");
const router = express.Router();
const validateMiddleware = require("../middlewares/validationMiddleware");
const listingSchema = require("../utils/listingValidation");
const { isLoggedIn, isOwner } = require("../middlewares/authMiddleware.js");
const ListingController = require("../controllers/listingsC.js");
const multer = require("multer");
const { cloudStorage } = require("../config/cloud.js");
const upload = multer({ storage: cloudStorage });

router
  .route("/")
  // SHOW ROUTE
  .get(ListingController.index)
  // CREATE ROUTE
  .post(
    isLoggedIn,
    // validateMiddleware(listingSchema),
    upload.single("listing[image]"),
    ListingController.createListing
  );

// CREATE FORM ROUTE
router.get("/new", isLoggedIn, ListingController.newListingForm);

router
  .route("/:id")
  // EDIT FORM ROUTE
  .get(ListingController.showListing)
  // UPDATE ROUTE
  .put(
    isLoggedIn,
    isOwner,
    validateMiddleware(listingSchema),
    ListingController.updateListing
  )
  // DESTROY ROUTE
  .delete(isLoggedIn, isOwner, ListingController.destroyListing);

// EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, ListingController.editListingForm);

// BOOK ROUTE
router
  .route("/:id/book")
  .get(isLoggedIn, ListingController.renderBookingForm)
  .post(isLoggedIn, ListingController.createBooking);

module.exports = router;
