const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

// Contact routes
router.get("/contact-user-page", contactController.getContactPage);
router.post("/contact-user-page", contactController.postContact);

module.exports = router;