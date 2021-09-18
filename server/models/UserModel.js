const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  resetTokwn: {
    type: String,
  },
  resetTokenExp: {
    type: Date,
  },
});

UserSchema.pre("save", async function (next) {
  // Conext of this is the user
  const hash = await bcrypt.has(this.password, 10);
  this.password = hash;
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
