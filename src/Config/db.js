const mongoose = require("mongoose");
require('dotenv').config()
const ConnectedDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}
module.exports = ConnectedDb;