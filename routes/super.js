const express = require("express");
const router = express.Router();
const models = require("../models");
const passport = require("passport");

models.SuperUser.register({
   username: "user"
}, "password" ).then(user => {
   user.save();
}).catch(e => {
   return e
});

router.get("/login", (req, res) => {
   res.render("super/login");
});

router.get("/", (req, res) => {
   res.redirect("/login");
})

router.get("/dashboard", (req, res) => {
   res.send("super dashboard");
});

router.post("/login", 
   passport.authenticate("local", {
      successRedirect: "/super/dashboard", 
      failureRedirect: "back"
   }), (req, res) => {
});

module.exports = router;