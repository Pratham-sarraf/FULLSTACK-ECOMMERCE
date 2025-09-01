const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Authentication routes
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);
router.get("/logout", authController.logout);
router.get("/error", authController.getError);

module.exports = router;