const express = require("express");
const app = express();
require("dotenv").config();
const db_connection = require("./config/db.js");
const Listing = require("./models/listing.js");
const path = require("path");

// DATABASE CONNECTION
db_connection()
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Root ");
});

// INDEX ROUTE
app.get("/listings", async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// CREATE GET ROUTE
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// SHOW ROUTE
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// CREATE POST ROUTE
app.post("/listings", (req, res) => {
  let listing = new Listing(req.body.listing);
  listing
    .save()
    .then(() => {
      console.log("Listing saved successfully");
    })
    .catch((err) => {
      console.error("Error saving listing:", err.message);
    });
  console.log(listing);
  res.redirect("/listings");
});

// PORT CONNECTION
app.listen(process.env.PORT, () => {
  console.log("listening for incoming requests on port 8080");
});
