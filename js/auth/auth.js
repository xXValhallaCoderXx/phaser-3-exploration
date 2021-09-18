const passport = require("passport");
const localStrategy = require("passport-local");

// Handle registrations
passport.use(
  "signup",
  new localStrategy.Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, // Add context of request
    },
    (req, email, password, done) => {
      console.log("EMAIL: ", email, password);
      console.log("BODY: ", req.body);

      const { username } = req.body;
      if (username && username !== "error") {
        return done(null, { name: "joe" });
      } else {
        return done(new Error("Invalid user"));
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
