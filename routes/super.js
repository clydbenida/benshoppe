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

router.get("/register", (req, res) => {

});

router.get("/", (req, res) => {
   res.send("super");
});

router.post("/login", 
   passport.authenticate("local", {
      successRedirect: "/super/", 
      failureRedirect: "back"
   }), (req, res) => {
});

module.exports = router;