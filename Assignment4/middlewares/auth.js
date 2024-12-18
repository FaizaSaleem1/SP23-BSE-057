const jwt = require("jsonwebtoken");

// Authentication Middleware (check if the user is logged in)
const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }

  jwt.verify(token, "shhhhhh", (err, decoded) => {
    if (err) {
      return res.status(403).send("Forbidden: Invalid token");
    }
    req.user = decoded; // Store decoded user information
    next(); // Proceed to the next middleware/route handler
  });
};

// // Authorization Middleware (check if the user is an admin)
// const isAdmin = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     return next(); // User is an admin, proceed
//   }
//   return res.status(403).send("Forbidden: You do not have the required permissions");
// };

module.exports = { isAuthenticated };
