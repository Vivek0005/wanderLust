const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const validateMiddleware = require("../middlewares/validationMiddleware");
const listingSchema = require("../utils/listingValidation");
const { isLoggedIn, isOwner } = require("../middlewares/authMiddleware.js");
const ListingController = require("../controllers/listingsC.js");

// INDEX ROUTE
router.get("/", ListingController.index);

// CREATE GET ROUTE
router.get("/new", isLoggedIn, ListingController.newListingForm);

// SHOW ROUTE
router.get("/:id", ListingController.showListing);

// CREATE POST ROUTE
router.post(
  "/",
  isLoggedIn,
  validateMiddleware(listingSchema),
  ListingController.createListing
);

// EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, ListingController.editListingForm);

// UPDATE ROUTE
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateMiddleware(listingSchema),
  ListingController.updateListing
);

// DESTROY ROUTE
router.delete("/:id", isLoggedIn, isOwner, ListingController.destroyListing);

module.exports = router;
