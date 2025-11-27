const UserService = require("../services/userService");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;
  if (!firstname || !lastname || !username || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "All fields are required" });
  }

  try {
    const existing = await UserService.findByEmail(email);

    if (existing.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Email already exists" });
    }

    const user = await UserService.createUser({
      firstname,
      lastname,
      username,
      email,
      password,
    });

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .status(StatusCodes.CREATED)
      .json({ msg: "User registered", userId: user.id, token });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Database error", error: err.message });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Email and password required" });
  }

  try {
    const result = await UserService.loginUser(email, password);

    if (!result) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid credentials" });
    }

    const { user, token } = result;

    res.status(StatusCodes.OK).json({
      msg: "Login successful",
      token,
      username: user.username,
      user_id: user.id,
    });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Database error", error: err.message });
  }
};

const checkUser = async (req, res) => {
  const { username, user_id } = req.user;
  res.status(StatusCodes.OK).json({ msg: "Valid user", username, user_id });
};

module.exports = { register, login, checkUser };
