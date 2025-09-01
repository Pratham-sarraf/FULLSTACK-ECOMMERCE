const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Payment routes
router.get("/products/all-products/payment", paymentController.getPaymentPage);
router.post("/payment", paymentController.processPayment);
router.get("/success", paymentController.getSuccess);
router.get("/failure", paymentController.getFailure);

module.exports = router;