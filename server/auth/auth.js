const passport = require("passport");
const localStrategy = require("passport-local");
const UserModel = require("../models/UserModel");

// Handle registrations
passport.use(
  "signup",
  new localStrategy.Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, // Add context of request
    },
    async (req, email, password, done) => {
      try {
        const { username } = req.body;
        const user = await UserModel.create({ email, password, username });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Handle Login

passport.use(
  "login",
  new localStrategy.Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      if (email !== "joe@test.com") {
        return done(new Error(" user mot nofund"));
      }
      if (password !== "test") {
        return done(new Error(" passowrd mot nofund"));
      }

      return done(null, { name: "joe" });
    }
  )
);
