const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/paytm");

const userSchema = mongoose.Schema({
  username: String,
  firstname: String,
  password: String,
});

const usermodel = mongoose.model("User", userSchema);
module.exports = { usermodel };
