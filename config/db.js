const mongoose = require("mongoose");
require("dotenv").config();

async function db_connect() {
  const url = "mongodb://127.0.0.1:27017/wanderlust";
  // console.log(process.env.DATABASE_URL);
  await mongoose.connect(url);
}

db_connect();
module.exports = db_connect;
