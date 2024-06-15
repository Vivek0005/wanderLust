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
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

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
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

// CREATE POST ROUTE
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    let listing = new Listing(req.body);
    const { error, value } = listingSchema.validate(listing);
    if (error) {
      return next(new ExpressError(400, error));
    }
    await listing.save();
    console.log("Listing saved successfully");
    res.redirect("/listings");
  })
);

// EDIT ROUTE
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// UPDATE ROUTE
app.put(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const { error, value } = listingSchema.validate(req.body);
    if (error) {
      return next(new ExpressError(400, error));
    }
    let editedListing = req.body;
    await Listing.findByIdAndUpdate(id, editedListing);
    res.redirect(`/listings/${id}`);
  })
);

// DESTROY ROUTE
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

// error handling middleware
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "PAGE NOT FOUND"));
});

app.use((err, req, res, next) => {
  let { sts = 500, msg = "Something went wrong" } = err;
  res.status(sts);
  res.render("error.ejs", { msg });
});

// PORT CONNECTION
app.listen(process.env.PORT, () => {
  console.log(`Listening for incoming requests on port ${process.env.PORT}`);
});
