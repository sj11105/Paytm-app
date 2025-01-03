const express = require("express");
const router = express.Router();
const zod = require("zod");
const { usermodel } = require("../db");
const jwttoken = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");

const updatedSchema = zod.object({
  username: zod.string().optional(),
  firstname: zod.string().optional(),
  password: zod.string().optional(),
});

const signupschema = zod.object({
  username: zod.string(),
  firstname: zod.string(),
  password: zod.string(),
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updatedSchema.safeParse(req.body);
  if (!success) {
    res.status(404).json({
      message: "error while updating information",
    });
  }

  const result = await usermodel.updateOne({
    id: req.userId,
    $set: req.body,
  });

  res.json({
    message: "updated successfuly",
  });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const user = await usermodel.find({
    $or: [
      {
        firstname: {
          $regex: filter,
        },
      },
      {
        lastname: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: usermodel.map((user) => ({
      username: user.username,
      firstname: user.firstname,
      _id: user._id,
    })),
  });
});

router.post("/signin", async (req, res) => {
  const body = req.body;
  const user = await usermodel.findOne({ username: body.username });

  const valid = await bcrypt.compare(body.password, user.password);
  if (!valid) {
    return res.json({
      message: "login failed",
    });
  }
  const token = jwt.sign({ userid: user._id }, jwttoken, { expiresIn: "1h" });
  return res.json({
    message: "login successfull",
    token: token,
  });
});

router.post("/signup", async (req, res) => {
  const body = req.body;

  const { success } = signupschema.safeParse(req.body);
  if (!success) {
    return res.json({
      message: "email already taken/incorrect inputs",
    });
  }

  const user = await usermodel.findOne({
    username: body.username,
    if(user) {
      return res.json({
        message: "email already taken/incorrect inputs",
      });
    },
  });

  let hashedpass = await bcrypt.hash(body.password, 10);
  console.log(hashedpass);

  const dbuser = await usermodel.create({
    username: req.body.username,
    firstname: req.body.firstname,
    password: hashedpass,
  });

  const token = jwt.sign({ userid: dbuser._id }, jwttoken);
  res.json({
    message: "user created successfully",
    token: token,
  });
});

module.exports = router;
