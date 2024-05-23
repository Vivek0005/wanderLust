const express = require("express");
const app = express();
require("dotenv").config();
const db_connection = require("./config/db.js");
const Listing = require("./models/listing.js");

// DATABASE CONNECTION
db_connection()
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Root ");
});

// PORT CONNECTION
app.listen(process.env.PORT, () => {
  console.log("listening for incoming requests on port 8080");
});
