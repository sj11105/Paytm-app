const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/paytm");

const userSchema = mongoose.Schema({
  username: String,
  firstname: String,
  password: String,
});

const bankSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  balance: Number,
});

const usermodel = mongoose.model("User", userSchema);
const account = mongoose.model("Account", bankSchema);

module.exports = { usermodel, account };
