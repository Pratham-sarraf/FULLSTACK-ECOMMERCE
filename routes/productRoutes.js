const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const isLogin = require("../middleware/isLogin");

// Product routes
router.get("/", productController.getHome);
router.get("/api/products", productController.getProductsAPI);
router.get("/products", productController.getProducts);
router.get("/products/all-products", productController.getUserProducts);
router.get("/products/practice", productController.getPracticeProducts);
router.get("/products/:id", productController.getProductDetail);

// Cart and purchase routes
router.post("/products/:id/add-to-cart", isLogin, productController.addToCart);
router.post("/update-cart", productController.updateCart);
router.post("/buy/:productId", isLogin, productController.buyProduct);

// Review routes
router.post("/products/:id/review", isLogin, productController.addReview);
router.post("/products/:productId/reviews/:reviewId/delete", productController.deleteReview);

// Product deletion route
router.delete("/products/delete/:productId", productController.deleteProduct);

module.exports = router;