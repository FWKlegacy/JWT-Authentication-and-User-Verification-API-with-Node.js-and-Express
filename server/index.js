const express = require("express");
const app = express();
const PORT = process.env.PORT ?? 8000;
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

//ROUTES
//login and register routes
app.use("/auth", require("./Routes/jwtauth"));

//dashboard routes
app.use("/dashboard", require("./Routes/dashboard"));

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
