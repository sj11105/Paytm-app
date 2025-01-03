const express = require("express");
const app = express();
const cors = require("cors");
const mainrouter = require("./routes/index");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", mainrouter);

app.listen(3000, () => {
  console.log("server is runnin", 3000);
});
