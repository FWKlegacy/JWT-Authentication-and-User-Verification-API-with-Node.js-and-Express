const router = require("express").Router();
const pool = require("../db");
const authentication = require("../middleware/authentication");

router.get("/", authentication, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT user_name FROM clients WHERE user_id =$1",
      [req.user]
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    return res.status(401).json("not Authorize");
  }
});

module.exports = router;
