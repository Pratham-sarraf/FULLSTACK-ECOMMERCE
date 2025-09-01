const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcryptjs"); // Add bcrypt for password comparison

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      console.log('Attempting login for:', username);
      
      // Find user by username only (don't include password in query)
      const user = await User.findOne({ username });
      
      if (!user) {
        console.log('User not found:', username);
        return done(null, false, { message: "Incorrect username." });
      }
      
      // Compare password using bcrypt
      console.log('Comparing passwords...');
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        console.log('Password incorrect for user:', username);
        return done(null, false, { message: "Incorrect password." });
      }
      
      console.log('Login successful for:', username);
      return done(null, user);
    } catch (err) {
      console.error('Authentication error:', err);
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;