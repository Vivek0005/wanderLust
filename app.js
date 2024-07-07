const express = require("express");
const app = express();
require("dotenv").config();
const db_connection = require("./config/db.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const Listing = require("./models/listing");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const listingRouter = require("./routes/listings");
const reviewRouter = require("./routes/reviews");
const userRouter = require("./routes/users.js");

// DATABASE CONNECTION
db_connection()
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

const store = MongoStore.create({
  mongoUrl: process.env.ATLAS_URL,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: process.env.SECRET,
  },
});

store.on("error", (e) => {
  console.log("MONGO SESSION STORE ERROR", e);
});

const sessionOptions = {
  store: store,
  secret: "process.env.SECRET",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

// MIDDLEWARES
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  // console.log("Setting CurrentUser:", req.user);
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.CurrentUser = req.user;
  next();
});

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Listing Routes
app.use("/listings", listingRouter); 

// Review Routes
app.use("/listings/:id/reviews", reviewRouter);

// User routes
app.use("/", userRouter);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.get("/", async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/home.ejs", { allListings });
});

// PAGE NOT FOUND Middleware
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "PAGE NOT FOUND"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  // console.error("Error encountered:", err);

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
