const express = require("express");
const session = require('express-session'); 
const mongoose = require("mongoose");
require('dotenv').config(); // Load environment variables FIRST

const connectDB = require("./utils/db");
const MongoStore = require("connect-mongo");
const passport = require("passport");

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

const PORT = 3000;

// View engine setup
app.set("view engine", "ejs"); 

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
  },
  store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
    })
}));

// Passport configuration
require("./utils/passport");
app.use(passport.initialize());  
app.use(passport.session());

// Routes
app.use("/", authRoutes);
app.use("/", productRoutes);
app.use("/admin", adminRoutes);
app.use("/", userRoutes);
app.use("/", paymentRoutes);
app.use("/", contactRoutes);

// Start Server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ Server failed to start due to database error:", err);
  });