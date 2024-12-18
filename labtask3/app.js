const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const adminRoutes = require("./routes/admin");
const path = require("path");

// Middleware & settings
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);
app.use(express.static("public"));
app.set("layout",false);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
 app.use("/admin", adminRoutes);
 app.get("/", (req, res) => res.redirect("/admin")); // Redirect to the Admin Panel


// MongoDB connection
const connectionString = "mongodb://localhost:27017/labtask3";
mongoose.connect(connectionString);
  
// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));

