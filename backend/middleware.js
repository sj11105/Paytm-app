const jwttoken = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authheaders = req.headers.authorization; // Correct property

    // Check if the Authorization header exists and starts with "Bearer"
    if (!authheaders || !authheaders.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization header missing or invalid" });
    }

    // Extract the token
    const token = authheaders.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, jwttoken);

    // Attach the user ID to the request object
    if (decoded.userid) {
      req.userid = decoded.userid;
    }

    next(); // Proceed to the next middleware or route
  } catch (err) {
    // Handle errors (e.g., invalid token, missing token, etc.)
    res
      .status(403)
      .json({ message: "Invalid or expired token", error: err.message });
  }
};

module.exports = { authMiddleware };
