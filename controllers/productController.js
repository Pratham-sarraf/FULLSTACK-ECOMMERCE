const mongoose = require("mongoose");
const Product = require("../models/product");
const User = require("../models/user");
const Review = require("../models/review");

const productController = {
  // GET / (Home page)
  getHome: async (req, res) => {
    try {
      const products = await Product.find();
      res.render("home-page", { products });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  },

  // GET /api/products (API endpoint)
  getProductsAPI: async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server Error" });
    }
  },

  // GET /products
  getProducts: async (req, res) => {
    try {
      const sortParam = req.query.sort;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;
      const skip = (page - 1) * limit;
      const searchQuery = req.query.search;

      let sortQuery = {};
      let findQuery = {};

      // Add search functionality
      if (searchQuery) {
        findQuery = {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { tags: { $regex: searchQuery, $options: 'i' } }
          ]
        };
      }

      if (sortParam === "price") {
        sortQuery = { price: 1 }; // Low to High
      } else if (sortParam === "name") {
        sortQuery = { name: 1 }; // A-Z
      }

      const totalProducts = await Product.countDocuments(findQuery);
      const totalPages = Math.ceil(totalProducts / limit);

      const products = await Product.find(findQuery)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit);

      res.render("products", {
        products,
        user: req.user,
        currentPage: page,
        totalPages,
        sort: sortParam || "",
        searchQuery: searchQuery || ""
      });
    } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).send("Something went wrong");
    }
  },

  // GET /products/:id (Product detail)
  getProductDetail: async (req, res) => {
    const productId = req.params.id;

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).send("Product not found");
      }

      const reviews = await Review.find({ _id: { $in: product.reviews } })
        .populate('user')
        .sort({ createdAt: -1 });

      const user = req.user;
      res.render('product-detail', { product, reviews, user });

    } catch (err) {
      console.error("Product detail error:", err);
      res.status(500).send("Server error");
    }
  },

  // POST /products/:id/add-to-cart
  addToCart: async (req, res) => {
    try {
      const userId = req.user._id;
      const productId = req.params.id;

      const user = await User.findById(userId);
      if (!user) return res.status(404).send("User not found");

      user.products.push(productId);
      await user.save();

      res.redirect(`/products/${productId}`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },


// POST /products/:id/review
addReview: async (req, res) => {
  try {
    const { review, rating } = req.body;
    const user = req.user;
    const productId = req.params.id;

    if (!user) return res.status(401).send("Please login to submit a review");
    if (!review || !rating) return res.status(400).send("Review and rating are required");
    if (rating < 1 || rating > 5) return res.status(400).send("Rating must be between 1 and 5");

    // Create the review with product field
    const newReview = await Review.create({
      review,
      rating: parseInt(rating),
      user: user._id,
      product: productId,  // <-- Add this
    });

    // Add review to product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send("Product not found");

    product.reviews.push(newReview._id);
    await product.save();

    res.redirect(`/products/${productId}`);
  } catch (err) {
    console.error("💥 Error posting review:", err);
    res.status(500).send(`Review submission failed: ${err.message}`);
  }
}
,

  // POST /products/:productId/reviews/:reviewId/delete
  deleteReview: async (req, res) => {
    try {
      const { productId, reviewId } = req.params;

      await Product.findByIdAndUpdate(productId, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);

      res.redirect(`/products/${productId}`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  },

  // DELETE /products/delete/:productId
  deleteProduct: async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.productId);
      res.status(200).json({ message: "Product deleted successfully!" });
    } catch (err) {
      res.status(500).json({ error: "Error deleting product" });
    }
  },

  // GET /products/all-products (User's cart/orders)
  getUserProducts: async (req, res) => {
    try {
      const userProductIds = req.user?.products || [];

      if (userProductIds.length === 0) {
        return res.render("my-orders", { products: [], user: req.user });
      }

      // Count how many times each product appears (quantity)
      const productCounts = {};
      userProductIds.forEach(id => {
        const strId = id.toString();
        productCounts[strId] = (productCounts[strId] || 0) + 1;
      });

      // Fetch product details from DB
      const uniqueIds = Object.keys(productCounts).map(id => new mongoose.Types.ObjectId(id));
      const products = await Product.find({ _id: { $in: uniqueIds } });

      // Merge product data with counts
      const productsWithCounts = products.map(prod => ({
        ...prod.toObject(),
        count: productCounts[prod._id.toString()] || 0
      }));

      res.render("my-orders", { 
        products: productsWithCounts, 
        user: req.user,
        amount: 100,
        key: process.env.STRIPE_PUBLISHABLE_KEY 
      });

    } catch (err) {
      console.error("Error fetching user products:", err);
      res.status(500).send("Something went wrong");
    }
  },

  // POST /update-cart
  updateCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;

      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      // Remove all occurrences of that product
      req.user.products = req.user.products.filter(
        id => id.toString() !== productId
      );

      // Push productId 'quantity' times
      for (let i = 0; i < quantity; i++) {
        req.user.products.push(productId);
      }

      await req.user.save();
      res.json({ success: true });
    } catch (err) {
      console.error("Cart update error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  // GET /products/practice
  getPracticeProducts: async (req, res) => {
    try {
      const productIds = req.user?.products || [];
      const all_products = [];

      for (const id of productIds) {
        const obj = await Product.findById(id);
        if (obj) {
          all_products.push(obj);
        }
      }

      if (!productIds.length) {
        return res.render("practice-products", { products: [], user: req.user });
      }

      const result = await Product.aggregate([
        { $match: { name: "Slam-attax Rumble" } }
      ]);
      console.log(result);

      res.render("practice-products", {
        all_products,
        user: req.user
      });

    } catch (err) {
      console.error("Error loading practice products:", err);
      res.status(500).send("Something went wrong");
    }
  },

  // POST /buy/:productId
  buyProduct: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      user.orders += 1;
      await user.save();

      res.redirect(`/products/${req.params.productId}`);
    } catch (err) {
      res.status(500).send("Something went wrong!");
    }
  }
};

module.exports = productController;