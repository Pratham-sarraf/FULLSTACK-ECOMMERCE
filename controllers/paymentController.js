const paymentController = {
  // GET /products/all-products/payment
  getPaymentPage: async (req, res) => {
    try {
      const amount = req.query.amount ? parseInt(req.query.amount) : 0;
      
      if (isNaN(amount) || amount <= 0) {
        return res.redirect('/cart');
      }
      
      let user = req.user || {};
      
      res.render('buy', {
        key: process.env.STRIPE_PUBLISHABLE_KEY,
        amount: amount,
        user: user
      });
    } catch (error) {
      console.error("Render Error:", error.message);
      res.status(500).send("Something went wrong!");
    }
  },

  // POST /payment
  processPayment: async (req, res) => {
    try {
      const { amount, stripeToken } = req.body;

      // Initialize Stripe here to ensure env variables are loaded
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

      const customer = await stripe.customers.create({
        email: 'test@example.com',
        source: stripeToken,
        name: 'Pratham Sarraf',
        address: {
          line1: '115, Vikas Nagar',
          postal_code: '281001',
          city: 'Mathura',
          state: 'Uttar Pradesh',
          country: 'India',
        }
      });

      await stripe.charges.create({
        amount: parseInt(amount),
        description: "Product",
        currency: 'INR',
        customer: customer.id
      });

      res.redirect('/success');
    } catch (error) {
      console.error("Payment Error:", error.message);
      res.redirect('/failure');
    }
  },

  // GET /success
  getSuccess: (req, res) => {
    res.render("success.ejs");
  },

  // GET /failure
  getFailure: (req, res) => {
    res.send("<h1>❌ Payment Failed</h1><a href='/'>Try Again</a>");
  }
};

module.exports = paymentController;