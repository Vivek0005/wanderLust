const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const validateMiddleware = require("../middlewares/validationMiddleware");
const listingSchema = require("../utils/listingValidation");
const {isLoggedIn} = require("../middlewares/authMiddleware.js");

// INDEX ROUTE
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// CREATE GET ROUTE
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// SHOW ROUTE
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      // return next(new ExpressError(404, "Listing not found"));
      req.flash("error", " The Listing was not found");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

// CREATE POST ROUTE
router.post(
  "/",
  isLoggedIn,
  validateMiddleware(listingSchema),
  wrapAsync(async (req, res, next) => {
    console.log(req.body.listing);
    let listing = new Listing(req.body.listing);
    await listing.save();
    req.flash("success", "Listing created successfully");
    console.log("Listing saved successfully");
    res.redirect("/listings");
  })
);

// EDIT ROUTE
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      // return next(new ExpressError(404, "Listing not found"));
      req.flash("error", " The Listing was not found");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// UPDATE ROUTE
router.put(
  "/:id",
  isLoggedIn,
  validateMiddleware(listingSchema),
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    // console.log(req.body.listing);

    let listing = await Listing.findByIdAndUpdate(id, req.body.listing, {
      new: true,
    });
    req.flash("success", "Listing updated successfully");

    // console.log(listing);
    if (!listing) {
      // return next(new ExpressError(404, "Listing not found"));
      req.flash("error", "The Listing was not found");
      res.redirect("/listings");
    }
    res.redirect(`/listings/${id}`);
  })
);

// DESTROY ROUTE
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    if (!listing) {
      return next(new ExpressError(404, "Listing not found"));
    }
    res.redirect("/listings");
  })
);

module.exports = router;
