const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const isLogin = require('../middleware/isLogin');
const isAdmin = require('../middleware/isAdmin');

// Product routes
router.get('/', productController.getHomePage);
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductDetail);
router.post('/products/:id/review', isLogin, productController.addReview);
router.post('/products/:productId/reviews/:reviewId/delete', isLogin, productController.deleteReview);
router.post('/products/:id/add-to-cart', isLogin, productController.addToCart);
router.post('/update-cart', isLogin, productController.updateCart);
router.get('/products/all-products', isLogin, productController.getUserOrders);
router.post('/products/all-products/save-address', isLogin, productController.saveAddress);
router.post('/buy/:productId', isLogin, productController.buyProduct);

// Admin product management
router.get('/admin/add-product', isLogin, isAdmin, productController.getAddProductForm);
router.post('/admin/add-product', isLogin, isAdmin, productController.addProduct);
router.delete('/products/delete/:productId', isLogin, isAdmin, productController.deleteProduct);

module.exports = router;