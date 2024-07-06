const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAP_TOKEN;
const Booking = require("../models/booking");
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });
const ExpressError = require("../utils/ExpressError");
const sendBookingConfirmation = require("../utils/nodeMailer");

module.exports.index = wrapAsync(async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

module.exports.newListingForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = wrapAsync(async (req, res, next) => {
  let coordinates = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let geometry = coordinates.body.features[0].geometry;

  // let url = req.file.path;-------
  // let filename = req.file.filename;------

  // console.log(url, "....", filename);-------
  let listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  listing.geometry = geometry;

  // listing.image = { url, filename }; ------
  await listing.save();
  req.flash("success", "Listing created successfully");
  res.redirect("/listings");
});

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
    req.flash("error", " The Listing was not found");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing, mapToken: process.env.MAP_TOKEN });
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

module.exports.renderBookingForm = wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "The Listing was not found");
    return res.redirect("/listings");
  }
  res.render("listings/book", { listing });
});

module.exports.createBooking = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("owner");
  if (!listing) {
    req.flash("error", "The Listing was not found");
    return res.redirect("/listings");
  }

  const booking = new Booking(req.body.booking);
  booking.listing = listing._id;
  booking.user = req.user._id;
  await booking.save();

  req.user.bookings.push(booking);
  await req.user.save();

  try {
    await sendBookingConfirmation(
      req.user.email,
      listing.title,
      listing.location,
      booking.checkInDate,
      booking.checkOutDate,
      listing.owner.username,
      listing.owner.contact
    );
    req.flash(
      "success",
      "Booking successful. Please Check your email for confirmation"
    );
  } catch (error) {
    req.flash(
      "error",
      "Booking created successfully but there was an issue sending the confirmation email."
    );
  }

  res.redirect(`/listings/${id}`);
});
