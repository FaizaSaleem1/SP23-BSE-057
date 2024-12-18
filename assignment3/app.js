
const express = require("express");

const expresslayouts= require("express-ejs-layouts");
const app = express();


// Middleware
app.set("view engine", "ejs");
app.set("layout","layout");
app.use(expresslayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    res.render('index', { title: 'Excellent Courier Services' });
});

app.listen(3000,(req,res)=>{
    console.log("server connected at port 3000");
})