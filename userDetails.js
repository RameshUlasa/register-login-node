const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
  },
  {
    collection: "UserDetails",
  }
);

mongoose.model("UserDetails", userDetailsSchema);
