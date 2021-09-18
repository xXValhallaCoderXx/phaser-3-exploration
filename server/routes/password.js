const express = require("express");
const router = express.Router();

router.post("/forgot-password", (req, res) => {
  if (!req.body || !req.body.email) {
    res.status(400).json({ message: "invalid", status: 400 });
  } else {
    const { email } = req.body;
    res.status(200).json({ message: `email for ${email}`, status: 200 });
  }
});

router.post("/reset-password", (req, res, next) => {
  if (!req.body || !req.body.password) {
    res.status(400).json({ message: "invalid", status: 400 });
  } else {
    const { password } = req.body;
    res.status(200).json({ message: `password for ${password}`, status: 200 });
  }
});

module.exports = router;
