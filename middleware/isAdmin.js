module.exports = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.status(403).render('error', { errorMessage: "Access denied. Admin privileges required." });
};