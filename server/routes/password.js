const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const UserModel = require("../models/UserModel");

const path = require("path");
const { request } = require("http");
const router = express.Router();

const gmailEmail = process.env.GMAIL_EMAIL;
const gmailPassword = process.env.GMAIL_PASSWORD;

const smtpTransport = nodemailer.createTransport({
  service: process.env.EMAIL_PROVIDER,
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    defaultLayout: null,
    partialsDir: "./templates",
    layoutsDir: "./templates",
  },
  viewPath: path.resolve(__dirname, "../templates"),
  extName: ".html",
};

smtpTransport.use("compile", hbs(handlebarOptions));

router.post("/forgot-password", async (req, res) => {
  const { email: userEmail } = req.body;

  const user = await UserModel.findOne({ email: userEmail });
  console.log("USER: ", user);
  if (!user) {
    res.status(400).json({ message: "invalid email", status: 400 });
    return;
  }

  // Create user token
  // Make some random bytes into a hex string
  const buffer = crypto.randomBytes(20);
  const token = buffer.toString("hex");

  // Update user reset pass token and exp

  await UserModel.findByIdAndUpdate(
    { _id: user._id },
    { resetToken: token, resetTokenExp: Date.now() + 600000 }
  );

  const emailOptions = {
    to: userEmail,
    from: gmailEmail,
    template: "forgot-password",
    subject: "MMORGP Password Recovery",
    context: {
      url: `http://localhost:${3000}/reset-password.html?token=${token}`,
      name: user.username,
    },
  };
  console.log("EMAIL: ", emailOptions);
  await smtpTransport.sendMail(emailOptions);
  res.status(200).json({ message: `Email sent to your addres!`, status: 200 });
});

router.post("/reset-password", async (req, res, next) => {
  // check password
  if (
    !req.body.token ||
    !req.body.password ||
    !req.body.verifyPassword ||
    req.body.password !== req.body.verifyPassword
  ) {
    res.status(400).json({ message: "passwords do not match", status: 400 });
    return;
  }

  const { email: userEmail } = req.body;
  const user = await UserModel.findOne({
    resetToken: req.body.token,
    resetTokenExp: { $gt: Date.now() },
    email: userEmail,
  });

  if (!user) {
    res.status(400).json({ message: "invalid token", status: 400 });
    return;
  }

  // Update user

  user.password = req.body.password;
  user.resetToken = undefined;
  user.resetTokenExp = undefined;
  await user.save();
  const emailOptions = {
    to: userEmail,
    from: gmailEmail,
    template: "reset-password",
    subject: "MMORGP Ultimate Password Reset",
    context: {
      name: user.username,
    },
  };

  await smtpTransport.sendMail(emailOptions);
  res.status(200).json({ message: `password updated`, status: 200 });
});

module.exports = router;
