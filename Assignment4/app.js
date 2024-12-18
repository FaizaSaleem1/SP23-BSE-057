const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const adminRoutes = require("./routes/admin");
const path = require("path");


const app = express();



// Middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/yourDatabaseName", {
  
})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/admin",adminRoutes);

// Start Server
app.listen(7000, () => {
  console.log("Server is running on http://localhost:7000");
});
