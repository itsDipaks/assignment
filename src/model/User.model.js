const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  creadtedat: { type: Date, default: Date.now() },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
  Verification_code: { type: String, default: null },
  is_verified: { type: Boolean, default: false },
  token: { type: String, required: true },
  apikey: { type: String, required: true },
});

const User = mongoose.model("user", userSchema);
module.exports = User;
