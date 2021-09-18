require("dotenv").config();

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const mainRoutes = require("./js/routes/main");
const passwordRoutes = require("./js/routes/password");

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

require("./js/auth/auth"); // Any code in there will be loaded and ran
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

app.listen(port, () => {
  console.log(`We are live! ${port}`);
});
