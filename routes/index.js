const express = require("express");
const models = require("../models");
const passport = require("passport");
const flash = require("connect-flash");
const router = express.Router();
const format = /[ ~#$%^&*()+\=\[\]{};':"\\|,.<>\/?]/;

router.get("/", (req, res) => {
   res.render("landing");
});

// LOGIN ROUTES

router.get("/login", (req, res) => {
   res.render("login");
});

router.post("/login", 
   passport.authenticate("local", {
      successRedirect: "/products", 
      failureRedirect: "back"
   }), (req, res) => {
});

router.get("/logout", (req, res) => {
   req.logout();
   res.redirect("/products");
});

//SIGNUP ROUTES

router.get("/signup", (req, res) => {
   res.render("signup");
});

router.post("/signup", (req, res) => {
   var newUser = req.body;
   if (newUser.password == newUser.confirmPassword && newUser.password.length >= 8 && !(format.test(newUser.password))) {
      return models.User.register({
         lastname: newUser.lastname,
         firstname: newUser.firstname,
         gender: newUser.gender,
         email: newUser.email,
         username: newUser.username
       }, newUser.password).then(user => {
         user.save();
         passport.authenticate("local")(req,res, () => {
           return res.redirect("/products");
         })
       }).catch(e => {
         return res.redirect("back")
       });
   }
});

router.get("/forgot-password", (req, res) => {
   res.render("forgot-password");
});

router.get("/user/:user_id", (req, res) => {
   const user_id = req.params.user_id;
   if (req.user == undefined || user_id != req.user.id) {
      return res.redirect("back");
   }

   models.User.findById({_id: user_id})
      .then(foundUser => {
         models.Product.find({author: foundUser})
         .then((foundProducts) =>{
            foundUser.numOfProducts = foundProducts.length
            res.render("user", {foundUser});
         })
      }).catch(err => res.send(err));
});

router.get("*", (req, res) => {
   res.send("404 Page NOT found!");
})

module.exports = router;