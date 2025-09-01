const mongoose = require("mongoose");
const ExcelJS = require('exceljs');
const Product = require("../models/product");
const User = require("../models/user");
const contactUs = require("../models/contactUs");

const adminController = {
  // GET /admin
  getDashboard: async (req, res) => {
    try {
      // Total users
      const totalUsers = await User.countDocuments() - 1;

      // Total products
      const totalProducts = await Product.countDocuments();

      // Total sales (sum of all orders)
      const users = await User.find({}).populate('products').exec();

      let totalSales = 0;
      users.forEach(user => {
        if (user.products && user.products.length > 0) {
          const userTotal = user.products.reduce((sum, product) => {
            return sum + (product.price || 0);
          }, 0);
          totalSales += userTotal;
        }
      });

      let totalSuggestions = await contactUs.countDocuments();

      res.render("admin", {
        totalUsers,
        totalProducts,
        totalSales,
        totalSuggestions
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  },

  // GET /admin/add-product
  getAddProduct: (req, res) => {
    res.render("add-product");
  },

  // POST /admin/add-product
  postAddProduct: async (req, res) => {
    const { name, price, url } = req.body;

    try {
      const newProduct = new Product({ name, price, url });
      await newProduct.save();
      res.status(201).json({ message: "Product saved successfully", product: newProduct });
    } catch (error) {
      console.error("Error saving product:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // GET /admin/users
  getUsers: async (req, res) => {
    try {
      const allUsers = await User.find();
      res.render('user-display', { users: allUsers });
    } catch (err) {
      console.error(err);
      res.send('Error loading users');
    }
  },

  // GET /admin/products
  getProducts: (req, res) => {
    res.redirect("/products");
  },

  // GET /admin/user/:id/admin-user-display
  getUserDetail: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).populate("products");

      if (!user) return res.status(404).send("User not found");

      // Count product quantities
      const productQuantities = {};
      user.products.forEach(product => {
        const productId = product._id.toString();
        productQuantities[productId] = (productQuantities[productId] || 0) + 1;
      });

      // Get unique products with quantities
      const uniqueProducts = [];
      const seenProducts = new Set();
      
      user.products.forEach(product => {
        const productId = product._id.toString();
        if (!seenProducts.has(productId)) {
          seenProducts.add(productId);
          uniqueProducts.push({
            ...product.toObject(),
            quantity: productQuantities[productId]
          });
        }
      });

      res.render("admin-user-display", { 
        user,
        products: uniqueProducts 
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },

  // POST /admin/users/:id/toggle-admin
  toggleAdmin: async (req, res) => {
    try {
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      
      const userId = req.params.id;
      const { isAdmin } = req.body;
      
      const updatedUser = await User.findByIdAndUpdate(
        userId, 
        { isAdmin: isAdmin },
        { new: true }
      );
      
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const message = isAdmin ? "User made admin" : "User removed from admin";
      
      res.json({ 
        success: true, 
        message: message,
        user: updatedUser 
      });
    } catch (error) {
      console.error('Error updating admin status:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  // POST /admin/delete-all-users
  deleteAllUsers: async (req, res) => {
    try {
      await User.deleteMany({});
      res.redirect("/admin/users");
    } catch (err) {
      console.error("Error deleting users:", err);
      res.status(500).send("Server error");
    }
  },

  // POST /admin/delete-user/:id
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send("User not found.");
      }

      await User.findByIdAndDelete(userId);
      res.redirect("/admin/users");

    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).send("Internal Server Error");
    }
  },

  // GET /admin/contact-us
  getContactSubmissions: async (req, res) => {
    try {
      const contacts = await contactUs.find().sort({ createdAt: -1 });
      res.render("admin-suggestion-display", { contacts });
    } catch (err) {
      console.error("Error fetching contact submissions for admin page:", err);
      res.status(500).send("An error occurred while fetching contact submissions. Please check server logs.");
    }
  },

  // DELETE /admin/contact-us/:id
  deleteContactSubmission: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await contactUs.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ message: "Contact not found" });
      }

      res.send("done");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // GET /admin/download-users
  downloadUsers: async (req, res) => {
    try {
      const users = await User.find({}).populate('products');

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Users');

      // Define columns
      worksheet.columns = [
        { header: 'Username', key: 'username', width: 25 },
        { header: 'Products', key: 'products', width: 80 },
        { header: 'Addresses', key: 'address', width: 220 }
      ];

      // Add rows
      users.forEach(user => {
        const productsString = (user.products || [])
          .map(p => (p && p.name) ? p.name : p ? p._id.toString() : '')
          .join(', ');

        const addressesString = (user.address || []).map(addr => {
          const parts = [];
          if (addr.saveAs) parts.push(`Save As: ${addr.saveAs}`);
          if (addr.houseNo) parts.push(`House No: ${addr.houseNo}`);
          if (addr.street) parts.push(`Street: ${addr.street}`);
          if (addr.city) parts.push(`City: ${addr.city}`);
          if (addr.country) parts.push(`Country: ${addr.country}`);
          if (addr.pincode) parts.push(`Pincode: ${addr.pincode}`);
          return parts.join(', ');
        }).join('\n');

        worksheet.addRow({
          username: user.username,
          products: productsString,
          address: addressesString
        });
      });

      // Set headers for Excel download
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=users.xlsx'
      );

      await workbook.xlsx.write(res);
      res.status(200).end();

    } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).send('Error generating Excel file. Please check server logs.');
    }
  }
};

module.exports = adminController;