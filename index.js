require("dotenv").config();

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const mainRoutes = require("./server/routes/main");
const passwordRoutes = require("./server/routes/password");

// Setup DB
const uri = process.env.MONGO_CONNECTION_URL;
const mongoConfig = {
  useNewUrlParser: true,
};

console.log("PROO: ", process.env.MONGO_USER_NAME);
console.log("PROO: ", process.env.MONGO_PASSWORD);
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

require("./server/auth/auth"); // Any code in there will be loaded and ran
// Passport straetches are avail

// Setup routes
app.use("/", mainRoutes);
app.use("/", passwordRoutes);

// Catch all
app.use((req, res) => {
  res.status(404).json({ message: "404", status: 404 });
});

// Errors
app.use((err, req, res) => {
  res.status(err.status || 500).json({ message: "500", status: 500 });
});

mongoose.connection.on("connected", () => {
  console.log("COnnected to mongoo");
  app.listen(port, () => {
    console.log(`We are live! ${port}`);
  });
});
