const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authController = {
  // GET /login
  getLogin: (req, res) => {
    res.render("login");
  },

  // POST /login
  postLogin: (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.redirect("/error");

      req.logIn(user, (err) => {
        if (err) return next(err);

        // Check if user is admin
        if (user.isAdmin) {
          return res.redirect("/admin");
        } else {
          return res.redirect("/products");
        }
      });
    })(req, res, next);
  },

  // GET /register
  getRegister: (req, res) => {
    res.render("register");
  },

  // POST /register
  postRegister: async (req, res) => {
    const { username, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).send("User already exists");
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new User({ 
        username, 
        password: hashedPassword 
      });
      
      await newUser.save();
      res.redirect("/login");
    } catch (err) {
      console.error(err);
      res.status(500).send("Something went wrong");
    }
  },

  // GET /logout
  logout: (req, res, next) => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  },

  // GET /error
  getError: (req, res) => {
    res.render("error", { errorMessage: "ERROR OCCURRED" });
  }
};

module.exports = authController;