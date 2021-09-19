const jwt = require("jsonwebtoken");
const passport = require("passport");
const express = require("express");
const router = express.Router();

const tokenList = {};

router.get("/status", (req, res) => {
  res.status(200).json({ message: "oksss", status: 200 });
});

// Add passport route middleware
router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (request, response, next) => {
    response.status(200).json({ message: "signup successful", status: 200 });
  }
);

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (error, user) => {
    try {
      if (error) {
        return next(error);
      }
      if (!user) {
        return next(new Error("email and password req"));
      }
      req.login(user, { session: false }, (err) => {
        if (err) return next(err);
        // Create JWT
        const payload = {
          _id: user._id,
          email: user.email,
          name: user.username,
        };
        const token = jwt.sign({ user: payload }, process.env.JWT_SECRET, {
          expiresIn: 86400,
        });
        const refreshToken = jwt.sign(
          { user: payload },
          process.env.JWT_REFRESH_SECRET,
          {
            expiresIn: 86400,
          }
        );
        // Store token in  cookie
        res.cookie("jwt", token);
        res.cookie("refreshJwt", refreshToken);

        // Store tokens in memory - should be a DB
        tokenList[refreshToken] = {
          token,
          refreshToken,
          email: user.email,
          _id: user._id,
        };
        return res.status(200).json({ token, refreshToken, user, status: 200 });
      });
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
});

router.route("/logout").get(processLogoutRequest).post(processLogoutRequest);

router.post("/token", (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken in tokenList) {
    const payload = {
      email: tokenList[refreshToken].email,
      _id: tokenList[refreshToken]._id,
      name: tokenList[refreshToken].name,
    };
    const token = jwt.sign({ user: payload }, process.env.JWT_SECRET, {
      expiresIn: 300,
    });
    res.cookie("jwt", token);
    tokenList[refreshToken].token = token;

    res.status(200).json({ token, status: 200 });
  } else {
    res.status(401).json({ message: "unauthroized", status: 401 });
  }
});

function processLogoutRequest(req, res) {
  if (req.cookies) {
    const refeshToken = req.cookies.refreshJwtl;
    if (refeshToken in tokenList) {
      delete tokenList[refeshToken];
    }
    res.clearCookie("jwt");
    res.clearCookie("refreshJwt");
  }
  if (req.method === "POST") {
    res.status(200).json({ message: "logged out", status: 200 });
  } else if (req.method === "GET") {
    res.sendFile("logout.html", { root: "./client" });
  }
}

module.exports = router;
