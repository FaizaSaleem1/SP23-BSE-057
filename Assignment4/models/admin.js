const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // For hashing passwords

// Admin Schema
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate emails
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin", // Default role is admin
  },
  name: {
    type: String,
    required: true,
  },
});

// Hash the password before saving it to the database
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Hash password with 10 rounds
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare input password with the hashed password
adminSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

// Create and export the Admin model
const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
