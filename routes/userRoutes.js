const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// User routes
router.get("/user-profile", userController.getProfile);
router.put("/update-profile", userController.updateProfile);
router.post("/products/all-products/save-address", userController.saveAddress);
router.get("/dashboard", userController.getDashboard);

module.exports = router;