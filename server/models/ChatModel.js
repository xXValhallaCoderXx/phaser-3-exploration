const mongoose = require("mongoose");

const { Schema } = mongoose;

const EmailSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const ChatModel = mongoose.model("chat", EmailSchema);
module.exports = ChatModel;
