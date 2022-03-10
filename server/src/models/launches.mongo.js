const mongoose = require("mongoose");

const launchesSchema = new mongoose.Schema({
  flightNumber: { type: Number, required: true },
  mission: { type: String, required: true },
  rocket: { type: String, required: true },
  launchDate: { type: Date, required: true },
  target: { type: String, required: true },
  customers: [String],
  upcoming: { type: Boolean, required: true, default: true },
  success: { type: Boolean, required: true, default: true },
});

// where Launch is the singular collection that the model represents
// connects launchesSchema with the "launches" collection
module.exports = mongoose.model("Launch", launchesSchema);
