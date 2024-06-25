const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");

module.exports.index = wrapAsync(async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

module.exports.newListingForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    // return next(new ExpressError(404, "Listing not found"));
    req.flash("error", " The Listing was not found");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
});

module.exports.createListing = wrapAsync(async (req, res, next) => {
  console.log(req.body.listing);
  let listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  await listing.save();
  req.flash("success", "Listing created successfully");
  console.log("Listing saved successfully");
  res.redirect("/listings");
});

module.exports.editListingForm = wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", " The Listing was not found");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
});

module.exports.updateListing = wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  listing = await Listing.findByIdAndUpdate(id, req.body.listing, {
    new: true,
  });
  req.flash("success", "Listing updated successfully");
  // console.log(listing);
  if (!listing) {
    req.flash("error", "The Listing was not found");
    res.redirect("/listings");
  }
  res.redirect(`/listings/${id}`);
});

module.exports.destroyListing = wrapAsync(async (req, res, next) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully");
  if (!listing) {
    return next(new ExpressError(404, "Listing not found"));
  }
  res.redirect("/listings");
});
