const express = require("express");
const router = express.Router();
const userRouter = require("./user");

module.exports = router;

router.use("/user", userRouter);
