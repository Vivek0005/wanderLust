const mongoose = require("mongoose");
const Listing = require("../models/listing"); // Adjust the path if necessary
const User = require("../models/user"); // Adjust the path if necessary
const db_connection = require("../config/db.js");
require("dotenv").config();

const reinitialize = async () => { 
  try {
    // Find all listings
    const listings = await Listing.find({});

    // Iterate through each listing
    for (const listing of listings) {
      if (listing.owner) {
        // Find the user who owns the listing
        const user = await User.findById(listing.owner);

        if (user) {
          // Add the listing to the user's listings array if not already present
          if (!user.listings.includes(listing._id)) {
            user.listings.push(listing._id);
            await user.save();
            console.log(`Updated user ${user._id} with listing ${listing._id}`);
          }
        }
      }
    }

    console.log("All listings have been processed and users updated.");
  } catch (error) {
    console.error("Error updating users with listings:", error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

// Connect to the database and then run the reinitialize function
db_connection()
  .then(() => {
    reinitialize();
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
