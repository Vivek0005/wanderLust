const mongoose = require("mongoose");
const data = require("./listingData.js");
const listing = require("../models/listing.js");
const db_connect = require("../config/db.js");
const Listing = require("../models/listing");
require("dotenv").config();

const initData = async () => {
  await Listing.deleteMany();
  await Listing.insertMany(data.data);
  console.log("data initialized");
};

db_connect()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

initData();
