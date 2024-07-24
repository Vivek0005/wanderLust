const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAP_TOKEN;
const Booking = require("../models/booking");
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });
const ExpressError = require("../utils/ExpressError");
const { sendBookingConfirmation } = require("../utils/nodeMailer");


// All Listings
module.exports.index = wrapAsync(async (req, res) => {
  const { sortBy } = req.query;
  let sortCriteria;

  switch (sortBy) {
    case 'price-asc':
      sortCriteria = { price: 1 };
      break;
    case 'price-desc':
      sortCriteria = { price: -1 };
      break;
    case 'rating-asc':
      sortCriteria = { avgRating: 1 };
      break;
    case 'rating-desc':
      sortCriteria = { avgRating: -1 };
      break;
    default:
      sortCriteria = null; 
  }

  const pipeline = [
    {
      $lookup: {
        from: 'reviews',
        localField: 'reviews',
        foreignField: '_id',
        as: 'reviews'
      }
    },
    {
      $addFields: {
        avgRating: { $avg: '$reviews.rating' }
      }
    }
  ];

  if (sortCriteria) {
    pipeline.push({ $sort: sortCriteria });
  }

  const allListings = await Listing.aggregate(pipeline);

  res.render('listings/index', { allListings });
});


// New Listing
module.exports.newListingForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Create Listing
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
  req.user.listings.push(listing);

  await listing.save();
  req.flash("success", "Listing created successfully");
  res.redirect("/listings");
});

// Show Listing
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

  const formattedDescription = listing.description.replace(/\n/g, '<br>');

  if (!listing) {
    req.flash("error", " The Listing was not found");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing, mapToken: process.env.MAP_TOKEN, formattedDescription });
});

// Edit Listing
module.exports.editListingForm = wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", " The Listing was not found");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
});

// Update Listing
module.exports.updateListing = wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, req.body.listing, {
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

// Delete Listing
module.exports.destroyListing = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);
  await Review.deleteMany({ _id: { $in: listing.reviews } });

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing deleted successfully");
  res.redirect("/listings");
});

// Search
module.exports.searchListings = wrapAsync(async (req, res) => {
  const { location } = req.query;
  // console.log(location);

  if (!location) {
    res.redirect("/listings")
  }
  const allListings = await Listing.find({
    $or: [
      { location: { $regex: location, $options: 'i' } },
      { country: { $regex: location, $options: 'i' } }
    ]
  });
  res.render('listings/searchResults', { allListings, location });
});

// Booking
// booking form
module.exports.renderBookingForm = wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "The Listing was not found");
    return res.redirect("/listings");
  }
  res.render("listings/book", { listing });
});

// create booking
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

  // Sending booking confirmation email
  try {
    await sendBookingConfirmation(
      req.user.email,
      req.user.username,
      listing.title,
      listing.location,
      booking.checkin,
      booking.checkout,
      listing.owner.username,
      listing.owner.contact,
      listing.price
    );

  } catch (error) {
    req.flash(
      "error",
      "Booking created successfully but there was an issue sending the confirmation email."
    );
  }

  res.redirect(`/listings/${id}/booking-success`);
});

// booking success page
module.exports.renderSuccessPage = (req, res) => {
  const { id } = req.query;
  res.render("listings/bookSuccess", { id });
};

