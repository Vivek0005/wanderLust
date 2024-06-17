const express = require("express");
const app = express();
require("dotenv").config();
const db_connection = require("./config/db.js");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const listingSchema = require("./utils/listingValidation.js");
const Review = require("./models/review.js");
const reviewSchema = require("./utils/reviewValidation.js");

// DATABASE CONNECTION
db_connection()
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.send("Root");
});

// INDEX ROUTE
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// CREATE GET ROUTE
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// SHOW ROUTE
app.get(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      return next(new ExpressError(404, "Listing not found"));
    }
    res.render("listings/show.ejs", { listing });
  })
);

// CREATE POST ROUTE
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    const { error, value } = listingSchema.validate(req.body);
    if (error) {
      return next(new ExpressError(400, error.message));
    }
    let listing = new Listing(value);
    await listing.save();
    console.log("Listing saved successfully");
    res.redirect("/listings");
  })
);

// EDIT ROUTE
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      return next(new ExpressError(404, "Listing not found"));
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// UPDATE ROUTE
app.put(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    const { error, value } = listingSchema.validate(req.body);
    if (error) {
      return next(new ExpressError(400, error.message));
    }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, value, { new: true });
    if (!listing) {
      return next(new ExpressError(404, "Listing not found"));
    }
    res.redirect(`/listings/${id}`);
  })
);

// DESTROY ROUTE
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    if (!listing) {
      return next(new ExpressError(404, "Listing not found"));
    }
    res.redirect("/listings");
  })
);

// Reviews
// Create REVIEW ROUTE
app.post(
  "/listings/:id/reviews",
  wrapAsync(async (req, res, next) => {
    const { error, value } = reviewSchema.validate(req.body.review);
    if (error) {
      return next(new ExpressError(400, error.message));
    }
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(new ExpressError(404, "Listing not found"));
    }
    let newReview = new Review(value);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);


// PAGE NOT FOUND Middleware
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "PAGE NOT FOUND"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error encountered:", err);

  let { status = 500, message = "Something went wrong" } = err;

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors)[0].message;
  }
  res.status(status).render("error.ejs", { message });
});

// PORT CONNECTION
app.listen(process.env.PORT, () => {
  console.log(`Listening for incoming requests on port ${process.env.PORT}`);
});
