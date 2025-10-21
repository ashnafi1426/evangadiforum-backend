const db = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

// Register user
const register = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;

  if (!firstname || !lastname || !username || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "All fields are required" });
  }
  try {
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (firstname, lastname, username, email, password) VALUES (?, ?, ?, ?, ?)";
    const result = await db.query(sql, [firstname, lastname, username, email, hashedPassword]);
    res.status(StatusCodes.CREATED).json({ msg: "User registered", userId: result[0].insertId });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Database error", error: err.message });
  }
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Email and password required" });
  }

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid credentials" });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid credentials" });
    }

    // ✅ Token generation using .env secret
    const token = jwt.sign(
      { user_id: user.id, username: user.username },
      process.env.JWT_SECRET,{ expiresIn: "1d" }
    );
    res.status(StatusCodes.OK).json({
      msg: "Login successful",
      token,
      username: user.username,
      user_id: user.id,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Database error", error: err.message });
  }
};

// ✅ Verify user endpoint
async function checkUser(req, res) {
  const { username, user_id } = req.user;
  res.status(StatusCodes.OK).json({ msg: "Valid user", username, user_id });
}
module.exports = { register, login, checkUser };
