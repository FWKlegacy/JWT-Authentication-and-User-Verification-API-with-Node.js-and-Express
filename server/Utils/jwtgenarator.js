const jwt = require("jsonwebtoken");
require("dotenv").config;

function jwtgenarator(user_id) {
  const payload = {
    user: user_id,
  };

  const JWT_TOKEN = process.env.JWT;
  return jwt.sign(payload, JWT_TOKEN, { expiresIn: "1hr" });
}

module.exports = jwtgenarator;
