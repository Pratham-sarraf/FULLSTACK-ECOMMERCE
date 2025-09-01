const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const isLogin = require("../middleware/isLogin");
const isAdmin = require("../middleware/isAdmin");

// Admin dashboard
router.get("/", isLogin, isAdmin, adminController.getDashboard);

// Product management
router.get("/add-product", isLogin, isAdmin, adminController.getAddProduct);
router.post("/add-product", isLogin, isAdmin, adminController.postAddProduct);
router.get("/products", isLogin, isAdmin, adminController.getProducts);

// User management
router.get("/users", isLogin, isAdmin, adminController.getUsers);
router.get("/user/:id/admin-user-display", isLogin, isAdmin, adminController.getUserDetail);
router.post("/users/:id/toggle-admin", isLogin, isAdmin, adminController.toggleAdmin);
router.post("/delete-all-users", adminController.deleteAllUsers);
router.post("/delete-user/:id", adminController.deleteUser);

// Contact submissions management
router.get("/contact-us", isLogin, isAdmin, adminController.getContactSubmissions);
router.delete("/contact-us/:id", isLogin, isAdmin, adminController.deleteContactSubmission);

// Excel download
router.get("/download-users", adminController.downloadUsers);

module.exports = router;