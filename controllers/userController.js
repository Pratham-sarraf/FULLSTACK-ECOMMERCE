const bcrypt = require("bcrypt");
const User = require("../models/user");

const userController = {
  // GET /user-profile
  getProfile: (req, res) => {
    res.render('user-profile', { user: req.user });
  },

  // PUT /update-profile
  updateProfile: async (req, res) => {
    const { username, password } = req.body;

    try {
      const userId = req.user._id;
      if (!userId) {
        return res.status(400).json({ message: "User not found or unauthorized." });
      }

      // Prepare update object
      const updateData = { username };

      // Only hash and update password if it's provided
      if (password && password.trim() !== '') {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(password, saltRounds);
      }

      await User.findByIdAndUpdate(userId, updateData);
      
      res.json({ message: "Profile updated successfully!" });

    } catch (err) {
      console.error("Error updating profile:", err);
      res.status(500).json({ message: "Update failed: " + err.message });
    }
  },

  // POST /products/all-products/save-address
  saveAddress: async (req, res) => {
    const { houseNo, street, city, country, pincode, saveAs } = req.body;

    try {
      const user = await User.findById(req.user._id);
      const newAddress = { houseNo, street, city, country, pincode, saveAs };

      user.address.push(newAddress);
      await user.save();

      res.redirect('/products/all-products');
    } catch (err) {
      console.error(err);
      res.status(500).send("Error saving address");
    }
  },

  // GET /dashboard
  getDashboard: (req, res) => {
    res.send("WELCOME TO DASHBOARD");
  }
};

module.exports = userController;