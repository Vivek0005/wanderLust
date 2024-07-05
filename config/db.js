const mongoose = require("mongoose");
require("dotenv").config();
const atlasUrl = process.env.ATLAS_URL;
const mongoUrl = process.env.MONGO_URL;

async function db_connect() {
  const url = mongoUrl;
  // console.log(process.env.DATABASE_URL);
  await mongoose.connect(url);
}

db_connect();
module.exports = db_connect;
