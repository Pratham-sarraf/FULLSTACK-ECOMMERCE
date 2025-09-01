const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  address: [{ 
    houseNo: String, street: String, city: String, country: String, pincode: String, saveAs: String 
  }],
  orders: { type: Number, default: 0 }
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
