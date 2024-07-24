const mongoose = require("mongoose");
require("dotenv").config();
const atlasUrl = process.env.ATLAS_URL;
// const mongoUrl = process.env.MONGO_URL;

async function db_connect() {
  // const url = mongoUrl;
  // console.log(url);
  await mongoose.connect(atlasUrl);
}

db_connect();
module.exports = db_connect;
