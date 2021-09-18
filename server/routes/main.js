const passport = require("passport");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hellsso");
});

router.get("/status", (req, res) => {
  res.status(200).json({ message: "ok", status: 200 });
});

// Add passport route middleware
router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    console.log("hiu");
    res.status(200).json({ message: "signup success", status: 200 });
  }
);

router.post("/login", (req, res, next) => {
  passport.authenticate("login", (error, user) => {
    try {
      if (error) {
        return next(error);
      }
      if (!user) {
        return next(new Error("email and password req"));
      }
      req.login(user, { session: false }, (err) => {
        if (err) return next(err);
        return res.status(200).json({ user, status: 200 });
      });
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
});

router.post("/logout", (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: "invalid", status: 400 });
  }
  res.status(200).json({ message: "ok", status: 200 });
});

router.post("/token", (req, res) => {
  if (!req.body || !req.body.refreshToken) {
    res.status(400).json({ message: "invalid", status: 400 });
  } else {
    const { refreshToken } = req.body;
    res
      .status(200)
      .json({ message: `refresh req ${refreshToken}`, status: 200 });
  }
});

module.exports = router;
