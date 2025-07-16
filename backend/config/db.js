const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

const connectToDB = ()=>{
  mongoose.connect(process.env.MONGODB_URL) 
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });
}

module.exports = connectToDB;