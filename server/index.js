require("dotenv").config();

const cors = require("cors");
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const mainRoutes = require("./routes/main");
const passwordRoutes = require("./routes/password");
const secureRoutes = require("./routes/secure");

// Setup DB
const uri = process.env.MONGO_CONNECTION_URL;
const mongoConfig = {
  useNewUrlParser: true,
};

mongoose.connect(uri, mongoConfig);

mongoose.connection.on("error", (err) => {
  console.log("ERROR: ", err);
  // If DB connection error - KIll App
  process.exit(1);
});

const app = express();
const port = process.env.PORT || 3000;
// Dfine BP Before routes - update express settings
app.use(bodyParser.urlencoded({ extended: false })); // Prase application/x-www-form-urlencoded data
app.use(bodyParser.json()); // Parse application/json

app.use(cookieParser()); //
app.use(
  cors({
    credentials: true, // Allow access-control-allow-credentials header for auth
    origin: process.env.CORS_ORIGIN,
  })
);

require("./auth/auth"); // Any code in there will be loaded and ran
// Passport straetches are avail

// Setup routes
app.use("/", mainRoutes);
app.use("/", passwordRoutes);
app.use("/", passport.authenticate("jwt", { session: false }), secureRoutes);

// Catch all
app.use((req, res) => {
  res.status(404).json({ message: "404", status: 404 });
});

// Errors
app.use((error, request, response, next) => {
  console.log(error);
  response
    .status(error.status || 500)
    .json({ error: error.message, status: 500 });
});

mongoose.connection.on("connected", () => {
  console.log("Connected to mongoo");
  app.listen(port, () => {
    console.log(`We are live on! ${port}`);
  });
});
