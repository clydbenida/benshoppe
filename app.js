const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const path = require("path");

const models = require("./models");
const indexRoutes = require("./routes");
const productRoutes = require("./routes/products");
const superRoutes = require("./routes/super");
const app = express();

app.use(flash());
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Passport and session configuration
app.use(require("express-session")({
   secret: "some secret random token",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(models.User.authenticate()));
passport.serializeUser(models.User.serializeUser());
passport.deserializeUser(models.User.deserializeUser());
passport.use(new LocalStrategy(models.SuperUser.authenticate()));
passport.serializeUser(models.SuperUser.serializeUser());
passport.deserializeUser(models.SuperUser.deserializeUser());

// Middleware to pass currentUser data to views (MUST BE DECLARED AFTER PASSPORT CONFIG)
app.use((req, res, next) => {
   res.locals.currentUser = req.user;
   next();
})

// ROUTES
app.use('/products', productRoutes);
app.use('/super', superRoutes);
app.use(indexRoutes);

app.listen(3000, () => {
   console.log("Listening on port 3000");
});