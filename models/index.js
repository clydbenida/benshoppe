const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;
const models = {};
mongoose.connect("mongodb://localhost:27017/benshoppe", {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true});

var userSchema = new mongoose.Schema({
   lastname: {
      type: String,
      required: true
   },
   firstname: {
      type: String,
      required: true
   },
   gender: {
      type: String
   },
   email: {
      type: String,
      unique: true,
      required: true
   },
   password: {
      type: String
   },
   membership: {
      type: String,
      default: "free",
      required: true
   }
})

userSchema.plugin(passportLocalMongoose);

// super user - "do's deleting users, moderating users, deleting products, checking products"
//    login
//       username
//       password
//    log

// logs - "contains last logged in, activities (deleting user, moderating users, etc)"
//    user
//    desc
//    date time

var superUserSchema = new mongoose.Schema({
   username: {
      type: String,
      required: true
   },
   password: {
      type: String
   },
   logs: {
      type: Schema.Types.ObjectId,
      ref: "Logs"
   }
});

superUserSchema.plugin(passportLocalMongoose);
models.SuperUser = mongoose.model("Super", superUserSchema);

var logSchema = new mongoose.Schema({
   description: {
      type: String,
      required: true
   },
   date: {
      type: Date
   },
   user: {
      type: Schema.Types.ObjectId,
      ref: "Super"
   }
});

models.Logs = mongoose.model("Log", logSchema)

var productSchema = new mongoose.Schema({
   productName: {
      type: String,
      required: true
   },
   productDesc: {
      type: String,
      required: true
   },
   category: {
      type: String,
      required: true
   },
   quantity: {
      type: Number,
      default: 0,
      min: 0
   },
   price: {
      type: Number,
      required: true,
      min: 0
   },
   discount: {
      type: Number,
      required: false,
      min: 0,
      max: 100
   },
   author: {
      type: Schema.Types.ObjectId,
      ref: "User"
   },
   image: {
      type: String
   }
});

models.User = mongoose.model("User", userSchema);
models.Product = mongoose.model("Product", productSchema);

module.exports = models;