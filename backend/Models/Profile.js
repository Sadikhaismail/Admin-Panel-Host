const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
  },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["Success", "Processing", "Failed"], 
    default: "Processing"  
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Profile", ProfileSchema);