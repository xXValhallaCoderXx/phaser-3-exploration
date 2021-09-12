const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hellsso");
});

app.get("/status", (req, res) => {
  res.status(200).json({ message: "ok", status: 200 });
});

app.post("/signup", (req, res, next) => {
  if (!req.body) {
    res.status(400).json({ message: "invalid", status: 400 });
  }
  res.status(200).json({ message: "ok", status: 200 });
});

app.post("/login", (req, res) => {
  res.status(200).json({ message: "ok", status: 200 });
});

app.post("/logout", (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: "invalid", status: 400 });
  }
  res.status(200).json({ message: "ok", status: 200 });
});

app.post("/token", (req, res) => {
  if (!req.body || !req.body.refreshToken) {
    res.status(400).json({ message: "invalid", status: 400 });
  } else {
    const { refreshToken } = req.body;
    res
      .status(200)
      .json({ message: `refresh req ${refreshToken}`, status: 200 });
  }
});

app.post("/forgot-password", (req, res) => {
  if (!req.body || !req.body.email) {
    res.status(400).json({ message: "invalid", status: 400 });
  } else {
    const { email } = req.body;
    res.status(200).json({ message: `email for ${email}`, status: 200 });
  }
});

app.post("/reset-password", (req, res, next) => {
  if (!req.body || !req.body.password) {
    res.status(400).json({ message: "invalid", status: 400 });
  } else {
    const { password } = req.body;
    res.status(200).json({ message: `password for ${password}`, status: 200 });
  }
});

// Catch all
app.use((req, res) => {
  res.status(404).json({ message: "404", status: 404 });
});

app.use((err, req, res) => {
  res.status(err.status || 500).json({ message: "500", status: 500 });
});

app.listen(port, () => {
  console.log(`We are live! ${port}`);
});
