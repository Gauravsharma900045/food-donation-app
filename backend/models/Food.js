const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  foodType: String,
  quantity: String,
  location: String,
  pickupTime: String,
  category: { type: String, enum: ["veg", "non-veg", "both"], default: "veg" },
  status: { type: String, default: "available" },

  image: String, // ✅ IMAGE
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lat: { type: Number },
  lng: { type: Number }

}, { timestamps: true });

module.exports = mongoose.model("Food", FoodSchema);