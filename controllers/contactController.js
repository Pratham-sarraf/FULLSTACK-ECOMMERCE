const contactUs = require("../models/contactUs");

const contactController = {
  // GET /contact-user-page
  getContactPage: (req, res) => {
    res.render("contact-user-page");
  },

  // POST /contact-user-page
  postContact: async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      // Validate input
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
          success: false, 
          message: "All fields are required." 
        });
      }

      const c = new contactUs({
        name,
        email,
        subject,
        message,
      });

      await c.save();
      res.redirect("/contact-user-page");

    } catch (err) {
      console.error("Error saving contact message:", err);
      res.status(500).json({ 
        success: false, 
        message: "Failed to send message. Please try again later." 
      });
    }
  }
};

module.exports = contactController;