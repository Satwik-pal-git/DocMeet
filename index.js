const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
// const ejs = require("ejs");
const dotenv = require("dotenv");
const morgan = require("morgan");
const passport = require("passport");
const { ensureAuth, ensureGuest } = require("./middleware/auth");
const { login } = require("./controller/login");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
require("./config/passport")(passport);
const appointmentRoute = require("./routes/appointmentRoute");
const profileRoute = require("./routes/profileRoute");
const dashboardRoute = require("./routes/dashRoute");
const calorieRoute = require("./routes/calorieRoute");
const diseaseRoute = require("./routes/diseaseRoute");
const adminRoute = require("./routes/adminRoute");

dotenv.config({ path: "./config/config.env" });

//connecting to database from ./config/db.js
connectDB();
const app = express();
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//comment below line to avoid logs in console
app.use(morgan("dev"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

// app.use(expressLayout);
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");



app.use(passport.initialize());
app.use(passport.session());

app.use("/", require("./routes/auth"));
app.use("/appointment", ensureAuth, appointmentRoute);
app.use("/profile", ensureAuth, profileRoute);
app.use("/dashboard", ensureAuth, dashboardRoute);
app.use("/calorie_tracker", ensureAuth, calorieRoute);
app.use("/disease", ensureAuth, diseaseRoute);
app.use("/admin", adminRoute);


const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server running on ${PORT}`));
