const express = require("express");
const app = express();
require("dotenv").config();
const db_connection = require("./config/db.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listings");
const reviews = require("./routes/reviews");

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

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.get("/", (req, res) => {
  res.send("Root");
});

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
