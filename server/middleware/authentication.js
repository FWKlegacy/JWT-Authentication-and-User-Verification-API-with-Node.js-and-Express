const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");
    if (!jwtToken) {
      return res.status(401).json("not Authorize");
    }
    const JWT_TOKEN = process.env.JWT;
    const payload = jwt.verify(jwtToken, JWT_TOKEN);
    req.user = payload.user;
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json("not Authorize");
  }
};
