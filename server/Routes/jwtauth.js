const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtgenarator = require("../Utils/jwtgenarator");
const validInfo = require("../middleware/validInfor");
const authentication = require("../middleware/authentication");

// Registering route
router.post("/register", validInfo, async (req, res) => {
  try {
    // Destructuring (name, email, password)
    const { name, email, password } = req.body;

    // Check if user already exists
    const user = await pool.query(
      "SELECT * FROM clients WHERE user_email = $1",
      [email]
    );
    if (user.rows.length !== 0) {
      return res.status(401).send("User already exists");
    }

    // Bcrypt the user password
    const saltRounds = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // Register new user
    const newUser = await pool.query(
      "INSERT INTO clients (user_name, user_email, user_password) VALUES($1, $2, $3) RETURNING*",
      [name, email, hashedPassword]
    );
    //generating jwt token
    const token = jwtgenarator(newUser.rows[0].user_id);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//login route
router.post("/login", validInfo, async (req, res) => {
  try {
    // Destructuring (name, email, password)
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM clients WHERE user_email =$1",
      [email]
    );

    if (user.rows.length === 0)
      return res.status(401).json("email or password incorrect");

    //compare password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );
    if (!validPassword)
      return res.status(401).json("email or password incorrect");

    //generating jwt token
    const token = jwtgenarator(user.rows[0].user_id);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/is-verify", authentication, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
