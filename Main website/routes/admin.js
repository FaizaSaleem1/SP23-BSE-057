const express = require("express");
const router = express.Router();


let multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory to store files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});
const upload = multer({ storage: storage });
const fs = require("fs");
const path = require("path");


const Product = require("../models/product");
const Category = require("../models/category");
const Order = require("../models/order");
const cart= require("../models/cart");

                                           //  PRODUCT ROUTES

// READ:

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = 3; 
    const skip = (page - 1) * limit; 
    const search = req.query.search || ""; 
    const filter = req.query.filter || 'name'; 

    const query = search
      ? { [filter]: { $regex: search, $options: "i" } } 
      : {}; 

 
    const items = await Product.find(query).skip(skip).limit(limit);
    const totalItems = await Product.countDocuments(query); 
    const totalPages = Math.ceil(totalItems / limit);

    res.render("read", {
      items,
      page,
      totalPages,
      search,
      filter, 
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).send("Error fetching products");
  }
});


// CREATE:
router.get("/create", (req, res) => {
  res.render("create", { error: null });
});

router.post("/create", upload.single("file"),async (req, res) => {
  try{
  const { name, price, description } = req.body;
  const picture = req.file ? req.file.path:null ;
 

  const product= new Product({ name, description,price, picture });
  await product.save();
  
 
    
    res.redirect("/admin"); 
  } catch (error) {
    console.error("Error saving item:", error.message);
    res.status(500).render("create", { error: "Error saving item: " + error.message });
  }
});

// UPDATE: 
router.get("/edit/:id", async (req, res) => {
  try {
    const item = await Product.findById(req.params.id); 
    if (!item) {
      return res.status(404).send("Item not found");
    }
    res.render("edit", { item }); 
  } catch (error) {
    console.error("Error fetching item for editing:", error.message);
    res.status(500).send("Error fetching item for editing");
  }
});


router.post("/edit/:id", upload.single("file"),async (req, res) => {
  const { name, description } = req.body;
  const picture = req.file ? req.file.filename: null; 

  if (!name || !description || !picture) {
    return res.status(400).send("All fields are required");
  }

  try {
    await Product.findByIdAndUpdate(req.params.id, { name, description,picture }, { new: true }); // Update item
    res.redirect("/admin"); 
  } catch (error) {
    console.error("Error updating item:", error.message);
    res.status(500).send("Error updating item: " + error.message);
  }
});

// DELETE:
router.post("/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id); 
    res.redirect("/admin"); 
  } catch (error) {
    console.error("Error deleting item:", error.message);
    res.status(500).send("Error deleting item: " + error.message);
  }
});








                                         // Categories Routes

// READ: 

router.get('/categories', async (req, res) => {
  const search = req.query.search || '';
  const filter = req.query.filter || 'name'; 
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 10;

  let categories = [];
  let totalCategories = 0;

  if (search) {
    
    const regex = new RegExp(search, 'i'); 
    categories = await Category.find({ [filter]: regex })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);
    totalCategories = await Category.countDocuments({ [filter]: regex });
  } else {
    categories = await Category.find()
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);
    totalCategories = await Category.countDocuments();
  }

  const totalPages = Math.ceil(totalCategories / itemsPerPage);

  res.render('categories/read', {
    categories,
    search,
    filter,
    page,
    totalPages,
    totalCategories
  });
});





// CREATE:
router.get("/categories/create", (req, res) => {
  res.render("categories/create", { error: null });
});


router.post("/categories/create", upload.single("file"), async (req, res) => {
  try {
    const { name, description } = req.body;
    const picture = req.file ? req.file.path : null;

   
    const category = new Category({ name, description, picture });
    await category.save();

  
    res.redirect("/admin/categories");
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).send("Internal Server Error");
  }
});


// UPDATE: 
router.get("/categories/edit/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.render("categories/edit", { category });
  } catch (error) {
    console.error("Error fetching category for editing:", error.message);
    res.status(500).send("Error fetching category for editing");
  }
});

router.post("/categories/edit/:id", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

 
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send("Category not found");
    }

  
    if (req.file) {
    
      if (category.picture && fs.existsSync(category.picture)) {
        fs.unlinkSync(category.picture);
      }
      category.picture = req.file.path; 
    }

    category.name = name;
    category.description = description;
     await category.save();
     res.redirect("/admin/categories");
  } catch (error) {
    console.error("Error editing category:", error);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE: 
router.post("/categories/delete/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect("/admin/categories");
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).send("Error deleting category: " + error.message);
  }
});




router.get("/order", async (req,res)=>{
  res.render("index")

})

// Route to handle order placement
router.post("/place-order", async (req, res) => {
  const { customerInfo, cartItems, total } = req.body;

  try {
      // Create a new order
      const newOrder = new Order({
          customerInfo,
          items: cartItems,
          total,
      });

      // Save the order to the database
      await newOrder.save();

      res.status(200).json({ message: "Order placed successfully!", orderId: newOrder._id });
  } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ message: "Failed to place the order." });
  }
});










module.exports = router;
