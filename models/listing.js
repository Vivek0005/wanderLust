const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D00",
    set: (v) =>
      v
        ? v
        : "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D00",
  },
  price: {
    type: Number,
    min: 100,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Review"
  }]
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
