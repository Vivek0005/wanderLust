const express = require("express");
const app = express();
require("dotenv").config();
const db_connection = require("./config/db.js");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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
app.get("/listings", async (req, res) => {
  try {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).send("Internal Server Error");
  }
});

// CREATE GET ROUTE
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// SHOW ROUTE
app.get("/listings/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    console.error("Error fetching listing:", err);
    res.status(500).send("Internal Server Error");
  }
});

// CREATE POST ROUTE
app.post("/listings", async (req, res,next) => {
  try {
    let listing = new Listing(req.body.listing);
    await listing.save();
    console.log("Listing saved successfully");
    res.redirect("/listings");
  } catch (err) {
    // console.error("Error saving listing:", err.message);
    // res.status(500).send("Internal Server Error");
    next(err);
  }
});

// EDIT ROUTE
app.get("/listings/:id/edit", async (req, res) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  } catch (err) {
    console.error("Error fetching listing for edit:", err);
    res.status(500).send("Internal Server Error");
  }
});

// UPDATE ROUTE
app.put("/listings/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let editedListing = req.body.listing;
    await Listing.findByIdAndUpdate(id, editedListing);
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error updating listing:", err);
    res.status(500).send("Internal Server Error");
  }
});

// DESTROY ROUTE
app.delete("/listings/:id", async (req, res) => {
  try {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  } catch (err) {
    console.error("Error deleting listing:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.use((err,req,res,next)=>{
  res.status(501).send("Something Went Wrong!");
  next(err);
})

// PORT CONNECTION
app.listen(process.env.PORT, () => {
  console.log(`Listening for incoming requests on port ${process.env.PORT}`);
});
