const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const models = require("../models")

function isLoggedIn(req, res, next) {
   if(req.isAuthenticated()){
      return next();
   }
   req.flash("error", "You need to be logged in to do that!");
   res.redirect("/login")
}

// Setting storage engine
const storage = multer.diskStorage({
   destination: "./public/uploads/product-images/",
   filename: function(req, file, cb){
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
   }
});

// Init upload
const upload = multer({
   storage: storage,
   fileFilter: function(req, file, cb){
      checkFileType(file, cb);
   }
}).single("productImage");

function checkFileType(file, cb){
   // Allowed ext
   const filetypes = /jpeg|jpg|png|gif/;
   // Check ext
   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
   // Check mime
   const mimetype = filetypes.test(file.mimetype);
 
   if(mimetype && extname){
     return cb(null,true);
   } else {
     cb('Error: Images Only!');
   }
 }
 

router.get("/", (req, res) => {
   models.Product.find({})
      .then(products => {
         res.render("products", {products: [...products]});
      })
});

router.get("/new", isLoggedIn, (req, res) => {
   const categories = [];
   models.Product.distinct("category")
      .then(foundCategories => {
         categories.push(...foundCategories);
         res.render("products/new", {categories: categories});
      }).catch(err => res.send(err))
});

router.post("/", (req, res) => {
   upload(req, res, (err) => {
      var product = req.body;
      product.author = req.user;
      product.image = req.file.filename;
      if(err) {
         // Tell something's wrong
         res.redirect("back")
      } else {
         if (req.file == undefined) {
            // Tell that nothing has been selected
            res.redirect("back");
         } else {
            models.Product
            .create({...product})
            .then(newProduct => {
               res.redirect("/products");
            })
            .catch(err => {
               // Send an error message!!!
               res.redirect("back");
            });
         }
      }
   })
});

module.exports = router;