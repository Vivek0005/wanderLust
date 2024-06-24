const mongoose = require("mongoose");
const data = require("./listingData.js");
const Listing = require("../models/listing");
const db_connect = require("../config/db.js");
require("dotenv").config();

const initData = async () => {
  try {
    await Listing.deleteMany();
    const updatedData = data.data.map((listing) => {
      return { ...listing, owner: "667815f7bd84eb8d830bede7" };
    });
    await Listing.insertMany(updatedData);
    console.log("Data initialized");
  } catch (err) {
    console.error("Error initializing data:", err);
  }
};

const start = async () => {
  try {
    await db_connect();
    console.log("Connection successful");
    await initData();
  } catch (err) {
    console.error("Error connecting to database or initializing data:", err);
  }
};

start();
