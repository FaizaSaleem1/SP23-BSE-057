
const express = require("express");
const expresslayouts= require("express-ejs-layouts");
const app = express();
const mongoose = require("mongoose");
const adminRoutes = require("./routes/admin");
const path = require("path");
const cookie = require("cookie-parser");
const product = require("./models/product");



// Middleware
app.set("view engine", "ejs");
app.set("layout","layout");
app.use(expresslayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookie);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
app.use("/admin", adminRoutes);

app.get('/', (req, res) => {
    res.render('index', { title: 'Excellent Courier Services' });
});
app.get("/",(req,res)=>{res.redirect("/admin")})



const connectionString = "mongodb://localhost:27017/mainwebsite";
mongoose.connect(connectionString);

app.listen(3000,(req,res)=>{
    console.log("server connected at port 3000");
})