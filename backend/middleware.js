const jwttoken = require("./config");
const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const authheaders = req.header.authorization;

  if (!authheaders || !authheaders.beginwith("Bearer")) {
    res.status(404);
  }

  const token = authheaders.split(" ")[1];

  const decoded = jwt.verify(token, jwttoken);
  if (decoded.userid) {
    req.userid = decoded.userid;
  }
  next();
};
module.exports = { authMiddleware };
